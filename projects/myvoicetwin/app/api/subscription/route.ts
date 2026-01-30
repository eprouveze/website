import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerComponentClient, createServiceClient, Profile, Subscription } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Subscription price: $29/year (2900 cents)
const SUBSCRIPTION_PRICE_CENTS = 2900

/**
 * POST - Create a Stripe subscription checkout session
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user already has an active subscription
    const serviceClient = createServiceClient()
    const { data: existingSubscription } = await serviceClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      )
    }

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create or retrieve Stripe customer
    let customerId: string | undefined

    // Check if user has a stripe_customer_id in their profile
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()
    const typedProfile = profile as Profile | null

    if (typedProfile?.stripe_customer_id) {
      customerId = typedProfile.stripe_customer_id
    } else {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Update profile with stripe_customer_id
      await serviceClient
        .from('profiles')
        .update({ stripe_customer_id: customerId } as never)
        .eq('id', user.id)
    }

    // Create Stripe Checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'My Voice Twin Annual Subscription',
              description: 'Full access to My Voice Twin for one year',
            },
            unit_amount: SUBSCRIPTION_PRICE_CENTS,
            recurring: {
              interval: 'year',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
        },
      },
      success_url: `${origin}/dashboard/deploy?subscription=success`,
      cancel_url: `${origin}/dashboard/deploy?subscription=cancelled`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Subscription creation error:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create subscription checkout session' },
      { status: 500 }
    )
  }
}

/**
 * GET - Get user's subscription status
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's subscription from database
    const serviceClient = createServiceClient()
    const { data: subscription, error: subscriptionError } = await serviceClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    const typedSubscription = subscription as Subscription | null

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" - that's okay
      console.error('Error fetching subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      )
    }

    if (!typedSubscription) {
      return NextResponse.json({
        hasSubscription: false,
        subscription: null,
      })
    }

    // Optionally sync with Stripe to get the latest status
    if (typedSubscription.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          typedSubscription.stripe_subscription_id
        )

        // Update local subscription if status changed
        if (stripeSubscription.status !== typedSubscription.status) {
          await serviceClient
            .from('subscriptions')
            .update({
              status: stripeSubscription.status as typeof typedSubscription.status,
              current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            } as never)
            .eq('id', typedSubscription.id)

          // Return updated data
          return NextResponse.json({
            hasSubscription: stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing',
            subscription: {
              ...typedSubscription,
              status: stripeSubscription.status,
              current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            },
          })
        }
      } catch (stripeError) {
        console.error('Error syncing with Stripe:', stripeError)
        // Continue with local data if Stripe sync fails
      }
    }

    return NextResponse.json({
      hasSubscription: typedSubscription.status === 'active' || typedSubscription.status === 'trialing',
      subscription: typedSubscription,
    })
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Cancel subscription
 */
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's active subscription
    const serviceClient = createServiceClient()
    const { data: subscription, error: subscriptionError } = await serviceClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()
    const typedSubscription = subscription as Subscription | null

    if (subscriptionError || !typedSubscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    if (!typedSubscription.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'Invalid subscription - missing Stripe ID' },
        { status: 400 }
      )
    }

    // Cancel the subscription in Stripe (at period end)
    const canceledSubscription = await stripe.subscriptions.update(
      typedSubscription.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    )

    // Update the subscription in our database
    await serviceClient
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', typedSubscription.id)

    return NextResponse.json({
      message: 'Subscription will be canceled at the end of the current billing period',
      cancelAt: canceledSubscription.cancel_at
        ? new Date(canceledSubscription.cancel_at * 1000).toISOString()
        : typedSubscription.current_period_end,
    })
  } catch (error) {
    console.error('Subscription cancellation error:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}

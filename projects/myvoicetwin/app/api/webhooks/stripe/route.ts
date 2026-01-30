import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Extract metadata
      const product = session.metadata?.product as string
      const regenerationLimit = parseInt(session.metadata?.regeneration_limit || '1')
      const referralCode = session.metadata?.referral_code // Referral code if used

      // Get customer email
      const customerEmail = session.customer_details?.email || session.customer_email

      if (!customerEmail) {
        console.error('No customer email in session:', session.id)
        break
      }

      // Check if purchase already exists
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('stripe_session_id', session.id)
        .single()

      if (existingPurchase) {
        console.log('Purchase already recorded:', session.id)
        break
      }

      // Find or create user profile
      let userId: string | null = null

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail.toLowerCase())
        .single()

      if (profile) {
        userId = profile.id
      }

      // Create purchase record
      const purchaseData: {
        user_id: string | null
        email: string
        product: string
        amount_cents: number
        currency: string
        stripe_session_id: string
        stripe_payment_intent: string | null
        status: string
        regeneration_limit: number
        max_downloads: number
      } = {
        user_id: userId,
        email: customerEmail.toLowerCase(),
        product: product || 'pro',
        amount_cents: session.amount_total || 0,
        currency: session.currency || 'usd',
        stripe_session_id: session.id,
        stripe_payment_intent: typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id || null,
        status: 'completed',
        regeneration_limit: regenerationLimit,
        max_downloads: 10,
      }

      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert(purchaseData)
        .select()
        .single()

      if (purchaseError) {
        console.error('Error creating purchase:', purchaseError)
        break
      }

      console.log('Purchase recorded:', purchase.id)

      // Update user profile has_paid flag
      if (userId) {
        await supabase
          .from('profiles')
          .update({ has_paid: true })
          .eq('id', userId)
      }

      // Process referral code if one was used
      if (referralCode) {
        try {
          // Get the referral code details
          const { data: referralCodeData } = await supabase
            .from('referral_codes')
            .select('*')
            .eq('code', referralCode.toUpperCase().trim())
            .eq('is_active', true)
            .single()

          if (referralCodeData) {
            // Don't allow self-referrals
            if (referralCodeData.user_id !== userId) {
              // Calculate commission
              const creditAmountCents = Math.round(
                ((session.amount_total || 0) * referralCodeData.commission_percent) / 100
              )

              // Create the referral credit
              const { error: creditError } = await supabase
                .from('referral_credits')
                .insert({
                  referrer_id: referralCodeData.user_id,
                  referred_user_id: userId,
                  purchase_id: purchase.id,
                  referral_code_id: referralCodeData.id,
                  credit_amount_cents: creditAmountCents,
                  status: 'pending',
                })

              if (creditError) {
                console.error('Error creating referral credit:', creditError)
              } else {
                // Increment the referral code usage count
                await supabase
                  .from('referral_codes')
                  .update({ uses: referralCodeData.uses + 1 })
                  .eq('id', referralCodeData.id)

                console.log(
                  `Referral credit created: $${(creditAmountCents / 100).toFixed(2)} for referrer`
                )
              }
            }
          }
        } catch (err) {
          console.error('Error processing referral:', err)
        }
      }

      // Note: Referral code for the purchaser is auto-created via database trigger
      // (see migration 007_add_referral_system.sql)

      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Checkout session expired:', session.id)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

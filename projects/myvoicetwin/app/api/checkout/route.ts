import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Multi-tier pricing configuration
const PRICING_TIERS = {
  starter: {
    price: 4900, // $49
    name: 'My Voice Twin - Starter',
    description: '1 language, 3 contexts, no subscription',
    regeneration_limit: 1,
  },
  complete: {
    price: 9900, // $99
    name: 'My Voice Twin - Complete',
    description: 'Multi-language, all contexts, 1 year subscription included',
    regeneration_limit: 3,
  },
  executive: {
    price: 24900, // $249
    name: 'My Voice Twin - Executive',
    description: 'Everything + priority support',
    regeneration_limit: 5,
  },
  'done-for-you': {
    price: 49900, // $499
    name: 'My Voice Twin - Done For You',
    description: 'We do everything for you',
    regeneration_limit: 10, // unlimited represented as 10
  },
} as const

type ProductTier = keyof typeof PRICING_TIERS

export async function POST(request: NextRequest) {
  try {
    const { product } = await request.json()

    // Validate product tier
    if (!product || !PRICING_TIERS[product as ProductTier]) {
      return NextResponse.json(
        { error: 'Valid product tier is required (starter, complete, executive, done-for-you)' },
        { status: 400 }
      )
    }

    const tier = PRICING_TIERS[product as ProductTier]

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create Stripe Checkout session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: tier.price,
            product_data: {
              name: tier.name,
              description: tier.description,
            },
          },
          quantity: 1,
        },
      ],
      // Store product info and regeneration limit in metadata for the webhook
      metadata: {
        product: product,
        regeneration_limit: String(tier.regeneration_limit),
      },
      // Collect customer email
      customer_creation: 'always',
      // Success and cancel URLs
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      // Allow promotion codes
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

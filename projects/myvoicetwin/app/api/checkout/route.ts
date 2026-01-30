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
    description: '1 language, 3 matrix sections, 1 regeneration',
    regeneration_limit: 1,
    languages: 1,
    matrix_sections: 3,
    first_year_discount: false,
    includes_subscription: false,
    audio_credits: false,
    priority_support: false,
  },
  pro: {
    price: 9900, // $99
    name: 'My Voice Twin - Pro',
    description: 'Unlimited languages & sections, 1 regeneration, subscription discount',
    regeneration_limit: 1,
    languages: -1, // unlimited
    matrix_sections: -1, // unlimited
    first_year_discount: true, // Eligible for $10 first year subscription
    includes_subscription: false,
    audio_credits: false,
    priority_support: false,
  },
  executive: {
    price: 24900, // $249
    name: 'My Voice Twin - Executive',
    description: 'Everything in Pro + 1 year subscription + audio credits + priority support',
    regeneration_limit: 1,
    languages: -1, // unlimited
    matrix_sections: -1, // unlimited
    first_year_discount: false, // already includes subscription
    includes_subscription: true,
    audio_credits: true,
    priority_support: true,
  },
} as const

type ProductTier = keyof typeof PRICING_TIERS

export async function POST(request: NextRequest) {
  try {
    const { product } = await request.json()

    // Validate product tier
    if (!product || !PRICING_TIERS[product as ProductTier]) {
      return NextResponse.json(
        { error: 'Valid product tier is required (starter, pro, executive)' },
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
      // Store product info and tier details in metadata for the webhook
      metadata: {
        product: product,
        regeneration_limit: String(tier.regeneration_limit),
        languages: String(tier.languages),
        matrix_sections: String(tier.matrix_sections),
        first_year_discount: String(tier.first_year_discount),
        includes_subscription: String(tier.includes_subscription),
        audio_credits: String(tier.audio_credits),
        priority_support: String(tier.priority_support),
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

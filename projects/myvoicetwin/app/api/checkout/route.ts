import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase'

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
    const { product, referral_code } = await request.json()

    // Validate product tier
    if (!product || !PRICING_TIERS[product as ProductTier]) {
      return NextResponse.json(
        { error: 'Valid product tier is required (starter, pro, executive)' },
        { status: 400 }
      )
    }

    const tier = PRICING_TIERS[product as ProductTier]
    let finalPrice = tier.price
    let validReferralCode: string | null = null
    let discountPercent = 0

    // Validate and apply referral code if provided
    if (referral_code) {
      const supabase = createServiceClient()
      const { data: referral } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', referral_code.toUpperCase().trim())
        .eq('is_active', true)
        .single()

      if (referral) {
        // Check usage limits
        if (referral.max_uses === null || referral.uses < referral.max_uses) {
          validReferralCode = referral.code
          discountPercent = referral.discount_percent
          const discountAmount = Math.round((tier.price * discountPercent) / 100)
          finalPrice = tier.price - discountAmount
        }
      }
    }

    // Get the origin for redirect URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Build metadata
    const metadata: Record<string, string> = {
      product: product,
      regeneration_limit: String(tier.regeneration_limit),
      languages: String(tier.languages),
      matrix_sections: String(tier.matrix_sections),
      first_year_discount: String(tier.first_year_discount),
      includes_subscription: String(tier.includes_subscription),
      audio_credits: String(tier.audio_credits),
      priority_support: String(tier.priority_support),
    }

    // Add referral code to metadata if valid
    if (validReferralCode) {
      metadata.referral_code = validReferralCode
      metadata.referral_discount_percent = String(discountPercent)
    }

    // Build line item description
    let description = tier.description
    if (validReferralCode) {
      description += ` (${discountPercent}% referral discount applied)`
    }

    // Create Stripe Checkout session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: finalPrice,
            product_data: {
              name: tier.name,
              description: description,
            },
          },
          quantity: 1,
        },
      ],
      // Store product info and tier details in metadata for the webhook
      metadata,
      // Collect customer email
      customer_creation: 'always',
      // Success and cancel URLs
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
      // Allow promotion codes (in addition to our referral codes)
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      url: session.url,
      applied_referral: validReferralCode
        ? {
            code: validReferralCode,
            discount_percent: discountPercent,
            original_price: tier.price,
            final_price: finalPrice,
          }
        : null,
    })
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

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// POST - Validate a referral code for checkout
export async function POST(request: NextRequest) {
  try {
    const { code, amount_cents } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch the referral code
    const { data: referral, error } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !referral) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid referral code',
      })
    }

    // Check usage limits
    if (referral.max_uses !== null && referral.uses >= referral.max_uses) {
      return NextResponse.json({
        valid: false,
        error: 'This referral code has reached its usage limit',
      })
    }

    // Calculate discount
    const discountAmountCents = Math.round((amount_cents * referral.discount_percent) / 100)
    const finalAmountCents = amount_cents - discountAmountCents

    return NextResponse.json({
      valid: true,
      referral: {
        code: referral.code,
        discount_percent: referral.discount_percent,
      },
      original_amount_cents: amount_cents,
      discount_amount_cents: discountAmountCents,
      final_amount_cents: finalAmountCents,
    })
  } catch (error) {
    console.error('Referral validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

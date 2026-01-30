import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// POST - Validate a discount code
export async function POST(request: NextRequest) {
  try {
    const { code, product, amount_cents } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Discount code is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch the discount code
    const { data: discount, error } = await supabase
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !discount) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid discount code',
      })
    }

    // Check if code has expired
    if (discount.valid_until && new Date(discount.valid_until) < new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code has expired',
      })
    }

    // Check if code hasn't started yet
    if (new Date(discount.valid_from) > new Date()) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code is not yet valid',
      })
    }

    // Check usage limits
    if (discount.max_uses !== null && discount.current_uses >= discount.max_uses) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code has reached its usage limit',
      })
    }

    // Check minimum purchase amount
    if (discount.min_purchase_cents && amount_cents < discount.min_purchase_cents) {
      const minAmount = (discount.min_purchase_cents / 100).toFixed(2)
      return NextResponse.json({
        valid: false,
        error: `Minimum purchase of $${minAmount} required for this code`,
      })
    }

    // Check product applicability
    if (
      discount.applicable_products &&
      discount.applicable_products.length > 0 &&
      product &&
      !discount.applicable_products.includes(product)
    ) {
      return NextResponse.json({
        valid: false,
        error: 'This discount code is not valid for this product',
      })
    }

    // Calculate discount
    let discountAmountCents: number
    if (discount.discount_type === 'percentage') {
      discountAmountCents = Math.round((amount_cents * discount.discount_value) / 100)
    } else {
      discountAmountCents = discount.discount_value
    }

    // Ensure discount doesn't exceed purchase amount
    discountAmountCents = Math.min(discountAmountCents, amount_cents)

    const finalAmountCents = amount_cents - discountAmountCents

    return NextResponse.json({
      valid: true,
      discount: {
        code: discount.code,
        description: discount.description,
        type: discount.discount_type,
        value: discount.discount_value,
      },
      original_amount_cents: amount_cents,
      discount_amount_cents: discountAmountCents,
      final_amount_cents: finalAmountCents,
    })
  } catch (error) {
    console.error('Discount validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

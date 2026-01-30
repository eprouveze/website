import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// POST - Record a referral credit (called from Stripe webhook)
// This is an internal API, not meant for public use
export async function POST(request: NextRequest) {
  try {
    // Verify internal API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { referral_code, purchase_id, referred_user_id, purchase_amount_cents } =
      await request.json()

    if (!referral_code || !purchase_id || !purchase_amount_cents) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get the referral code details
    const { data: referralCodeData, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', referral_code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (codeError || !referralCodeData) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
    }

    // Calculate commission
    const creditAmountCents = Math.round(
      (purchase_amount_cents * referralCodeData.commission_percent) / 100
    )

    // Create the credit record
    const { data: credit, error: creditError } = await supabase
      .from('referral_credits')
      .insert({
        referrer_id: referralCodeData.user_id,
        referred_user_id: referred_user_id || null,
        purchase_id,
        referral_code_id: referralCodeData.id,
        credit_amount_cents: creditAmountCents,
        status: 'pending',
      })
      .select()
      .single()

    if (creditError) {
      console.error('Error creating referral credit:', creditError)
      return NextResponse.json({ error: 'Failed to create credit' }, { status: 500 })
    }

    // Increment the referral code usage count
    await supabase
      .from('referral_codes')
      .update({ uses: referralCodeData.uses + 1 })
      .eq('id', referralCodeData.id)

    return NextResponse.json({
      success: true,
      credit: {
        id: credit.id,
        amount_cents: credit.credit_amount_cents,
        status: credit.status,
      },
    })
  } catch (error) {
    console.error('Referral credit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

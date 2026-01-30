import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET - Check affiliate status by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get affiliate data
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select(`
        id,
        email,
        name,
        status,
        total_referrals,
        total_earnings_cents,
        total_paid_out_cents,
        approved_at,
        rejection_reason,
        created_at,
        referral_code_id
      `)
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !affiliate) {
      return NextResponse.json({
        found: false,
        message: 'No affiliate application found with this email',
      })
    }

    // If approved, get referral code details
    let referralCode = null
    if (affiliate.status === 'approved' && affiliate.referral_code_id) {
      const { data: code } = await supabase
        .from('referral_codes')
        .select('code, discount_percent, commission_percent, uses')
        .eq('id', affiliate.referral_code_id)
        .single()

      if (code) {
        referralCode = code
      }
    }

    return NextResponse.json({
      found: true,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        status: affiliate.status,
        applied_at: affiliate.created_at,
        approved_at: affiliate.approved_at,
        rejection_reason: affiliate.status === 'rejected' ? affiliate.rejection_reason : null,
      },
      stats: affiliate.status === 'approved' ? {
        total_referrals: affiliate.total_referrals,
        total_earnings_cents: affiliate.total_earnings_cents,
        total_paid_out_cents: affiliate.total_paid_out_cents,
        pending_payout_cents: affiliate.total_earnings_cents - affiliate.total_paid_out_cents,
      } : null,
      referral_code: referralCode ? {
        code: referralCode.code,
        discount_percent: referralCode.discount_percent,
        commission_percent: referralCode.commission_percent,
        uses: referralCode.uses,
        share_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://myvoicetwin.com'}?ref=${referralCode.code}`,
      } : null,
    })
  } catch (error) {
    console.error('Affiliate status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

// GET - Get current user's referral code and stats
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's referral code
    const { data: referralCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (codeError) {
      // User doesn't have a referral code yet (hasn't purchased)
      return NextResponse.json({
        has_code: false,
        message: 'Complete a purchase to get your referral code',
      })
    }

    // Get referral stats
    const { data: credits, error: creditsError } = await supabase
      .from('referral_credits')
      .select('*')
      .eq('referrer_id', user.id)

    if (creditsError) {
      console.error('Error fetching credits:', creditsError)
    }

    // Calculate stats
    const totalReferrals = credits?.length || 0
    const pendingCredits = credits?.filter((c) => c.status === 'pending') || []
    const approvedCredits = credits?.filter((c) => c.status === 'approved') || []
    const paidOutCredits = credits?.filter((c) => c.status === 'paid_out') || []

    const pendingAmount = pendingCredits.reduce((sum, c) => sum + c.credit_amount_cents, 0)
    const approvedAmount = approvedCredits.reduce((sum, c) => sum + c.credit_amount_cents, 0)
    const paidOutAmount = paidOutCredits.reduce((sum, c) => sum + c.credit_amount_cents, 0)

    return NextResponse.json({
      has_code: true,
      referral_code: {
        code: referralCode.code,
        discount_percent: referralCode.discount_percent,
        commission_percent: referralCode.commission_percent,
        uses: referralCode.uses,
        is_active: referralCode.is_active,
      },
      stats: {
        total_referrals: totalReferrals,
        pending_amount_cents: pendingAmount,
        approved_amount_cents: approvedAmount,
        paid_out_amount_cents: paidOutAmount,
        total_earned_cents: pendingAmount + approvedAmount + paidOutAmount,
      },
      share_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://myvoicetwin.com'}?ref=${referralCode.code}`,
    })
  } catch (error) {
    console.error('Get referral code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

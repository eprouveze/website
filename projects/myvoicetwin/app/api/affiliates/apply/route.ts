import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// POST - Apply to become an affiliate
export async function POST(request: NextRequest) {
  try {
    const { email, name, payout_email, payout_method, application_note } = await request.json()

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Check if email already exists in affiliates
    const { data: existingAffiliate } = await supabase
      .from('affiliates')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existingAffiliate) {
      if (existingAffiliate.status === 'pending') {
        return NextResponse.json({
          error: 'An application with this email is already pending review',
        }, { status: 400 })
      } else if (existingAffiliate.status === 'approved') {
        return NextResponse.json({
          error: 'This email is already registered as an affiliate',
        }, { status: 400 })
      } else if (existingAffiliate.status === 'rejected') {
        return NextResponse.json({
          error: 'A previous application with this email was rejected. Please contact support.',
        }, { status: 400 })
      }
    }

    // Check if this email is already a customer (they should use their referral code instead)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existingProfile) {
      // Check if they have a referral code
      const { data: existingCode } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', existingProfile.id)
        .single()

      if (existingCode) {
        return NextResponse.json({
          error: 'You already have a referral code! Log in to your dashboard to find it.',
          existing_code: true,
        }, { status: 400 })
      }
    }

    // Create affiliate application
    const { data: affiliate, error: insertError } = await supabase
      .from('affiliates')
      .insert({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        payout_email: payout_email?.trim() || email.toLowerCase().trim(),
        payout_method: payout_method || 'paypal',
        application_note: application_note?.trim() || null,
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating affiliate:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! We will review it within 48 hours.',
      affiliate_id: affiliate.id,
    })
  } catch (error) {
    console.error('Affiliate application error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

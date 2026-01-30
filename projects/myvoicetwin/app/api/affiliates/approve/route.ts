import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// POST - Approve an affiliate application (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { affiliate_id, action, rejection_reason } = await request.json()

    if (!affiliate_id || !action) {
      return NextResponse.json(
        { error: 'affiliate_id and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'action must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Get affiliate
    const { data: affiliate, error: fetchError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('id', affiliate_id)
      .single()

    if (fetchError || !affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
    }

    if (affiliate.status !== 'pending') {
      return NextResponse.json(
        { error: `Affiliate is already ${affiliate.status}` },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      // Generate referral code for affiliate
      // First, check if there's a profile with this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', affiliate.email)
        .single()

      let referralCodeId: string | null = null

      // Create a temporary profile-less referral code for affiliates
      // We'll use a special approach: create the code without user_id initially
      // and link it to the affiliate table

      // Generate unique code
      const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = 'AFF-'
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return code
      }

      let code = generateCode()
      let codeExists = true

      // Ensure unique code
      while (codeExists) {
        const { data: existing } = await supabase
          .from('referral_codes')
          .select('id')
          .eq('code', code)
          .single()

        if (!existing) {
          codeExists = false
        } else {
          code = generateCode()
        }
      }

      // If affiliate has an existing profile, use that user_id
      // Otherwise, we need a different approach - for now, create a placeholder
      if (existingProfile) {
        const { data: newCode, error: codeError } = await supabase
          .from('referral_codes')
          .insert({
            user_id: existingProfile.id,
            code,
            discount_percent: 20,
            commission_percent: 20,
          })
          .select()
          .single()

        if (codeError) {
          console.error('Error creating referral code:', codeError)
          return NextResponse.json(
            { error: 'Failed to create referral code' },
            { status: 500 }
          )
        }

        referralCodeId = newCode.id
      } else {
        // For affiliates without accounts, we need to handle this differently
        // Create a dummy profile for the affiliate or use a service account
        // For now, we'll reject if no profile exists
        return NextResponse.json({
          error: 'Affiliate must create an account first before approval',
          suggestion: 'Ask the affiliate to sign up at the website first',
        }, { status: 400 })
      }

      // Update affiliate status
      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          status: 'approved',
          referral_code_id: referralCodeId,
          approved_at: new Date().toISOString(),
        })
        .eq('id', affiliate_id)

      if (updateError) {
        console.error('Error updating affiliate:', updateError)
        return NextResponse.json(
          { error: 'Failed to approve affiliate' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Affiliate approved successfully',
        referral_code: code,
      })
    } else {
      // Reject
      if (!rejection_reason) {
        return NextResponse.json(
          { error: 'rejection_reason is required when rejecting' },
          { status: 400 }
        )
      }

      const { error: updateError } = await supabase
        .from('affiliates')
        .update({
          status: 'rejected',
          rejection_reason,
        })
        .eq('id', affiliate_id)

      if (updateError) {
        console.error('Error rejecting affiliate:', updateError)
        return NextResponse.json(
          { error: 'Failed to reject affiliate' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Affiliate rejected',
      })
    }
  } catch (error) {
    console.error('Affiliate approval error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

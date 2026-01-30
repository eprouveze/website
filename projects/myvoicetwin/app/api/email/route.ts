import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient, createServiceClient } from '@/lib/supabase'
import {
  sendWelcomeEmail,
  sendQuestionnaireCompleteEmail,
  sendReadyToGenerateEmail,
  sendPurchaseConfirmationEmail,
  sendAbandonedCartEmail,
} from '@/lib/email'

// Internal API key for server-to-server calls
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY

type EmailType =
  | 'welcome'
  | 'questionnaire_complete'
  | 'ready_to_generate'
  | 'purchase_confirmation'
  | 'abandoned_cart'

interface EmailRequest {
  type: EmailType
  email: string
  data?: {
    name?: string
    sampleCount?: number
    product?: string
    downloadToken?: string
    stage?: 'questionnaire' | 'samples' | 'checkout'
  }
}

/**
 * POST /api/email
 * Send transactional emails (internal use only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check for internal API key or authenticated admin
    const apiKey = request.headers.get('x-api-key')
    const isInternalCall = apiKey === INTERNAL_API_KEY

    if (!isInternalCall) {
      // Verify user is authenticated for non-internal calls
      const cookieStore = await cookies()
      const supabase = await createServerComponentClient(cookieStore)
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const body: EmailRequest = await request.json()
    const { type, email, data } = body

    if (!type || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: type, email' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, data?.name)
        break

      case 'questionnaire_complete':
        result = await sendQuestionnaireCompleteEmail(email)
        break

      case 'ready_to_generate':
        if (!data?.sampleCount) {
          return NextResponse.json(
            { error: 'Missing sampleCount for ready_to_generate email' },
            { status: 400 }
          )
        }
        result = await sendReadyToGenerateEmail(email, data.sampleCount)
        break

      case 'purchase_confirmation':
        if (!data?.product || !data?.downloadToken) {
          return NextResponse.json(
            { error: 'Missing product or downloadToken for purchase_confirmation email' },
            { status: 400 }
          )
        }
        result = await sendPurchaseConfirmationEmail(email, data.product, data.downloadToken)
        break

      case 'abandoned_cart':
        if (!data?.stage) {
          return NextResponse.json(
            { error: 'Missing stage for abandoned_cart email' },
            { status: 400 }
          )
        }
        result = await sendAbandonedCartEmail(email, data.stage)
        break

      default:
        return NextResponse.json(
          { error: `Unknown email type: ${type}` },
          { status: 400 }
        )
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      emailId: result.id,
    })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

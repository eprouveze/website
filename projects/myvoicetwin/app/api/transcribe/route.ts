import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Stripe from 'stripe'
import { createServerComponentClient, createServiceClient, type AudioUpload } from '@/lib/supabase'

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Pricing tiers based on audio length (in seconds)
const PRICING_TIERS = [
  { maxSeconds: 15 * 60, priceCents: 1900, label: 'Up to 15 minutes' },
  { maxSeconds: 60 * 60, priceCents: 2900, label: '15-60 minutes' },
  { maxSeconds: 3 * 60 * 60, priceCents: 4900, label: '1-3 hours' },
] as const

// Maximum file size (25MB - OpenAI limit)
const MAX_FILE_SIZE = 25 * 1024 * 1024

// Supported audio formats
const SUPPORTED_FORMATS = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'audio/flac',
  'audio/m4a',
]

function getPricingTier(durationSeconds: number) {
  for (const tier of PRICING_TIERS) {
    if (durationSeconds <= tier.maxSeconds) {
      return tier
    }
  }
  return null // Too long
}

/**
 * POST /api/transcribe
 * Upload audio file for transcription (paid add-on)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    // 2. Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const action = formData.get('action') as string // 'estimate' or 'transcribe'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 }
      )
    }

    // 3. Validate file type
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file format. Supported: MP3, MP4, WAV, WEBM, OGG, FLAC, M4A`,
        },
        { status: 400 }
      )
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      )
    }

    const serviceClient = createServiceClient()

    // 5. For estimate action, just return pricing
    if (action === 'estimate') {
      // We can't know duration without processing, so return all tiers
      return NextResponse.json({
        tiers: PRICING_TIERS.map((t) => ({
          maxMinutes: Math.floor(t.maxSeconds / 60),
          priceCents: t.priceCents,
          priceFormatted: `$${(t.priceCents / 100).toFixed(0)}`,
          label: t.label,
        })),
        note: 'Price determined after upload based on audio duration',
      })
    }

    // 6. Check if payment token provided (for paid transcription)
    const paymentToken = formData.get('payment_token') as string | null

    // 7. Create upload record
    const { data: uploadRecord, error: insertError } = await serviceClient
      .from('audio_uploads')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: '', // Will be updated after storage
        file_size_bytes: file.size,
        status: 'processing',
      } as never)
      .select()
      .single()

    if (insertError || !uploadRecord) {
      console.error('Error creating upload record:', insertError)
      return NextResponse.json(
        { error: 'Failed to process upload.' },
        { status: 500 }
      )
    }

    // Type assertion for upload record
    const typedUpload = uploadRecord as AudioUpload

    // 8. Transcribe with Whisper
    let transcription: string
    let durationSeconds: number

    try {
      const response = await openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        response_format: 'verbose_json',
      })

      transcription = response.text
      durationSeconds = Math.ceil(response.duration || 0)
    } catch (whisperError) {
      // Update record with failure
      await serviceClient
        .from('audio_uploads')
        .update({
          status: 'failed',
          error_message:
            whisperError instanceof Error
              ? whisperError.message
              : 'Transcription failed',
        } as never)
        .eq('id', typedUpload.id)

      console.error('Whisper error:', whisperError)
      return NextResponse.json(
        { error: 'Failed to transcribe audio. Please try again.' },
        { status: 500 }
      )
    }

    // 9. Determine pricing
    const pricingTier = getPricingTier(durationSeconds)

    if (!pricingTier) {
      await serviceClient
        .from('audio_uploads')
        .update({
          status: 'failed',
          error_message: 'Audio too long (max 3 hours)',
          duration_seconds: durationSeconds,
        } as never)
        .eq('id', typedUpload.id)

      return NextResponse.json(
        { error: 'Audio too long. Maximum duration is 3 hours.' },
        { status: 400 }
      )
    }

    // 10. If no payment token, require payment first
    if (!paymentToken) {
      // Store transcription temporarily, mark as pending payment
      await serviceClient
        .from('audio_uploads')
        .update({
          status: 'pending',
          duration_seconds: durationSeconds,
          transcription: transcription, // Store temporarily
          cost_cents: pricingTier.priceCents,
        } as never)
        .eq('id', typedUpload.id)

      // Create Stripe checkout session for audio add-on
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Audio Transcription (${pricingTier.label})`,
                description: `Transcription of ${file.name} (${Math.ceil(durationSeconds / 60)} minutes)`,
              },
              unit_amount: pricingTier.priceCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          upload_id: typedUpload.id,
          user_id: user.id,
          type: 'audio_transcription',
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/samples?transcription=${typedUpload.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/samples?cancelled=true`,
      })

      return NextResponse.json({
        requiresPayment: true,
        uploadId: typedUpload.id,
        durationMinutes: Math.ceil(durationSeconds / 60),
        priceCents: pricingTier.priceCents,
        priceFormatted: `$${(pricingTier.priceCents / 100).toFixed(0)}`,
        checkoutUrl: session.url,
      })
    }

    // 11. Verify payment token and complete transcription
    const { data: verifiedUploadData } = await serviceClient
      .from('audio_uploads')
      .select('*')
      .eq('id', paymentToken)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single()

    const verifiedUpload = verifiedUploadData as AudioUpload | null

    if (!verifiedUpload || !verifiedUpload.stripe_payment_id) {
      return NextResponse.json(
        { error: 'Invalid or unpaid transcription.' },
        { status: 400 }
      )
    }

    // 12. Mark as completed and return transcription
    await serviceClient
      .from('audio_uploads')
      .update({
        status: 'completed',
        processed_at: new Date().toISOString(),
      } as never)
      .eq('id', verifiedUpload.id)

    return NextResponse.json({
      success: true,
      uploadId: verifiedUpload.id,
      transcription: verifiedUpload.transcription,
      durationMinutes: Math.ceil((verifiedUpload.duration_seconds || 0) / 60),
      wordCount: verifiedUpload.transcription?.split(/\s+/).length || 0,
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/transcribe
 * Get transcription status or result
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const uploadId = searchParams.get('id')

    if (!uploadId) {
      // Return all user's transcriptions
      const serviceClient = createServiceClient()
      const { data: uploads, error } = await serviceClient
        .from('audio_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch transcriptions.' },
          { status: 500 }
        )
      }

      return NextResponse.json({ uploads })
    }

    // Return specific transcription
    const serviceClient = createServiceClient()
    const { data: upload, error } = await serviceClient
      .from('audio_uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single()

    if (error || !upload) {
      return NextResponse.json(
        { error: 'Transcription not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ upload })
  } catch (error) {
    console.error('Get transcription error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}

// Reject other methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

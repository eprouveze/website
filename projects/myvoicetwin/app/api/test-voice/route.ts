import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerComponentClient, createServiceClient, type VoiceProfile } from '@/lib/supabase'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Rate limiting constants
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_TESTS_PER_HOUR = 10

// Request body type
interface TestVoiceRequest {
  message: string
  context: 'email' | 'slack' | 'report' | 'social'
  audience?: string
  language?: string
  includeComparison: boolean
}

// Response type
interface TestVoiceResponse {
  withTwin: string
  withoutTwin?: string
  tokensUsed: number
}

/**
 * POST /api/test-voice
 * Test the user's voice profile with a sample message
 * Uses Claude 3.5 Haiku for fast, cheap responses
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
        { error: 'Unauthorized. Please log in to test your voice profile.' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body: TestVoiceRequest = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string.' },
        { status: 400 }
      )
    }

    if (!body.context || !['email', 'slack', 'report', 'social'].includes(body.context)) {
      return NextResponse.json(
        { error: 'Context is required and must be one of: email, slack, report, social.' },
        { status: 400 }
      )
    }

    if (typeof body.includeComparison !== 'boolean') {
      return NextResponse.json(
        { error: 'includeComparison is required and must be a boolean.' },
        { status: 400 }
      )
    }

    // Use service client for database operations that need to bypass RLS
    const serviceClient = createServiceClient()

    // Check rate limiting - max 10 tests per hour per user
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()

    const { count: testCount, error: countError } = await serviceClient
      .from('voice_tests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', oneHourAgo)

    if (countError) {
      console.error('Error checking rate limit:', countError)
      // Continue even if rate limit check fails - don't block the user
    } else if (testCount !== null && testCount >= MAX_TESTS_PER_HOUR) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. You can only run ${MAX_TESTS_PER_HOUR} voice tests per hour. Please try again later.`,
          testsUsed: testCount,
          maxTests: MAX_TESTS_PER_HOUR,
        },
        { status: 429 }
      )
    }

    // 2. Fetch active voice profile
    const { data: voiceProfile, error: profileError } = await serviceClient
      .from('voice_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (profileError || !voiceProfile) {
      return NextResponse.json(
        {
          error: 'No active voice profile found. Please generate your voice profile first.',
        },
        { status: 404 }
      )
    }

    // Type assertion for voiceProfile
    const typedVoiceProfile = voiceProfile as VoiceProfile

    // 3. Check if master_prompt exists
    if (!typedVoiceProfile.master_prompt) {
      return NextResponse.json(
        {
          error: 'Voice profile is incomplete. The master prompt is missing.',
        },
        { status: 400 }
      )
    }

    // Build context string for the prompt
    const language = body.language || 'en'
    const languageNames: Record<string, string> = {
      en: 'English',
      ja: 'Japanese',
      fr: 'French',
      es: 'Spanish',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      zh: 'Chinese',
      ko: 'Korean',
    }
    const languageName = languageNames[language] || language

    const contextDescriptions: Record<string, string> = {
      email: 'an email',
      slack: 'a Slack message',
      report: 'a professional report',
      social: 'a social media post',
    }
    const contextDescription = contextDescriptions[body.context]

    let contextPrompt = `Write ${contextDescription}`
    if (body.audience) {
      contextPrompt += ` for ${body.audience}`
    }
    contextPrompt += ` in ${languageName}.`

    // 4. Generate "with twin" response using Claude Haiku
    let totalTokensUsed = 0
    let withTwinResponse: string

    try {
      const withTwinCompletion = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: typedVoiceProfile.master_prompt,
        messages: [
          {
            role: 'user',
            content: `${contextPrompt}\n\n${body.message}`,
          },
        ],
      })

      // Extract text from content blocks
      const textContent = withTwinCompletion.content.find(block => block.type === 'text')
      withTwinResponse = textContent?.type === 'text' ? textContent.text : ''
      totalTokensUsed += (withTwinCompletion.usage?.input_tokens || 0) + (withTwinCompletion.usage?.output_tokens || 0)
    } catch (anthropicError) {
      console.error('Anthropic API error (with twin):', anthropicError)
      return NextResponse.json(
        { error: 'Failed to generate response with voice profile. Please try again.' },
        { status: 500 }
      )
    }

    // 5. If includeComparison, generate "without twin" response
    let withoutTwinResponse: string | undefined

    if (body.includeComparison) {
      try {
        const withoutTwinCompletion = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a helpful writing assistant.',
          messages: [
            {
              role: 'user',
              content: `${contextPrompt}\n\n${body.message}`,
            },
          ],
        })

        const textContent = withoutTwinCompletion.content.find(block => block.type === 'text')
        withoutTwinResponse = textContent?.type === 'text' ? textContent.text : ''
        totalTokensUsed += (withoutTwinCompletion.usage?.input_tokens || 0) + (withoutTwinCompletion.usage?.output_tokens || 0)
      } catch (anthropicError) {
        console.error('Anthropic API error (without twin):', anthropicError)
        // Continue without the comparison - don't fail the whole request
        withoutTwinResponse = undefined
      }
    }

    // 6. Save to voice_tests table
    const { error: insertError } = await serviceClient.from('voice_tests').insert({
      user_id: user.id,
      voice_profile_id: typedVoiceProfile.id,
      input_message: body.message,
      output_with_twin: withTwinResponse,
      output_without_twin: withoutTwinResponse || null,
      model_used: 'claude-3-5-haiku-20241022',
      tokens_used: totalTokensUsed,
    } as never)

    if (insertError) {
      console.error('Error saving voice test:', insertError)
      // Continue even if save fails - still return the generated content to user
    }

    // 7. Return response
    const response: TestVoiceResponse = {
      withTwin: withTwinResponse,
      tokensUsed: totalTokensUsed,
    }

    if (body.includeComparison && withoutTwinResponse) {
      response.withoutTwin = withoutTwinResponse
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Test voice error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

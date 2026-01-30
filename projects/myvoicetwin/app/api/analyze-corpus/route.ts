import { createServerComponentClient, createServiceClient } from '@/lib/supabase'
import type { Sample } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Claude model to use - use a faster model for quick preview
const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

// ============================================
// TYPES
// ============================================

export interface CorpusAnalysis {
  // Coverage statistics
  coverage: {
    totalSamples: number
    languages: string[]
    languageNames: string[]
    contexts: string[]
    sampleTypes: string[]
  }
  // Overall style assessment
  overallStyle: string
  // Context-specific notes
  contextNotes: {
    context: string
    note: string
  }[]
  // Notable quirks and patterns
  quirks: string[]
  // Quality indicator
  corpusQuality: 'excellent' | 'good' | 'adequate'
}

// Language code to name mapping
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  pt: 'Portuguese',
  it: 'Italian',
  ru: 'Russian',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
}

// Sample type to readable name mapping
const SAMPLE_TYPE_NAMES: Record<string, string> = {
  email_formal: 'formal emails',
  email_casual: 'casual emails',
  email_internal: 'internal emails',
  email_external: 'external emails',
  slack_message: 'Slack messages',
  report: 'reports',
  presentation: 'presentations',
  social_post: 'social posts',
  blog_article: 'blog articles',
  meeting_transcript: 'meeting transcripts',
  voice_memo: 'voice memos',
  other: 'other content',
}

// Context to readable name
const CONTEXT_NAMES: Record<string, string> = {
  customers_clients: 'customer-facing',
  internal_team: 'internal team',
  executives_leadership: 'executive/leadership',
  public_social: 'public/social',
  partners_vendors: 'partner/vendor',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || code.toUpperCase()
}

function getSampleTypeName(type: string): string {
  return SAMPLE_TYPE_NAMES[type] || type.replace(/_/g, ' ')
}

function getContextName(context: string): string {
  return CONTEXT_NAMES[context] || context.replace(/_/g, ' ')
}

/**
 * Format a subset of samples for quick AI analysis
 */
function formatSamplesForPreview(samples: Sample[]): string {
  // Take up to 10 samples to keep the analysis quick
  const previewSamples = samples.slice(0, 10)

  return previewSamples.map(sample => {
    // Truncate long samples to 500 chars for faster processing
    const truncatedContent = sample.content.length > 500
      ? sample.content.substring(0, 500) + '...'
      : sample.content

    return `[${sample.sample_type}/${sample.language}${sample.context ? `/${sample.context}` : ''}]:
${truncatedContent}`
  }).join('\n\n---\n\n')
}

/**
 * Generate the quick analysis prompt
 */
function getQuickAnalysisPrompt(samplesPreview: string, stats: {
  totalSamples: number
  languages: string[]
  sampleTypes: string[]
  contexts: string[]
}): string {
  return `You are analyzing a corpus of writing samples to give a quick preview of the writing style. This is a QUICK preview, not a full analysis.

## Corpus Statistics
- Total samples: ${stats.totalSamples}
- Languages: ${stats.languages.join(', ')}
- Sample types: ${stats.sampleTypes.join(', ')}
- Contexts: ${stats.contexts.join(', ')}

## Sample Preview (first 10 samples, truncated)
${samplesPreview}

## Your Task
Provide a quick, friendly analysis of this writing corpus. Return a JSON object with:

1. "overallStyle": A short phrase (3-5 words) describing the overall writing style, e.g., "humorous and friendly", "professional and direct", "warm and conversational", "technical and precise"

2. "contextNotes": An array of 1-3 objects with context-specific observations. Each object has:
   - "context": The communication context (e.g., "customer-facing communication", "internal team messages")
   - "note": A specific observation about their style in that context (e.g., "frank and detail-oriented", "casual but efficient")
   Only include contexts that are clearly represented in the samples.

3. "quirks": An array of 2-4 specific, notable patterns you noticed, such as:
   - Specific phrases they often use (e.g., "You often start emails with 'Here's the thing...'")
   - Punctuation habits (e.g., "You use ellipses frequently...")
   - Structural patterns (e.g., "You tend to use bullet points for clarity")
   - Tone markers (e.g., "You often add a touch of humor in closing remarks")
   Be specific and quote actual phrases when possible.

4. "corpusQuality": Rate as "excellent" (very diverse, rich samples), "good" (solid foundation), or "adequate" (meets minimum but could use more variety)

Keep the tone encouraging and conversational. This is meant to excite the user about their Voice Twin.

Return ONLY the JSON object, no additional text or markdown formatting.`
}

// ============================================
// API ROUTE
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Use service client for database operations
    const serviceClient = createServiceClient()

    // Fetch all samples
    const { data: samplesData, error: samplesError } = await serviceClient
      .from('samples')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    const samples = samplesData as Sample[] | null

    if (samplesError) {
      console.error('Failed to fetch samples:', samplesError)
      return NextResponse.json(
        { error: 'Failed to fetch writing samples' },
        { status: 500 }
      )
    }

    if (!samples || samples.length === 0) {
      return NextResponse.json(
        { error: 'No writing samples found' },
        { status: 400 }
      )
    }

    // Calculate statistics
    const languagesSet = new Set<string>()
    const contextsSet = new Set<string>()
    const sampleTypesSet = new Set<string>()

    samples.forEach(sample => {
      if (sample.language) languagesSet.add(sample.language)
      if (sample.context) contextsSet.add(sample.context)
      if (sample.sample_type) sampleTypesSet.add(sample.sample_type)
    })

    const languages = Array.from(languagesSet)
    const contexts = Array.from(contextsSet)
    const sampleTypes = Array.from(sampleTypesSet)

    const stats = {
      totalSamples: samples.length,
      languages: languages.map(l => getLanguageName(l)),
      sampleTypes: sampleTypes.map(t => getSampleTypeName(t)),
      contexts: contexts.map(c => getContextName(c)),
    }

    // Check for Anthropic API key
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY environment variable is not set')
      return NextResponse.json(
        { error: 'AI service configuration error' },
        { status: 500 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    })

    // Format samples for quick preview
    const samplesPreview = formatSamplesForPreview(samples)

    // Get quick AI analysis
    let aiAnalysis: {
      overallStyle: string
      contextNotes: { context: string; note: string }[]
      quirks: string[]
      corpusQuality: 'excellent' | 'good' | 'adequate'
    }

    try {
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024, // Keep it small for speed
        messages: [
          {
            role: 'user',
            content: getQuickAnalysisPrompt(samplesPreview, {
              totalSamples: samples.length,
              languages: stats.languages,
              sampleTypes: stats.sampleTypes,
              contexts: stats.contexts,
            }),
          },
        ],
      })

      // Extract the text content
      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response format from AI')
      }

      // Parse the JSON response
      try {
        aiAnalysis = JSON.parse(content.text)
      } catch (parseError) {
        console.error('Failed to parse AI analysis JSON:', parseError)
        console.error('Raw response:', content.text)
        // Provide fallback analysis
        aiAnalysis = {
          overallStyle: 'professional and clear',
          contextNotes: [],
          quirks: ['Your writing samples show a consistent personal style'],
          corpusQuality: samples.length >= 10 ? 'good' : 'adequate',
        }
      }
    } catch (aiError) {
      console.error('AI analysis error:', aiError)
      // Provide fallback analysis on AI failure
      aiAnalysis = {
        overallStyle: 'unique and distinctive',
        contextNotes: [],
        quirks: ['Your writing samples are ready for Voice Twin generation'],
        corpusQuality: samples.length >= 10 ? 'good' : 'adequate',
      }
    }

    // Build the complete analysis response
    const analysis: CorpusAnalysis = {
      coverage: {
        totalSamples: samples.length,
        languages,
        languageNames: languages.map(l => getLanguageName(l)),
        contexts,
        sampleTypes,
      },
      overallStyle: aiAnalysis.overallStyle,
      contextNotes: aiAnalysis.contextNotes,
      quirks: aiAnalysis.quirks,
      corpusQuality: aiAnalysis.corpusQuality,
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Unexpected error in analyze-corpus:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

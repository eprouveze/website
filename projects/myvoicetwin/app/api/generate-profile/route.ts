import { createServerComponentClient, createServiceClient } from '@/lib/supabase'
import type { Sample, QuestionnaireResponse } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Minimum number of samples required
const MIN_SAMPLES = 3

// Claude model to use
const CLAUDE_MODEL = 'claude-sonnet-4-20250514'

// ============================================
// TYPES
// ============================================

interface VoiceDNA {
  // Core voice characteristics
  tone: {
    primary: string
    secondary: string[]
    contextual_variations: Record<string, string>
  }
  // Writing rhythm and structure
  rhythm: {
    sentence_length: {
      average: string
      variation: string
      patterns: string[]
    }
    paragraph_structure: string
    pacing: string
  }
  // Vocabulary patterns
  vocabulary: {
    complexity_level: string
    preferred_terms: string[]
    avoided_terms: string[]
    jargon_usage: string
    language_register: string
  }
  // Sentence patterns and constructions
  sentence_patterns: {
    common_structures: string[]
    openings: string[]
    transitions: string[]
    closings: string[]
  }
  // Cultural and contextual markers
  cultural_markers: {
    regional_influences: string[]
    professional_influences: string[]
    generational_markers: string[]
    formality_spectrum: string
  }
  // Language-specific rules (for multilingual users)
  language_specific: Record<string, {
    notes: string
    adaptations: string[]
  }>
  // Unique identifiers
  signature_elements: {
    catchphrases: string[]
    punctuation_habits: string[]
    emphasis_patterns: string[]
    quirks: string[]
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format samples into a tagged corpus for AI analysis
 */
function formatGoldenCorpus(samples: Sample[]): string {
  return samples.map(sample => {
    const attributes = [
      `type="${sample.sample_type}"`,
      `lang="${sample.language}"`,
      sample.context ? `context="${sample.context}"` : null,
      sample.audience ? `audience="${sample.audience}"` : null,
      sample.is_transcript ? 'source="transcript"' : 'source="written"',
    ].filter(Boolean).join(' ')

    return `<SAMPLE ${attributes}>
${sample.content}
</SAMPLE>`
  }).join('\n\n')
}

/**
 * Format questionnaire responses for AI context
 */
function formatQuestionnaireContext(questionnaire: QuestionnaireResponse): string {
  const sections = []

  // Identity & Context
  sections.push(`## Identity & Professional Context
- Profession: ${questionnaire.profession || 'Not specified'}
- Industry: ${questionnaire.industry || 'Not specified'}
- Years of Experience: ${questionnaire.years_experience || 'Not specified'}
- Primary Language: ${questionnaire.primary_language}
- Additional Languages: ${questionnaire.additional_languages?.join(', ') || 'None specified'}`)

  // Communication Style
  sections.push(`## Communication Style Preferences
- Formality Level: ${questionnaire.formality_level || 'Not specified'}
- Typical Audiences: ${questionnaire.typical_audiences?.join(', ') || 'Not specified'}
- Communication Contexts: ${questionnaire.communication_contexts?.join(', ') || 'Not specified'}`)

  // Voice Characteristics
  sections.push(`## Self-Described Voice Characteristics
- Described Tone: ${questionnaire.described_tone?.join(', ') || 'Not specified'}
- Pet Phrases/Expressions: ${questionnaire.pet_phrases || 'None specified'}
- Things to Avoid: ${questionnaire.things_to_avoid || 'None specified'}`)

  // Goals
  sections.push(`## Goals & Use Cases
- Primary Use Case: ${questionnaire.primary_use_case || 'Not specified'}
- Biggest Challenge: ${questionnaire.biggest_challenge || 'Not specified'}`)

  return sections.join('\n\n')
}

/**
 * Generate the extraction prompt for voice DNA analysis
 */
function getExtractionPrompt(questionnaireContext: string, goldenCorpus: string): string {
  return `You are an expert linguistic analyst specializing in voice and writing style extraction. Your task is to analyze a collection of writing samples and extract a comprehensive "Voice DNA" profile.

## User Context
${questionnaireContext}

## Writing Samples (Golden Corpus)
${goldenCorpus}

## Your Task
Analyze the writing samples above and extract a detailed Voice DNA profile. Pay special attention to:

1. **Tone Analysis**: Identify the primary tone and how it varies across contexts (formal vs casual, internal vs external communication)

2. **Rhythm Patterns**: Analyze sentence length patterns, paragraph structures, and overall pacing. Look for distinctive rhythmic signatures.

3. **Vocabulary Fingerprint**: Identify preferred vocabulary, complexity level, jargon usage, and any terms or phrases consistently avoided.

4. **Sentence Construction**: Document common sentence structures, preferred openings, transition phrases, and closing patterns.

5. **Cultural Markers**: Identify regional linguistic influences, professional jargon, generational markers, and formality spectrum.

6. **Language-Specific Patterns**: If samples include multiple languages, note how the voice adapts across languages.

7. **Signature Elements**: Capture unique quirks, catchphrases, punctuation habits, and emphasis patterns that make this voice distinctive.

Return your analysis as a JSON object with the following structure:
{
  "tone": {
    "primary": "string describing the dominant tone",
    "secondary": ["array", "of", "secondary", "tones"],
    "contextual_variations": {
      "formal": "description",
      "casual": "description",
      "urgent": "description"
    }
  },
  "rhythm": {
    "sentence_length": {
      "average": "short/medium/long/varied",
      "variation": "low/medium/high",
      "patterns": ["pattern descriptions"]
    },
    "paragraph_structure": "description of typical paragraph construction",
    "pacing": "description of overall pacing"
  },
  "vocabulary": {
    "complexity_level": "basic/intermediate/advanced/expert",
    "preferred_terms": ["frequently used words/phrases"],
    "avoided_terms": ["words/phrases never or rarely used"],
    "jargon_usage": "description of technical/industry jargon patterns",
    "language_register": "description of register level"
  },
  "sentence_patterns": {
    "common_structures": ["structural patterns"],
    "openings": ["common sentence/paragraph openers"],
    "transitions": ["preferred transition phrases"],
    "closings": ["common closing patterns"]
  },
  "cultural_markers": {
    "regional_influences": ["identified regional patterns"],
    "professional_influences": ["industry-specific patterns"],
    "generational_markers": ["age/generation indicators"],
    "formality_spectrum": "description of formality range"
  },
  "language_specific": {
    "language_code": {
      "notes": "specific notes for this language",
      "adaptations": ["how voice adapts in this language"]
    }
  },
  "signature_elements": {
    "catchphrases": ["distinctive phrases"],
    "punctuation_habits": ["punctuation patterns"],
    "emphasis_patterns": ["how emphasis is conveyed"],
    "quirks": ["unique stylistic quirks"]
  }
}

Respond ONLY with the JSON object, no additional text or markdown formatting.`
}

/**
 * Generate the master prompt from voice DNA
 */
function getMasterPromptGenerationPrompt(voiceDna: VoiceDNA, questionnaireContext: string): string {
  return `You are an expert AI prompt engineer specializing in voice replication. Your task is to generate an ultra-detailed master prompt that will enable an AI to write in a specific person's voice.

## Voice DNA Analysis
${JSON.stringify(voiceDna, null, 2)}

## User Context
${questionnaireContext}

## Your Task
Generate a comprehensive master prompt (approximately 5,000 tokens) that an AI can use to write in this person's voice. The prompt should include:

### 1. System Context (~500 tokens)
- Define the AI's role as a voice twin
- Establish the core identity and professional context
- Set expectations for authenticity and consistency

### 2. Voice Markers (~1,500 tokens)
- Detailed tone instructions with examples
- Rhythm and pacing guidelines
- Vocabulary rules (what to use, what to avoid)
- Sentence structure patterns with templates
- Punctuation and emphasis conventions

### 3. Language-Specific Rules (~500 tokens)
- Primary language conventions
- Adaptations for additional languages (if applicable)
- Code-switching patterns (if applicable)

### 4. Context Detection (~1,000 tokens)
- Rules for adapting voice based on:
  - Audience (internal vs external, senior vs peer vs junior)
  - Medium (email, report, presentation, social)
  - Urgency level
  - Formality requirements
- Specific examples for each context type

### 5. Signature Elements (~500 tokens)
- Catchphrases and when to use them
- Characteristic openings and closings
- Unique quirks to incorporate naturally
- Things to explicitly avoid

### 6. Quality Checklist (~500 tokens)
- Self-verification criteria
- Red flags that indicate off-voice writing
- Calibration examples

The prompt should be written in second person ("You are...") and be immediately usable as a system prompt. Include concrete examples and specific instructions throughout.

Format the prompt with clear markdown headers and sections. Make it comprehensive yet practical for everyday use.`
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

    // Use service client for database operations (bypasses RLS for admin operations)
    const serviceClient = createServiceClient()

    // Check if user has paid (check purchases table)
    const { data: purchase, error: purchaseError } = await serviceClient
      .from('purchases')
      .select('id, product, status, regeneration_count, regeneration_limit')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'Payment required to generate voice profile' },
        { status: 403 }
      )
    }

    // Type the purchase data
    const typedPurchase = purchase as {
      id: string
      product: string
      status: string
      regeneration_count: number
      regeneration_limit: number
    }

    // Check for active subscription (allows unlimited regenerations)
    const { data: activeSubscription } = await serviceClient
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    const hasActiveSubscription = !!activeSubscription

    // Enforce regeneration limits if no active subscription
    if (!hasActiveSubscription) {
      const regenerationCount = typedPurchase.regeneration_count || 0
      const regenerationLimit = typedPurchase.regeneration_limit || 0

      if (regenerationCount >= regenerationLimit) {
        return NextResponse.json(
          { error: 'Regeneration limit reached' },
          { status: 403 }
        )
      }
    }

    // Fetch questionnaire responses
    const { data: questionnaire, error: questionnaireError } = await serviceClient
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (questionnaireError || !questionnaire) {
      return NextResponse.json(
        { error: 'Please complete the questionnaire first' },
        { status: 400 }
      )
    }

    // Fetch all samples
    const { data: samples, error: samplesError } = await serviceClient
      .from('samples')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (samplesError) {
      console.error('Failed to fetch samples:', samplesError)
      return NextResponse.json(
        { error: 'Failed to fetch writing samples' },
        { status: 500 }
      )
    }

    // Validate minimum samples
    if (!samples || samples.length < MIN_SAMPLES) {
      return NextResponse.json(
        {
          error: `At least ${MIN_SAMPLES} writing samples are required`,
          current_count: samples?.length || 0,
          required_count: MIN_SAMPLES
        },
        { status: 400 }
      )
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

    // Format the data for AI analysis
    const questionnaireContext = formatQuestionnaireContext(questionnaire)
    const goldenCorpus = formatGoldenCorpus(samples)

    // Step 1: Extract Voice DNA
    let voiceDna: VoiceDNA
    let extractionTokens = 0

    try {
      const extractionResponse = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: getExtractionPrompt(questionnaireContext, goldenCorpus),
          },
        ],
      })

      // Extract the text content
      const extractionContent = extractionResponse.content[0]
      if (extractionContent.type !== 'text') {
        throw new Error('Unexpected response format from AI')
      }

      // Parse the JSON response
      try {
        voiceDna = JSON.parse(extractionContent.text) as VoiceDNA
      } catch (parseError) {
        console.error('Failed to parse Voice DNA JSON:', parseError)
        console.error('Raw response:', extractionContent.text)
        throw new Error('Failed to parse AI response as JSON')
      }

      extractionTokens = (extractionResponse.usage?.input_tokens || 0) +
                         (extractionResponse.usage?.output_tokens || 0)
    } catch (aiError) {
      console.error('AI extraction error:', aiError)
      return NextResponse.json(
        { error: 'Failed to analyze writing samples. Please try again.' },
        { status: 500 }
      )
    }

    // Step 2: Generate Master Prompt
    let masterPrompt: string
    let promptTokens = 0

    try {
      const promptResponse = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: getMasterPromptGenerationPrompt(voiceDna, questionnaireContext),
          },
        ],
      })

      // Extract the text content
      const promptContent = promptResponse.content[0]
      if (promptContent.type !== 'text') {
        throw new Error('Unexpected response format from AI')
      }

      masterPrompt = promptContent.text
      promptTokens = (promptResponse.usage?.input_tokens || 0) +
                     (promptResponse.usage?.output_tokens || 0)
    } catch (aiError) {
      console.error('AI prompt generation error:', aiError)
      return NextResponse.json(
        { error: 'Failed to generate voice profile. Please try again.' },
        { status: 500 }
      )
    }

    // Step 3: Deactivate any existing active profiles
    const { error: deactivateError } = await serviceClient
      .from('voice_profiles')
      .update({ is_active: false } as never)
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (deactivateError) {
      console.error('Failed to deactivate previous profiles:', deactivateError)
      // Continue anyway - not a critical error
    }

    // Step 4: Get the next version number
    const { data: existingProfiles } = await serviceClient
      .from('voice_profiles')
      .select('version')
      .eq('user_id', user.id)
      .order('version', { ascending: false })
      .limit(1)

    const typedExistingProfiles = existingProfiles as { version: number }[] | null
    const nextVersion = typedExistingProfiles && typedExistingProfiles.length > 0
      ? typedExistingProfiles[0].version + 1
      : 1

    // Step 5: Save the new voice profile
    const { data: newProfile, error: insertError } = await serviceClient
      .from('voice_profiles')
      .insert({
        user_id: user.id,
        voice_dna: voiceDna as unknown as Record<string, unknown>,
        master_prompt: masterPrompt,
        model_used: CLAUDE_MODEL,
        samples_analyzed: samples.length,
        tokens_used: extractionTokens + promptTokens,
        version: nextVersion,
        is_active: true,
      } as never)
      .select('id, version, generated_at')
      .single()

    if (insertError || !newProfile) {
      console.error('Failed to save voice profile:', insertError)
      return NextResponse.json(
        { error: 'Failed to save voice profile' },
        { status: 500 }
      )
    }

    // Type the response
    const typedProfile = newProfile as { id: string; version: number; generated_at: string }

    // Increment regeneration_count in purchases table
    const newRegenerationCount = (typedPurchase.regeneration_count || 0) + 1
    const { error: updateError } = await serviceClient
      .from('purchases')
      .update({ regeneration_count: newRegenerationCount } as never)
      .eq('id', typedPurchase.id)

    if (updateError) {
      console.error('Failed to update regeneration count:', updateError)
      // Continue anyway - profile was saved successfully
    }

    // Calculate regenerations remaining
    const regenerationsRemaining = hasActiveSubscription
      ? null  // Unlimited for subscribers
      : Math.max(0, (typedPurchase.regeneration_limit || 0) - newRegenerationCount)

    // Return success response
    return NextResponse.json({
      success: true,
      profile_id: typedProfile.id,
      version: typedProfile.version,
      generated_at: typedProfile.generated_at,
      samples_analyzed: samples.length,
      tokens_used: extractionTokens + promptTokens,
      regenerations_remaining: regenerationsRemaining,
    })

  } catch (error) {
    console.error('Unexpected error in generate-profile:', error)
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

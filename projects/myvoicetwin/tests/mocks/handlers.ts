import { http, HttpResponse } from 'msw'

// Mock Supabase responses
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
}

const mockVoiceProfile = {
  id: 'test-profile-id',
  user_id: 'test-user-id',
  voice_dna: {
    tone: ['professional', 'warm'],
    vocabulary: ['technical', 'accessible'],
    sentence_structure: 'varied',
  },
  master_prompt: 'You are writing as a professional who is warm and approachable...',
  model_used: 'claude-3-5-sonnet-20241022',
  samples_analyzed: 5,
  tokens_used: 1500,
  version: 1,
  is_active: true,
  generated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
}

const mockQuestionnaire = {
  id: 'test-questionnaire-id',
  user_id: 'test-user-id',
  profession: 'Software Engineer',
  industry: 'Technology',
  formality_level: 'neutral',
  completed_at: new Date().toISOString(),
}

const mockSamples = [
  { id: '1', user_id: 'test-user-id', title: 'Sample 1', sample_type: 'email_formal', language: 'en', content: 'Test content 1' },
  { id: '2', user_id: 'test-user-id', title: 'Sample 2', sample_type: 'slack_message', language: 'en', content: 'Test content 2' },
  { id: '3', user_id: 'test-user-id', title: 'Sample 3', sample_type: 'email_casual', language: 'en', content: 'Test content 3' },
  { id: '4', user_id: 'test-user-id', title: 'Sample 4', sample_type: 'report', language: 'en', content: 'Test content 4' },
  { id: '5', user_id: 'test-user-id', title: 'Sample 5', sample_type: 'social_post', language: 'en', content: 'Test content 5' },
]

export const handlers = [
  // Supabase Auth
  http.post('https://test.supabase.co/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'test-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'test-refresh-token',
      user: mockUser,
    })
  }),

  http.get('https://test.supabase.co/auth/v1/user', () => {
    return HttpResponse.json(mockUser)
  }),

  // Supabase REST API - Profiles
  http.get('https://test.supabase.co/rest/v1/profiles', ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('id')
    if (userId === 'eq.test-user-id') {
      return HttpResponse.json([{ ...mockUser, has_paid: true }])
    }
    return HttpResponse.json([])
  }),

  // Supabase REST API - Voice Profiles
  http.get('https://test.supabase.co/rest/v1/voice_profiles', ({ request }) => {
    const url = new URL(request.url)
    const isActive = url.searchParams.get('is_active')
    if (isActive === 'eq.true') {
      return HttpResponse.json([mockVoiceProfile])
    }
    return HttpResponse.json([])
  }),

  http.post('https://test.supabase.co/rest/v1/voice_profiles', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ ...mockVoiceProfile, ...body }, { status: 201 })
  }),

  // Supabase REST API - Questionnaire
  http.get('https://test.supabase.co/rest/v1/questionnaire_responses', () => {
    return HttpResponse.json([mockQuestionnaire])
  }),

  http.post('https://test.supabase.co/rest/v1/questionnaire_responses', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ ...mockQuestionnaire, ...body }, { status: 201 })
  }),

  // Supabase REST API - Samples
  http.get('https://test.supabase.co/rest/v1/samples', () => {
    return HttpResponse.json(mockSamples)
  }),

  http.post('https://test.supabase.co/rest/v1/samples', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'new-sample-id', ...body }, { status: 201 })
  }),

  // Supabase REST API - Voice Tests
  http.get('https://test.supabase.co/rest/v1/voice_tests', () => {
    return HttpResponse.json([])
  }),

  http.post('https://test.supabase.co/rest/v1/voice_tests', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({ id: 'new-test-id', ...body }, { status: 201 })
  }),

  // Supabase REST API - Purchases
  http.get('https://test.supabase.co/rest/v1/purchases', () => {
    return HttpResponse.json([{ id: 'purchase-1', status: 'completed', product: 'complete' }])
  }),

  // Anthropic API
  http.post('https://api.anthropic.com/v1/messages', () => {
    return HttpResponse.json({
      id: 'msg_test',
      type: 'message',
      role: 'assistant',
      content: [
        {
          type: 'text',
          text: 'This is a test response from your Voice Twin.',
        },
      ],
      model: 'claude-sonnet-4-20250514',
      usage: {
        input_tokens: 100,
        output_tokens: 50,
      },
    })
  }),

  // Stripe API
  http.post('https://api.stripe.com/v1/checkout/sessions', () => {
    return HttpResponse.json({
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/test',
    })
  }),
]

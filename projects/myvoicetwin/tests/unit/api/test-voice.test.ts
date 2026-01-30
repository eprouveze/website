import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock the dependencies before importing the route
vi.mock('@/lib/supabase', () => ({
  createServerComponentClient: vi.fn(),
  createServiceClient: vi.fn(),
}))

// Mock Anthropic SDK with a class-like structure
vi.mock('@anthropic-ai/sdk', () => {
  const mockCreate = vi.fn().mockResolvedValue({
    content: [{ type: 'text', text: 'Test response from Voice Twin' }],
    usage: { input_tokens: 100, output_tokens: 50 },
  })
  return {
    default: class MockAnthropic {
      messages = {
        create: mockCreate,
      }
    },
  }
})

// Import after mocking
import { POST, GET, PUT, DELETE } from '@/app/api/test-voice/route'
import { createServerComponentClient, createServiceClient } from '@/lib/supabase'

describe('Test Voice API', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' }
  const mockVoiceProfile = {
    id: 'profile-id',
    user_id: 'test-user-id',
    master_prompt: 'You are writing as a professional...',
    is_active: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/test-voice', () => {
    it('returns 401 when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Not authenticated' },
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as any)

      const request = new NextRequest('http://localhost:3000/api/test-voice', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test message',
          context: 'email',
          includeComparison: false,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('returns 400 when message is missing', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as any)

      const request = new NextRequest('http://localhost:3000/api/test-voice', {
        method: 'POST',
        body: JSON.stringify({
          context: 'email',
          includeComparison: false,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Message is required')
    })

    it('returns 400 when context is invalid', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as any)

      const request = new NextRequest('http://localhost:3000/api/test-voice', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test message',
          context: 'invalid_context',
          includeComparison: false,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Context is required')
    })

    it('returns 404 when no active voice profile exists', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      const mockServiceClient = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'voice_tests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  gte: vi.fn().mockResolvedValue({ count: 0, error: null }),
                }),
              }),
            }
          }
          if (table === 'voice_profiles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
                  }),
                }),
              }),
            }
          }
          return { select: vi.fn() }
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as any)

      const request = new NextRequest('http://localhost:3000/api/test-voice', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test message',
          context: 'email',
          includeComparison: false,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('No active voice profile')
    })

    it('returns 429 when rate limit is exceeded', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      const mockServiceClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ count: 10, error: null }),
            }),
          }),
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as any)

      const request = new NextRequest('http://localhost:3000/api/test-voice', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Test message',
          context: 'email',
          includeComparison: false,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toContain('Rate limit exceeded')
    })

    it('successfully generates response with valid inputs', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      const mockServiceClient = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'voice_tests') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  gte: vi.fn().mockResolvedValue({ count: 0, error: null }),
                }),
              }),
              insert: vi.fn().mockResolvedValue({ error: null }),
            }
          }
          if (table === 'voice_profiles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: mockVoiceProfile,
                      error: null,
                    }),
                  }),
                }),
              }),
            }
          }
          return { select: vi.fn() }
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as any)
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as any)

      const request = new NextRequest('http://localhost:3000/api/test-voice', {
        method: 'POST',
        body: JSON.stringify({
          message: 'Write an email about the project update',
          context: 'email',
          includeComparison: false,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('withTwin')
      expect(data).toHaveProperty('tokensUsed')
    })
  })

  describe('HTTP Method Guards', () => {
    it('GET returns 405 Method Not Allowed', async () => {
      const response = await GET()
      expect(response.status).toBe(405)
    })

    it('PUT returns 405 Method Not Allowed', async () => {
      const response = await PUT()
      expect(response.status).toBe(405)
    })

    it('DELETE returns 405 Method Not Allowed', async () => {
      const response = await DELETE()
      expect(response.status).toBe(405)
    })
  })
})

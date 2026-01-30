import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServerComponentClient: vi.fn(),
  createServiceClient: vi.fn(),
}))

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      audio = {
        transcriptions: {
          create: vi.fn().mockResolvedValue({
            text: 'This is a test transcription.',
            duration: 120,
          }),
        },
      }
    },
  }
})

vi.mock('stripe', () => {
  return {
    default: class MockStripe {
      checkout = {
        sessions: {
          create: vi.fn().mockResolvedValue({
            id: 'cs_test_123',
            url: 'https://checkout.stripe.com/test',
          }),
        },
      }
    },
  }
})

import { POST, GET, PUT, DELETE } from '@/app/api/transcribe/route'
import { createServerComponentClient, createServiceClient } from '@/lib/supabase'

describe('Transcribe API', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/transcribe', () => {
    it('returns 401 when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Not authenticated' },
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const formData = new FormData()
      formData.append('file', new Blob(['test'], { type: 'audio/mp3' }), 'test.mp3')

      const request = new NextRequest('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('returns 400 when no file is provided', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const formData = new FormData()
      // No file appended

      const request = new NextRequest('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('No file provided')
    })

    it('returns 400 when file format is unsupported', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const formData = new FormData()
      formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt')

      const request = new NextRequest('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Unsupported file format')
    })

    it('returns pricing tiers for estimate action', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const formData = new FormData()
      formData.append('file', new Blob(['test'], { type: 'audio/mp3' }), 'test.mp3')
      formData.append('action', 'estimate')

      const request = new NextRequest('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('tiers')
      expect(Array.isArray(data.tiers)).toBe(true)
      expect(data.tiers.length).toBeGreaterThan(0)
    })
  })

  describe('GET /api/transcribe', () => {
    it('returns 401 when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Not authenticated' },
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/transcribe')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toContain('Unauthorized')
    })

    it('returns user transcriptions list', async () => {
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
              order: vi.fn().mockResolvedValue({
                data: [
                  { id: '1', file_name: 'test1.mp3', status: 'completed' },
                  { id: '2', file_name: 'test2.mp3', status: 'pending' },
                ],
                error: null,
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as never)

      const request = new NextRequest('http://localhost:3000/api/transcribe')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('uploads')
      expect(Array.isArray(data.uploads)).toBe(true)
    })

    it('returns specific transcription by ID', async () => {
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
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: '1', file_name: 'test1.mp3', status: 'completed', transcription: 'Test text' },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as never)

      const request = new NextRequest('http://localhost:3000/api/transcribe?id=1')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('upload')
      expect(data.upload.id).toBe('1')
    })
  })

  describe('HTTP Method Guards', () => {
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

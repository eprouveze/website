import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(),
}))

import { POST } from '@/app/api/leads/capture/route'
import { createServiceClient } from '@/lib/supabase'

describe('Lead Capture API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/leads/capture', () => {
    it('returns error when email is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/leads/capture', {
        method: 'POST',
        body: JSON.stringify({ source: 'voice-assessment' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email is required')
    })

    it('returns error when source is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/leads/capture', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Source is required')
    })

    it('returns error for invalid source', async () => {
      const request = new NextRequest('http://localhost:3000/api/leads/capture', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', source: 'invalid-source' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid source')
    })

    it('returns error for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/leads/capture', {
        method: 'POST',
        body: JSON.stringify({ email: 'not-an-email', source: 'voice-assessment' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email format')
    })

    it('returns success for existing lead', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'existing-lead-id' },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/leads/capture', {
        method: 'POST',
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'user-agent': 'test-agent',
        },
        body: JSON.stringify({
          email: 'existing@example.com',
          source: 'voice-assessment',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.is_new).toBe(false)
      expect(data.lead_id).toBe('existing-lead-id')
    })

    it('creates new lead successfully', async () => {
      const selectMock = vi.fn()
      const eqMock1 = vi.fn()
      const eqMock2 = vi.fn()
      const singleMock = vi.fn()
      const insertMock = vi.fn()

      // First call: check for existing lead (not found)
      // Second call: insert new lead
      const mockSupabase = {
        from: vi.fn().mockImplementation(() => ({
          select: selectMock.mockReturnValue({
            eq: eqMock1.mockReturnValue({
              eq: eqMock2.mockReturnValue({
                single: singleMock.mockResolvedValueOnce({ data: null, error: null }),
              }),
            }),
          }),
          insert: insertMock.mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { id: 'new-lead-id' },
                error: null,
              }),
            }),
          }),
        })),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/leads/capture', {
        method: 'POST',
        headers: {
          'x-forwarded-for': '127.0.0.1',
          'user-agent': 'test-agent',
        },
        body: JSON.stringify({
          email: 'new@example.com',
          name: 'John Doe',
          source: 'ai-prompts',
          utm_source: 'twitter',
          utm_medium: 'social',
          utm_campaign: 'launch',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.is_new).toBe(true)
      expect(data.lead_id).toBe('new-lead-id')
    })

    it('accepts all valid source types', async () => {
      const validSources = [
        'voice-assessment',
        'ai-prompts',
        'multilingual-checklist',
        'blog',
        'homepage',
      ]

      for (const source of validSources) {
        const mockSupabase = {
          from: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'lead-id' },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }
        vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

        const request = new NextRequest('http://localhost:3000/api/leads/capture', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            source,
          }),
        })

        const response = await POST(request)
        expect(response.status).toBe(200)
      }
    })
  })
})

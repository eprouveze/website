import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(),
}))

import { POST } from '@/app/api/affiliates/apply/route'
import { createServiceClient } from '@/lib/supabase'

describe('Affiliate Apply API', () => {
  const createMockSupabase = (overrides: Record<string, unknown> = {}) => {
    const defaultMock = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'affiliate-1' },
              error: null,
            }),
          }),
        }),
      }),
    }
    return { ...defaultMock, ...overrides }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/affiliates/apply', () => {
    it('returns error when email is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/affiliates/apply', {
        method: 'POST',
        body: JSON.stringify({ name: 'John Doe' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email and name are required')
    })

    it('returns error when name is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/affiliates/apply', {
        method: 'POST',
        body: JSON.stringify({ email: 'john@example.com' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email and name are required')
    })

    it('returns error for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/affiliates/apply', {
        method: 'POST',
        body: JSON.stringify({ email: 'not-an-email', name: 'John Doe' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email format')
    })

    it('creates new affiliate application successfully', async () => {
      const fromMock = vi.fn()
      const selectMock = vi.fn()
      const eqMock = vi.fn()
      const singleMock = vi.fn()
      const insertMock = vi.fn()

      // Set up chain for affiliate check (not found)
      fromMock.mockImplementation((table: string) => {
        if (table === 'affiliates') {
          return {
            select: selectMock.mockReturnValue({
              eq: eqMock.mockReturnValue({
                single: singleMock.mockResolvedValueOnce({ data: null, error: null }),
              }),
            }),
            insert: insertMock.mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'affiliate-1' },
                  error: null,
                }),
              }),
            }),
          }
        }
        if (table === 'profiles') {
          return {
            select: selectMock.mockReturnValue({
              eq: eqMock.mockReturnValue({
                single: singleMock.mockResolvedValueOnce({ data: null, error: null }),
              }),
            }),
          }
        }
        return {}
      })

      const mockSupabase = { from: fromMock }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/affiliates/apply', {
        method: 'POST',
        body: JSON.stringify({
          email: 'john@example.com',
          name: 'John Doe',
          payout_email: 'john.paypal@example.com',
          payout_method: 'paypal',
          application_note: 'I have a blog with 10k readers',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('Application submitted successfully')
      expect(data.affiliate_id).toBe('affiliate-1')
    })

    it('rejects duplicate pending application', async () => {
      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'affiliates') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'existing', status: 'pending' },
                    error: null,
                  }),
                }),
              }),
            }
          }
          return {}
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/affiliates/apply', {
        method: 'POST',
        body: JSON.stringify({
          email: 'john@example.com',
          name: 'John Doe',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('already pending review')
    })

    it('rejects already approved affiliate', async () => {
      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'affiliates') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'existing', status: 'approved' },
                    error: null,
                  }),
                }),
              }),
            }
          }
          return {}
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/affiliates/apply', {
        method: 'POST',
        body: JSON.stringify({
          email: 'john@example.com',
          name: 'John Doe',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('already registered as an affiliate')
    })

    it('notifies existing customer about their referral code', async () => {
      const fromCallTracker: string[] = []

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          fromCallTracker.push(table)

          if (table === 'affiliates') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: null, error: null }),
                }),
              }),
            }
          }
          if (table === 'profiles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'user-1' },
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'referral_codes') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { code: 'VDN-ABC123' },
                    error: null,
                  }),
                }),
              }),
            }
          }
          return {}
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/affiliates/apply', {
        method: 'POST',
        body: JSON.stringify({
          email: 'customer@example.com',
          name: 'Existing Customer',
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('already have a referral code')
      expect(data.existing_code).toBe(true)
    })
  })
})

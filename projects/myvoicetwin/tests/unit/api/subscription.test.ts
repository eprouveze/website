import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Note: NextRequest is used for POST but not for GET/DELETE

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServerComponentClient: vi.fn(),
  createServiceClient: vi.fn(),
}))

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
      subscriptions = {
        cancel: vi.fn().mockResolvedValue({ id: 'sub_123', status: 'canceled' }),
        update: vi.fn().mockResolvedValue({ id: 'sub_123', cancel_at_period_end: true }),
      }
      static errors = {
        StripeError: class StripeError extends Error {}
      }
    },
  }
})

import { POST, GET, DELETE } from '@/app/api/subscription/route'
import { createServerComponentClient, createServiceClient } from '@/lib/supabase'

describe('Subscription API', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/subscription', () => {
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

      const request = new NextRequest('http://localhost:3000/api/subscription', {
        method: 'POST',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBeDefined()
    })
  })

  describe('GET /api/subscription', () => {
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

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBeDefined()
    })
  })

  describe('DELETE /api/subscription', () => {
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

      const response = await DELETE()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBeDefined()
    })
  })
})

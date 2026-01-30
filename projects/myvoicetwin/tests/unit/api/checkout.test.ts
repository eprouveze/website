import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Stripe
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
      static errors = {
        StripeError: class StripeError extends Error {
          statusCode?: number
        },
      }
    },
  }
})

import { POST, GET } from '@/app/api/checkout/route'

describe('Checkout API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/checkout', () => {
    it('returns 400 when product is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Valid product tier is required')
    })

    it('returns 400 for invalid product tier', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ product: 'invalid-tier' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Valid product tier is required')
    })

    it('creates checkout session for starter tier', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
        body: JSON.stringify({ product: 'starter' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBe('https://checkout.stripe.com/test')
    })

    it('creates checkout session for pro tier', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
        body: JSON.stringify({ product: 'pro' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBeDefined()
    })

    it('creates checkout session for executive tier', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
        body: JSON.stringify({ product: 'executive' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.url).toBeDefined()
    })
  })

  describe('GET /api/checkout', () => {
    it('returns 405 Method Not Allowed', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(405)
      expect(data.error).toBe('Method not allowed')
    })
  })
})

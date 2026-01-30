import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(),
}))

import { POST } from '@/app/api/referral/validate/route'
import { createServiceClient } from '@/lib/supabase'

describe('Referral Validation API', () => {
  const mockReferralCode = {
    id: 'ref-1',
    user_id: 'user-1',
    code: 'VDN-ABC123',
    discount_percent: 20,
    commission_percent: 20,
    uses: 5,
    max_uses: null,
    is_active: true,
    created_at: new Date().toISOString(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/referral/validate', () => {
    it('returns error when code is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/referral/validate', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Referral code is required')
    })

    it('returns invalid for non-existent code', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Not found' },
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/referral/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'INVALID', amount_cents: 9900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('Invalid referral code')
    })

    it('validates referral code and calculates discount correctly', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockReferralCode,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/referral/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'VDN-ABC123', amount_cents: 9900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.referral.code).toBe('VDN-ABC123')
      expect(data.referral.discount_percent).toBe(20)
      expect(data.original_amount_cents).toBe(9900)
      expect(data.discount_amount_cents).toBe(1980) // 20% of 9900
      expect(data.final_amount_cents).toBe(7920) // 9900 - 1980
    })

    it('rejects code that has reached usage limit', async () => {
      const maxedOutCode = {
        ...mockReferralCode,
        max_uses: 10,
        uses: 10,
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: maxedOutCode,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/referral/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'VDN-ABC123', amount_cents: 9900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('This referral code has reached its usage limit')
    })

    it('handles case-insensitive code lookup', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockImplementation((field: string, value: string) => {
              // Verify the code is uppercased
              if (field === 'code') {
                expect(value).toBe('VDN-ABC123')
              }
              return {
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockReferralCode,
                    error: null,
                  }),
                }),
              }
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/referral/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'vdn-abc123', amount_cents: 9900 }), // lowercase
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
    })

    it('calculates discount for executive tier correctly', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockReferralCode,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/referral/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'VDN-ABC123', amount_cents: 24900 }), // Executive tier
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.discount_amount_cents).toBe(4980) // 20% of 24900
      expect(data.final_amount_cents).toBe(19920) // 24900 - 4980
    })
  })
})

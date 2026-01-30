import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(),
}))

import { POST } from '@/app/api/discount/validate/route'
import { createServiceClient } from '@/lib/supabase'

describe('Discount Validation API', () => {
  const mockPercentageCode = {
    id: 'code-1',
    code: 'LAUNCH10',
    description: '10% off - Launch promotion',
    discount_type: 'percentage',
    discount_value: 10,
    max_uses: 100,
    current_uses: 5,
    min_purchase_cents: null,
    applicable_products: [],
    valid_from: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    valid_until: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
    is_active: true,
  }

  const mockFixedCode = {
    id: 'code-2',
    code: 'EXECUTIVE50',
    description: '$50 off Executive tier',
    discount_type: 'fixed',
    discount_value: 5000, // $50 in cents
    max_uses: null,
    current_uses: 0,
    min_purchase_cents: 24900, // Executive tier price
    applicable_products: ['executive'],
    valid_from: new Date(Date.now() - 86400000).toISOString(),
    valid_until: null,
    is_active: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/discount/validate', () => {
    it('returns error when code is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Discount code is required')
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

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'INVALID', amount_cents: 9900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('Invalid discount code')
    })

    it('validates percentage discount correctly', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockPercentageCode,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'LAUNCH10', amount_cents: 9900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.discount.code).toBe('LAUNCH10')
      expect(data.discount.type).toBe('percentage')
      expect(data.discount.value).toBe(10)
      expect(data.original_amount_cents).toBe(9900)
      expect(data.discount_amount_cents).toBe(990) // 10% of 9900
      expect(data.final_amount_cents).toBe(8910) // 9900 - 990
    })

    it('validates fixed discount correctly', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockFixedCode,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'EXECUTIVE50', product: 'executive', amount_cents: 24900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.discount_amount_cents).toBe(5000) // $50
      expect(data.final_amount_cents).toBe(19900) // $249 - $50 = $199
    })

    it('rejects expired code', async () => {
      const expiredCode = {
        ...mockPercentageCode,
        valid_until: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: expiredCode,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'LAUNCH10', amount_cents: 9900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('This discount code has expired')
    })

    it('rejects code that has reached usage limit', async () => {
      const maxedOutCode = {
        ...mockPercentageCode,
        max_uses: 10,
        current_uses: 10,
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

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'LAUNCH10', amount_cents: 9900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('This discount code has reached its usage limit')
    })

    it('rejects code below minimum purchase', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockFixedCode, // min_purchase_cents: 24900
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'EXECUTIVE50', amount_cents: 9900 }), // Below minimum
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(false)
      expect(data.error).toContain('Minimum purchase')
    })

    it('rejects code for inapplicable product', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockFixedCode, // applicable_products: ['executive']
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'EXECUTIVE50', product: 'starter', amount_cents: 24900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('This discount code is not valid for this product')
    })

    it('handles case-insensitive code lookup', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockImplementation((field: string, value: string) => {
              // Verify the code is uppercased
              if (field === 'code') {
                expect(value).toBe('LAUNCH10')
              }
              return {
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockPercentageCode,
                    error: null,
                  }),
                }),
              }
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'launch10', amount_cents: 9900 }), // lowercase
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
    })

    it('caps discount at purchase amount', async () => {
      const bigDiscountCode = {
        ...mockFixedCode,
        discount_value: 100000, // $1000 - more than any product
        min_purchase_cents: null,
        applicable_products: [],
      }

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: bigDiscountCode,
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/discount/validate', {
        method: 'POST',
        body: JSON.stringify({ code: 'BIGDISCOUNT', amount_cents: 4900 }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.discount_amount_cents).toBe(4900) // Capped at purchase amount
      expect(data.final_amount_cents).toBe(0) // Free!
    })
  })
})

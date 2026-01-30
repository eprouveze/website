import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(),
}))

import { GET, POST, PUT, DELETE } from '@/app/api/download/route'
import { createServiceClient } from '@/lib/supabase'

describe('Download API', () => {
  const validToken = '12345678-1234-1234-1234-123456789012'
  const mockPurchase = {
    id: 'purchase-id',
    user_id: 'test-user-id',
    email: 'test@example.com',
    product: 'complete',
    download_token: validToken,
    download_count: 0,
    max_downloads: 5,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/download', () => {
    it('returns 400 when token is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/download')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Missing token')
    })

    it('returns 400 when token format is invalid', async () => {
      const request = new NextRequest('http://localhost:3000/api/download?token=invalid-token')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Invalid token format')
    })

    it('returns 403 when token is not found', async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' },
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest(`http://localhost:3000/api/download?token=${validToken}`)

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Invalid download token')
    })

    it('returns 403 when download link has expired', async () => {
      const expiredPurchase = {
        ...mockPurchase,
        expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      }
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: expiredPurchase,
                error: null,
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest(`http://localhost:3000/api/download?token=${validToken}`)

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('expired')
    })

    it('returns 403 when download limit is reached', async () => {
      const maxedPurchase = {
        ...mockPurchase,
        download_count: 5,
        max_downloads: 5,
      }
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: maxedPurchase,
                error: null,
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest(`http://localhost:3000/api/download?token=${validToken}`)

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('Download limit reached')
    })

    it('returns 500 when product type is invalid', async () => {
      const invalidProductPurchase = {
        ...mockPurchase,
        product: 'invalid-product',
      }
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: invalidProductPurchase,
                error: null,
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockSupabase as never)

      const request = new NextRequest(`http://localhost:3000/api/download?token=${validToken}`)

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toContain('Invalid product configuration')
    })
  })

  describe('HTTP Method Guards', () => {
    it('POST returns 405 Method Not Allowed', async () => {
      const response = await POST()
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

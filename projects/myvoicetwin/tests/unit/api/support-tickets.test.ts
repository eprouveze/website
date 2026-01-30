import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServerComponentClient: vi.fn(),
  createServiceClient: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    getAll: vi.fn(() => []),
  })),
}))

import { GET, POST } from '@/app/api/support/tickets/route'
import { createServerComponentClient, createServiceClient } from '@/lib/supabase'

describe('Support Tickets API', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' }
  const mockTicket = {
    id: 'ticket-1',
    user_id: 'test-user-id',
    email: 'test@example.com',
    subject: 'Test ticket',
    description: 'Test description',
    status: 'open',
    priority: 'medium',
    support_expires_at: null,
    created_at: new Date().toISOString(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/support/tickets', () => {
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
      expect(data.error).toBe('Unauthorized')
    })

    it('returns tickets for authenticated user', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({
                data: [mockTicket],
                error: null,
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.tickets).toHaveLength(1)
      expect(data.tickets[0].subject).toBe('Test ticket')
    })
  })

  describe('POST /api/support/tickets', () => {
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

      const request = new NextRequest('http://localhost:3000/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject: 'Test', description: 'Test desc' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('returns 400 when subject or description is missing', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject: 'Test' }), // Missing description
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Subject and description are required')
    })

    it('creates ticket successfully', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'profiles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { email: mockUser.email },
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'support_tickets') {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockTicket,
                    error: null,
                  }),
                }),
              }),
            }
          }
          return {}
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      // Mock service client for executive tier check - chain multiple .eq() calls
      const createChainedMock = () => {
        const chainMock: Record<string, unknown> = {}
        chainMock.eq = vi.fn().mockReturnValue(chainMock)
        chainMock.order = vi.fn().mockReturnValue(chainMock)
        chainMock.limit = vi.fn().mockReturnValue(chainMock)
        chainMock.single = vi.fn().mockResolvedValue({
          data: null, // No executive purchase
          error: null,
        })
        return chainMock
      }

      const mockServiceClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(createChainedMock()),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as never)

      const request = new NextRequest('http://localhost:3000/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject: 'Test ticket', description: 'Test description' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ticket).toBeDefined()
      expect(data.has_priority_support).toBe(false)
    })

    it('grants priority support for Executive tier users', async () => {
      const purchaseDate = new Date()
      const mockExecutivePurchase = {
        id: 'purchase-1',
        product: 'executive',
        created_at: purchaseDate.toISOString(),
      }

      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'profiles') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { email: mockUser.email },
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'support_tickets') {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { ...mockTicket, support_expires_at: new Date(purchaseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() },
                    error: null,
                  }),
                }),
              }),
            }
          }
          return {}
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      // Mock service client with Executive purchase - chain multiple .eq() calls
      const createChainedMock = () => {
        const chainMock: Record<string, unknown> = {}
        chainMock.eq = vi.fn().mockReturnValue(chainMock)
        chainMock.order = vi.fn().mockReturnValue(chainMock)
        chainMock.limit = vi.fn().mockReturnValue(chainMock)
        chainMock.single = vi.fn().mockResolvedValue({
          data: mockExecutivePurchase,
          error: null,
        })
        return chainMock
      }

      const mockServiceClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(createChainedMock()),
        }),
      }
      vi.mocked(createServiceClient).mockReturnValue(mockServiceClient as never)

      const request = new NextRequest('http://localhost:3000/api/support/tickets', {
        method: 'POST',
        body: JSON.stringify({ subject: 'Test', description: 'Test desc', priority: 'high' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.has_priority_support).toBe(true)
      expect(data.support_expires_at).toBeDefined()
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/supabase', () => ({
  createServerComponentClient: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    getAll: vi.fn(() => []),
  })),
}))

import { GET, PATCH } from '@/app/api/support/tickets/[id]/route'
import { POST } from '@/app/api/support/tickets/[id]/messages/route'
import { createServerComponentClient } from '@/lib/supabase'

describe('Ticket Detail API', () => {
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
  const mockMessage = {
    id: 'message-1',
    ticket_id: 'ticket-1',
    sender_type: 'user',
    sender_id: 'test-user-id',
    message: 'Test message',
    attachments: [],
    created_at: new Date().toISOString(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/support/tickets/[id]', () => {
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

      const request = new NextRequest('http://localhost:3000/api/support/tickets/ticket-1')
      const response = await GET(request, { params: Promise.resolve({ id: 'ticket-1' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('returns 404 when ticket not found', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
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
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/support/tickets/nonexistent')
      const response = await GET(request, { params: Promise.resolve({ id: 'nonexistent' }) })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Ticket not found')
    })

    it('returns ticket with messages', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'support_tickets') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockTicket,
                    error: null,
                  }),
                }),
              }),
            }
          }
          if (table === 'ticket_messages') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: [mockMessage],
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

      const request = new NextRequest('http://localhost:3000/api/support/tickets/ticket-1')
      const response = await GET(request, { params: Promise.resolve({ id: 'ticket-1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ticket.subject).toBe('Test ticket')
      expect(data.messages).toHaveLength(1)
      expect(data.messages[0].message).toBe('Test message')
    })
  })

  describe('PATCH /api/support/tickets/[id]', () => {
    it('updates ticket status', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { ...mockTicket, status: 'closed', resolved_at: new Date().toISOString() },
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/support/tickets/ticket-1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'closed' }),
      })
      const response = await PATCH(request, { params: Promise.resolve({ id: 'ticket-1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ticket.status).toBe('closed')
      expect(data.ticket.resolved_at).toBeDefined()
    })
  })

  describe('POST /api/support/tickets/[id]/messages', () => {
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

      const request = new NextRequest('http://localhost:3000/api/support/tickets/ticket-1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test reply' }),
      })
      const response = await POST(request, { params: Promise.resolve({ id: 'ticket-1' }) })
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('returns 400 when message is empty', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/support/tickets/ticket-1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: '   ' }), // Empty/whitespace
      })
      const response = await POST(request, { params: Promise.resolve({ id: 'ticket-1' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Message is required')
    })

    it('rejects message on closed ticket', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { ...mockTicket, status: 'closed' },
                error: null,
              }),
            }),
          }),
        }),
      }
      vi.mocked(createServerComponentClient).mockResolvedValue(mockSupabase as never)

      const request = new NextRequest('http://localhost:3000/api/support/tickets/ticket-1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test reply' }),
      })
      const response = await POST(request, { params: Promise.resolve({ id: 'ticket-1' }) })
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Cannot add messages to closed tickets')
    })

    it('adds message successfully', async () => {
      let callCount = 0
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: mockUser },
          }),
        },
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'support_tickets') {
            callCount++
            // First call: select ticket
            if (callCount === 1) {
              return {
                select: vi.fn().mockReturnValue({
                  eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: mockTicket,
                      error: null,
                    }),
                  }),
                }),
              }
            }
            // Second call: update status (if resolved)
            return {
              update: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }
          }
          if (table === 'ticket_messages') {
            return {
              insert: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { ...mockMessage, message: 'Test reply' },
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

      const request = new NextRequest('http://localhost:3000/api/support/tickets/ticket-1/messages', {
        method: 'POST',
        body: JSON.stringify({ message: 'Test reply' }),
      })
      const response = await POST(request, { params: Promise.resolve({ id: 'ticket-1' }) })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message.message).toBe('Test reply')
    })
  })
})

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@/lib/supabase'

// POST - Add message to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Verify user owns this ticket
    const { data: ticket } = await supabase
      .from('support_tickets')
      .select('id, status')
      .eq('id', ticketId)
      .single()

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Don't allow messages on closed tickets
    if (ticket.status === 'closed') {
      return NextResponse.json(
        { error: 'Cannot add messages to closed tickets' },
        { status: 400 }
      )
    }

    // Create the message
    const { data: newMessage, error } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_type: 'user',
        sender_id: user.id,
        message: message.trim(),
        attachments: [],
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating message:', error)
      return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
    }

    // Update ticket status to 'open' if it was 'resolved' (user replied)
    if (ticket.status === 'resolved') {
      await supabase
        .from('support_tickets')
        .update({ status: 'open', resolved_at: null })
        .eq('id', ticketId)
    }

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error('Message POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

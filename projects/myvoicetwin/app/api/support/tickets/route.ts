import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerComponentClient, createServiceClient } from '@/lib/supabase'

// GET - List user's support tickets
export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's tickets with message count
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tickets:', error)
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
    }

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Support tickets GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new support ticket
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, description, priority = 'medium' } = await request.json()

    // Validate input
    if (!subject || !description) {
      return NextResponse.json(
        { error: 'Subject and description are required' },
        { status: 400 }
      )
    }

    // Use service client to check purchase status (bypass RLS for admin queries)
    const serviceClient = createServiceClient()

    // Check if user has Executive tier purchase for priority support
    const { data: purchase } = await serviceClient
      .from('purchases')
      .select('id, product, created_at')
      .eq('user_id', user.id)
      .eq('product', 'executive')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Calculate support expiration (30 days from Executive purchase)
    let supportExpiresAt: string | null = null
    let purchaseId: string | null = null

    if (purchase) {
      const purchaseDate = new Date(purchase.created_at)
      const expirationDate = new Date(purchaseDate)
      expirationDate.setDate(expirationDate.getDate() + 30)

      // Only set if support hasn't expired
      if (expirationDate > new Date()) {
        supportExpiresAt = expirationDate.toISOString()
        purchaseId = purchase.id
      }
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single()

    // Create the ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        purchase_id: purchaseId,
        email: profile?.email || user.email || '',
        subject,
        description,
        priority: supportExpiresAt ? priority : 'medium', // Only Executive can set priority
        support_expires_at: supportExpiresAt,
        status: 'open',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating ticket:', error)
      return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 })
    }

    return NextResponse.json({
      ticket,
      has_priority_support: !!supportExpiresAt,
      support_expires_at: supportExpiresAt,
    })
  } catch (error) {
    console.error('Support tickets POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

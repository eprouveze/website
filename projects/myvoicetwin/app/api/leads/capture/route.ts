import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, type LeadSource } from '@/lib/supabase'

const VALID_SOURCES: LeadSource[] = [
  'voice-assessment',
  'ai-prompts',
  'multilingual-checklist',
  'blog',
  'homepage',
]

// POST - Capture a lead from a lead magnet or signup form
export async function POST(request: NextRequest) {
  try {
    const { email, name, source, utm_source, utm_medium, utm_campaign } = await request.json()

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!source) {
      return NextResponse.json({ error: 'Source is required' }, { status: 400 })
    }

    // Validate source
    if (!VALID_SOURCES.includes(source)) {
      return NextResponse.json(
        { error: `Invalid source. Must be one of: ${VALID_SOURCES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get IP and user agent for analytics
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Check if this email+source combination already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .eq('source', source)
      .single()

    if (existingLead) {
      // Already captured this lead from this source, just return success
      return NextResponse.json({
        success: true,
        message: 'Email already registered',
        lead_id: existingLead.id,
        is_new: false,
      })
    }

    // Insert new lead
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        source,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting lead:', insertError)
      return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 })
    }

    // TODO: Trigger welcome email via Loops.so or Resend
    // This would be added when email integration is set up

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
      lead_id: lead.id,
      is_new: true,
    })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

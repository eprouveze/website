import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase'

/**
 * Auth callback handler
 * This route handles the magic link callback from Supabase Auth
 * It exchanges the code for a session and redirects to the dashboard
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = await createServerComponentClient(cookieStore)

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully authenticated - redirect to dashboard or intended destination
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    }

    // If there was an error, redirect to login with error message
    console.error('Auth callback error:', error.message)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
    )
  }

  // No code present - redirect to login
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from './lib/supabase'

/**
 * Middleware to protect routes and refresh authentication sessions
 *
 * Protected routes:
 * - /dashboard/* - Requires authentication
 *
 * Auth routes (redirects authenticated users):
 * - /login
 * - /signup
 */
export async function middleware(request: NextRequest) {
  // Create a response that we can modify
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create the Supabase client
  const supabase = createMiddlewareClient(request, response)

  // Refresh the session if it exists
  // This is critical for keeping the session alive
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected routes - redirect unauthenticated users to login
  if (pathname.startsWith('/dashboard')) {
    if (error || !user) {
      const loginUrl = new URL('/login', request.url)
      // Add the original URL as a redirect parameter
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Auth routes - redirect authenticated users to dashboard
  if (pathname === '/login' || pathname === '/signup') {
    if (user && !error) {
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  return response
}

/**
 * Configure which routes the middleware runs on
 * Excludes static assets and API routes that don't need auth
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

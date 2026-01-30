'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Send a magic link to the user's email for passwordless authentication
 * @param email - The user's email address
 * @returns Object with success status or error message
 */
export async function signInWithMagicLink(email: string): Promise<{
  success: boolean
  error?: string
}> {
  const cookieStore = await cookies()
  const supabase = await createServerComponentClient(cookieStore)

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Sign up a new user with magic link
 * Optionally includes full name in user metadata
 * @param email - The user's email address
 * @param fullName - Optional full name for the user profile
 * @returns Object with success status or error message
 */
export async function signUpWithMagicLink(
  email: string,
  fullName?: string
): Promise<{
  success: boolean
  error?: string
}> {
  const cookieStore = await cookies()
  const supabase = await createServerComponentClient(cookieStore)

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: fullName ? { full_name: fullName } : undefined,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Sign out the current user
 * Clears the session and redirects to the login page
 */
export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  const supabase = await createServerComponentClient(cookieStore)

  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Get the currently authenticated user
 * @returns The user object or null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const supabase = await createServerComponentClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Get the current session
 * @returns The session object or null if not authenticated
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const supabase = await createServerComponentClient(cookieStore)

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    return null
  }

  return session
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components that require auth
 * @returns The authenticated user
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

/**
 * Get the user's profile from the profiles table
 * @returns The profile or null if not found
 */
export async function getProfile() {
  const user = await getUser()

  if (!user) {
    return null
  }

  const cookieStore = await cookies()
  const supabase = await createServerComponentClient(cookieStore)

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

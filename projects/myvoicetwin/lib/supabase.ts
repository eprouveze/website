import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Types for the purchases table
export interface Purchase {
  id: string
  email: string
  product: 'starter' | 'complete' | 'executive'
  stripe_session_id: string
  download_token: string
  download_count: number
  max_downloads: number
  created_at: string
  expires_at: string
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      purchases: {
        Row: Purchase
        Insert: Omit<Purchase, 'id' | 'created_at' | 'download_count'> & {
          id?: string
          created_at?: string
          download_count?: number
        }
        Update: Partial<Purchase>
      }
    }
  }
}

/**
 * Creates a Supabase client for client-side usage
 * Uses the anon key which has limited permissions based on RLS policies
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Creates a Supabase client with service role privileges
 * Use this only in server-side code (API routes, server components)
 * The service role key bypasses Row Level Security
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

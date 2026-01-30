import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { CookieOptions } from '@supabase/ssr'
import type { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'

// ============================================
// DATABASE TYPES
// ============================================

export type FormalityLevel = 'very_formal' | 'formal' | 'neutral' | 'casual' | 'very_casual'

export type SampleType =
  | 'email_formal'
  | 'email_casual'
  | 'email_internal'
  | 'email_external'
  | 'slack_message'
  | 'report'
  | 'presentation'
  | 'social_post'
  | 'blog_article'
  | 'meeting_transcript'
  | 'voice_memo'
  | 'other'

export type ProductType = 'starter' | 'pro' | 'executive'

export type PurchaseStatus = 'pending' | 'completed' | 'refunded'

// Profile type (extends auth.users)
export interface Profile {
  id: string
  email: string
  full_name: string | null
  has_paid: boolean
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

// Corpus Matrix types
export type CorpusLanguage = 'english' | 'french' | 'spanish' | 'german' | 'japanese' | 'chinese' | 'other'
export type CommunicationTool = 'email' | 'slack_teams' | 'documents_reports' | 'presentations' | 'social_media' | 'blog_articles'
export type CommunicationTarget = 'customers_clients' | 'internal_team' | 'executives_leadership' | 'public_social' | 'partners_vendors'
export type CommunicationFormat = 'text_only' | 'text_voice'

// Questionnaire responses (Corpus Matrix Builder)
export interface QuestionnaireResponse {
  id: string
  user_id: string
  // Corpus Matrix dimensions
  languages: CorpusLanguage[]
  communication_tools: CommunicationTool[]
  communication_targets: CommunicationTarget[]
  communication_format: CommunicationFormat
  // Legacy fields (kept for backward compatibility, nullable)
  profession: string | null
  industry: string | null
  years_experience: number | null
  primary_language: string
  additional_languages: string[] | null
  formality_level: FormalityLevel | null
  typical_audiences: string[] | null
  communication_contexts: string[] | null
  described_tone: string[] | null
  pet_phrases: string | null
  things_to_avoid: string | null
  primary_use_case: string | null
  biggest_challenge: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Writing samples
export interface Sample {
  id: string
  user_id: string
  title: string
  sample_type: SampleType
  language: string
  context: string | null
  audience: string | null
  content: string
  word_count: number
  is_transcript: boolean
  original_audio_url: string | null
  created_at: string
}

// Voice profiles
export interface VoiceProfile {
  id: string
  user_id: string
  voice_dna: Record<string, unknown> | null
  master_prompt: string | null
  model_used: string | null
  samples_analyzed: number | null
  tokens_used: number | null
  version: number
  is_active: boolean
  generated_at: string
  created_at: string
}

// Purchases
export interface Purchase {
  id: string
  user_id: string
  email: string
  product: ProductType
  amount_cents: number
  currency: string
  stripe_session_id: string
  stripe_payment_intent: string | null
  status: PurchaseStatus
  download_token: string | null
  download_count: number
  max_downloads: number
  expires_at: string | null
  regeneration_count: number
  regeneration_limit: number
  created_at: string
}

// Audio uploads
export type AudioUploadStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface AudioUpload {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_size_bytes: number | null
  duration_seconds: number | null
  transcription: string | null
  status: AudioUploadStatus
  error_message: string | null
  cost_cents: number | null
  stripe_payment_id: string | null
  created_at: string
  processed_at: string | null
}

// Subscriptions
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_customer_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// Voice test context types
export type VoiceTestContext = 'email' | 'slack' | 'report' | 'social'

// Voice tests
export interface VoiceTest {
  id: string
  user_id: string
  voice_profile_id: string
  input_message: string
  context: VoiceTestContext
  audience: string | null
  language: string
  output_with_twin: string
  output_without_twin: string | null
  model_used: string
  tokens_used: number
  created_at: string
}

// Support ticket types
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type SenderType = 'user' | 'support'

// Support tickets
export interface SupportTicket {
  id: string
  user_id: string
  purchase_id: string | null
  email: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  support_expires_at: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

// Ticket messages
export interface TicketMessage {
  id: string
  ticket_id: string
  sender_type: SenderType
  sender_id: string | null
  message: string
  attachments: { name: string; url: string; size: number }[]
  created_at: string
}

// Discount code types
export type DiscountType = 'percentage' | 'fixed'

// Discount codes
export interface DiscountCode {
  id: string
  code: string
  description: string | null
  discount_type: DiscountType
  discount_value: number
  max_uses: number | null
  current_uses: number
  min_purchase_cents: number | null
  applicable_products: string[]
  valid_from: string
  valid_until: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
}

// Discount redemptions
export interface DiscountRedemption {
  id: string
  discount_code_id: string
  user_id: string | null
  purchase_id: string | null
  original_amount_cents: number
  discount_amount_cents: number
  final_amount_cents: number
  created_at: string
}

// Referral code types
export interface ReferralCode {
  id: string
  user_id: string
  code: string
  discount_percent: number
  commission_percent: number
  uses: number
  max_uses: number | null
  is_active: boolean
  created_at: string
}

// Referral credit status
export type ReferralCreditStatus = 'pending' | 'approved' | 'paid_out' | 'cancelled'

// Referral credits
export interface ReferralCredit {
  id: string
  referrer_id: string
  referred_user_id: string | null
  purchase_id: string | null
  referral_code_id: string | null
  credit_amount_cents: number
  status: ReferralCreditStatus
  payout_date: string | null
  payout_reference: string | null
  created_at: string
}

// Affiliate status
export type AffiliateStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type PayoutMethod = 'paypal' | 'stripe' | 'bank_transfer'

// Affiliates
export interface Affiliate {
  id: string
  email: string
  name: string
  payout_email: string | null
  payout_method: PayoutMethod
  referral_code_id: string | null
  status: AffiliateStatus
  total_referrals: number
  total_earnings_cents: number
  total_paid_out_cents: number
  application_note: string | null
  rejection_reason: string | null
  approved_at: string | null
  created_at: string
}

// ============================================
// DATABASE SCHEMA TYPE
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Profile, 'id'>>
      }
      questionnaire_responses: {
        Row: QuestionnaireResponse
        Insert: Omit<QuestionnaireResponse, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<QuestionnaireResponse, 'id'>>
      }
      samples: {
        Row: Sample
        Insert: Omit<Sample, 'id' | 'word_count' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Sample, 'id' | 'word_count'>>
      }
      voice_profiles: {
        Row: VoiceProfile
        Insert: Omit<VoiceProfile, 'id' | 'generated_at' | 'created_at'> & {
          id?: string
          generated_at?: string
          created_at?: string
        }
        Update: Partial<Omit<VoiceProfile, 'id'>>
      }
      purchases: {
        Row: Purchase
        Insert: Omit<Purchase, 'id' | 'created_at' | 'download_count' | 'regeneration_count'> & {
          id?: string
          created_at?: string
          download_count?: number
          regeneration_count?: number
        }
        Update: Partial<Omit<Purchase, 'id'>>
      }
      voice_tests: {
        Row: VoiceTest
        Insert: Omit<VoiceTest, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<VoiceTest, 'id'>>
      }
      audio_uploads: {
        Row: AudioUpload
        Insert: Omit<AudioUpload, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<AudioUpload, 'id'>>
      }
      subscriptions: {
        Row: Subscription
        Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Subscription, 'id'>>
      }
      support_tickets: {
        Row: SupportTicket
        Insert: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<SupportTicket, 'id'>>
      }
      ticket_messages: {
        Row: TicketMessage
        Insert: Omit<TicketMessage, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<TicketMessage, 'id'>>
      }
      discount_codes: {
        Row: DiscountCode
        Insert: Omit<DiscountCode, 'id' | 'created_at' | 'current_uses'> & {
          id?: string
          created_at?: string
          current_uses?: number
        }
        Update: Partial<Omit<DiscountCode, 'id'>>
      }
      discount_redemptions: {
        Row: DiscountRedemption
        Insert: Omit<DiscountRedemption, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<DiscountRedemption, 'id'>>
      }
      referral_codes: {
        Row: ReferralCode
        Insert: Omit<ReferralCode, 'id' | 'created_at' | 'uses'> & {
          id?: string
          created_at?: string
          uses?: number
        }
        Update: Partial<Omit<ReferralCode, 'id'>>
      }
      referral_credits: {
        Row: ReferralCredit
        Insert: Omit<ReferralCredit, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<ReferralCredit, 'id'>>
      }
      affiliates: {
        Row: Affiliate
        Insert: Omit<Affiliate, 'id' | 'created_at' | 'total_referrals' | 'total_earnings_cents' | 'total_paid_out_cents'> & {
          id?: string
          created_at?: string
          total_referrals?: number
          total_earnings_cents?: number
          total_paid_out_cents?: number
        }
        Update: Partial<Omit<Affiliate, 'id'>>
      }
    }
  }
}

// ============================================
// CLIENT CREATORS
// ============================================

/**
 * Creates a Supabase client for browser/client components
 * Uses cookies for session management
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Creates a Supabase client for server components and API routes
 * Must be called with the cookies() function from next/headers
 */
export async function createServerComponentClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Creates a Supabase client for middleware
 * Handles session refresh on each request
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })
}

/**
 * Creates a Supabase client with service role privileges
 * Use this only in server-side code (API routes, server actions)
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

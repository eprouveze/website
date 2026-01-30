-- My Voice Twin Full Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  has_paid boolean default false,
  stripe_customer_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- QUESTIONNAIRE RESPONSES
-- ============================================
create table if not exists questionnaire_responses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,

  -- Identity & Context
  profession text,
  industry text,
  years_experience int,
  primary_language text default 'en',
  additional_languages text[], -- ['ja', 'fr']

  -- Communication Style
  formality_level text check (formality_level in ('very_formal', 'formal', 'neutral', 'casual', 'very_casual')),
  typical_audiences text[], -- ['executives', 'clients', 'team', 'public']
  communication_contexts text[], -- ['email', 'slack', 'reports', 'presentations', 'social']

  -- Voice Characteristics
  described_tone text[], -- ['direct', 'warm', 'analytical', 'humorous']
  pet_phrases text, -- Free text for phrases they commonly use
  things_to_avoid text, -- What they never say/do

  -- Goals
  primary_use_case text,
  biggest_challenge text,

  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- WRITING SAMPLES (Golden Corpus)
-- ============================================
create table if not exists samples (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,

  -- Sample metadata
  title text not null,
  sample_type text not null check (sample_type in (
    'email_formal', 'email_casual', 'email_internal', 'email_external',
    'slack_message', 'report', 'presentation', 'social_post',
    'blog_article', 'meeting_transcript', 'voice_memo', 'other'
  )),
  language text default 'en',
  context text, -- Brief description of when/why this was written
  audience text, -- Who was this written for

  -- The actual content
  content text not null,
  word_count int generated always as (array_length(regexp_split_to_array(content, '\s+'), 1)) stored,

  -- For audio transcripts
  is_transcript boolean default false,
  original_audio_url text,

  created_at timestamp with time zone default now()
);

-- ============================================
-- VOICE PROFILES (Generated output)
-- ============================================
create table if not exists voice_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,

  -- The generated voice profile
  voice_dna jsonb, -- Structured analysis from extraction
  master_prompt text, -- The final prompt for ChatGPT/Claude/Gemini

  -- Generation metadata
  model_used text, -- 'claude-3-opus', 'gpt-4', etc.
  samples_analyzed int,
  tokens_used int,

  -- Versioning
  version int default 1,
  is_active boolean default true,

  generated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- ============================================
-- PURCHASES (Updated for SaaS model)
-- ============================================
drop table if exists purchases;
create table purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  email text not null,
  product text not null check (product in ('complete', 'executive', 'done-for-you')),
  amount_cents int not null,
  currency text default 'usd',
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  status text default 'completed' check (status in ('pending', 'completed', 'refunded')),
  created_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_profiles_email on profiles(email);
create index if not exists idx_questionnaire_user on questionnaire_responses(user_id);
create index if not exists idx_samples_user on samples(user_id);
create index if not exists idx_samples_type on samples(sample_type);
create index if not exists idx_voice_profiles_user on voice_profiles(user_id);
create index if not exists idx_voice_profiles_active on voice_profiles(user_id, is_active) where is_active = true;
create index if not exists idx_purchases_user on purchases(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table profiles enable row level security;
alter table questionnaire_responses enable row level security;
alter table samples enable row level security;
alter table voice_profiles enable row level security;
alter table purchases enable row level security;

-- Profiles: users can only see/edit their own
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Questionnaire: users can only access their own
create policy "Users can manage own questionnaire" on questionnaire_responses
  for all using (auth.uid() = user_id);

-- Samples: users can only access their own
create policy "Users can manage own samples" on samples
  for all using (auth.uid() = user_id);

-- Voice profiles: users can only access their own
create policy "Users can view own voice profiles" on voice_profiles
  for select using (auth.uid() = user_id);

-- Purchases: users can only view their own
create policy "Users can view own purchases" on purchases
  for select using (auth.uid() = user_id);

-- ============================================
-- AUDIO UPLOADS (Paid Add-On)
-- ============================================
create table if not exists audio_uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  file_size_bytes int,
  duration_seconds int,
  transcription text,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  cost_cents int,
  stripe_payment_id text,
  created_at timestamp with time zone default now(),
  processed_at timestamp with time zone
);

-- ============================================
-- SUBSCRIPTIONS (Annual Updates)
-- ============================================
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  stripe_subscription_id text unique not null,
  stripe_customer_id text,
  status text default 'active' check (status in ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- VOICE TESTS (Test UI History)
-- ============================================
create table if not exists voice_tests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  voice_profile_id uuid references voice_profiles(id) on delete cascade not null,
  input_message text not null,
  output_with_twin text,
  output_without_twin text,
  model_used text,
  tokens_used int,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ADDITIONAL INDEXES
-- ============================================
create index if not exists idx_audio_uploads_user on audio_uploads(user_id);
create index if not exists idx_audio_uploads_status on audio_uploads(status);
create index if not exists idx_subscriptions_user on subscriptions(user_id);
create index if not exists idx_subscriptions_status on subscriptions(status);
create index if not exists idx_voice_tests_user on voice_tests(user_id);
create index if not exists idx_voice_tests_profile on voice_tests(voice_profile_id);

-- ============================================
-- ADDITIONAL RLS POLICIES
-- ============================================
alter table audio_uploads enable row level security;
alter table subscriptions enable row level security;
alter table voice_tests enable row level security;

create policy "Users can manage own audio uploads" on audio_uploads
  for all using (auth.uid() = user_id);

create policy "Users can view own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can manage own voice tests" on voice_tests
  for all using (auth.uid() = user_id);

-- ============================================
-- COMMENTS
-- ============================================
comment on table profiles is 'User profiles extending Supabase Auth';
comment on table questionnaire_responses is 'Voice discovery questionnaire answers';
comment on table samples is 'Writing samples (Golden Corpus) uploaded by users';
comment on table voice_profiles is 'AI-generated voice profiles with master prompts';
comment on table purchases is 'Stripe payment records';
comment on table audio_uploads is 'Audio files uploaded for transcription (paid add-on)';
comment on table subscriptions is 'Stripe subscription records for annual updates';
comment on table voice_tests is 'Test UI history - comparing with/without twin';

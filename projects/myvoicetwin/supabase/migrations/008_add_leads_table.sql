-- Migration: Lead Capture for Lead Magnets
-- My Voice Twin - Cold Lead Generation

-- ============================================
-- LEADS (Email captures from lead magnets)
-- ============================================
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  name text,
  source text not null, -- 'voice-assessment', 'ai-prompts', 'multilingual-checklist', 'blog', 'homepage'
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_address text,
  user_agent text,
  converted_to_user boolean default false,
  converted_at timestamp with time zone,
  user_id uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- Unique constraint on email + source (allow same email from different sources)
create unique index if not exists idx_leads_email_source on leads(email, source);

-- ============================================
-- LEAD MAGNET DOWNLOADS (Track what they downloaded)
-- ============================================
create table if not exists lead_magnet_downloads (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid references leads(id) on delete cascade not null,
  resource_slug text not null, -- 'voice-assessment', 'ai-prompts', etc.
  downloaded_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_source on leads(source);
create index if not exists idx_leads_created on leads(created_at);
create index if not exists idx_leads_converted on leads(converted_to_user) where converted_to_user = true;
create index if not exists idx_lead_downloads_lead on lead_magnet_downloads(lead_id);
create index if not exists idx_lead_downloads_resource on lead_magnet_downloads(resource_slug);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table leads enable row level security;
alter table lead_magnet_downloads enable row level security;

-- Leads: Insert allowed for anyone (public form), select only for service role
create policy "Anyone can submit leads" on leads
  for insert with check (true);

-- Downloads: Insert allowed for anyone, select only for service role
create policy "Anyone can record downloads" on lead_magnet_downloads
  for insert with check (true);

-- ============================================
-- FUNCTION: Mark lead as converted when they sign up
-- ============================================
create or replace function mark_lead_converted()
returns trigger as $$
begin
  -- When a new profile is created, check if their email exists in leads
  update leads
  set converted_to_user = true,
      converted_at = now(),
      user_id = new.id
  where email = new.email
    and converted_to_user = false;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists mark_lead_converted_on_signup on profiles;
create trigger mark_lead_converted_on_signup
  after insert on profiles
  for each row execute procedure mark_lead_converted();

-- ============================================
-- COMMENTS
-- ============================================
comment on table leads is 'Email captures from lead magnets and other sources';
comment on table lead_magnet_downloads is 'Track which resources leads have downloaded';
comment on function mark_lead_converted is 'Auto-marks leads as converted when they create an account';

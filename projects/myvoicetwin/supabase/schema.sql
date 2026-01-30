-- My Voice Twin Purchases Table
-- Run this in Supabase SQL Editor

-- Create purchases table
create table if not exists purchases (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  product text not null check (product in ('starter', 'complete', 'executive', 'done-for-you')),
  stripe_session_id text unique not null,
  download_token text unique not null,
  download_count int default 0,
  max_downloads int default 5,
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone default now() + interval '7 days'
);

-- Create indexes for faster lookups
create index if not exists idx_purchases_token on purchases(download_token);
create index if not exists idx_purchases_session on purchases(stripe_session_id);
create index if not exists idx_purchases_email on purchases(email);

-- Enable Row Level Security
alter table purchases enable row level security;

-- Policy: Service role can do everything (for webhook and API)
-- No public access policies - all access goes through API routes with service role

-- Create storage bucket for product files
-- Run this via Supabase dashboard or CLI:
-- insert into storage.buckets (id, name, public) values ('products', 'products', false);

-- Storage policy: Only service role can access
-- create policy "Service role access" on storage.objects
--   for all using (bucket_id = 'products' and auth.role() = 'service_role');

comment on table purchases is 'My Voice Twin product purchases with secure download tokens';
comment on column purchases.product is 'Product tier: starter, complete, executive, or done-for-you';
comment on column purchases.download_token is 'UUID token for secure download access';
comment on column purchases.max_downloads is 'Maximum number of times file can be downloaded';
comment on column purchases.expires_at is 'Token expiration date (default: 7 days from purchase)';

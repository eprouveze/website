-- Migration: Referral & Affiliate System
-- My Voice Twin - GTM Automation

-- ============================================
-- REFERRAL CODES (Auto-generated for purchasers)
-- ============================================
create table if not exists referral_codes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  code text unique not null,
  discount_percent int default 20 check (discount_percent >= 0 and discount_percent <= 100),
  commission_percent int default 20 check (commission_percent >= 0 and commission_percent <= 100),
  uses int default 0,
  max_uses int, -- null = unlimited
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- ============================================
-- REFERRAL CREDITS (Track earned commissions)
-- ============================================
create table if not exists referral_credits (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references profiles(id) on delete cascade not null,
  referred_user_id uuid references profiles(id) on delete set null,
  purchase_id uuid references purchases(id) on delete set null,
  referral_code_id uuid references referral_codes(id) on delete set null,
  credit_amount_cents int not null,
  status text default 'pending' check (status in ('pending', 'approved', 'paid_out', 'cancelled')),
  payout_date timestamp with time zone,
  payout_reference text, -- PayPal/Stripe payout ID
  created_at timestamp with time zone default now()
);

-- ============================================
-- AFFILIATES (Self-service signup for non-customers)
-- ============================================
create table if not exists affiliates (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text not null,
  payout_email text, -- PayPal email or payment info
  payout_method text default 'paypal' check (payout_method in ('paypal', 'stripe', 'bank_transfer')),
  referral_code_id uuid references referral_codes(id) on delete set null unique,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  total_referrals int default 0,
  total_earnings_cents int default 0,
  total_paid_out_cents int default 0,
  application_note text, -- Why they want to be an affiliate
  rejection_reason text,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_referral_codes_user on referral_codes(user_id);
create index if not exists idx_referral_codes_code on referral_codes(code);
create index if not exists idx_referral_codes_active on referral_codes(is_active) where is_active = true;
create index if not exists idx_referral_credits_referrer on referral_credits(referrer_id);
create index if not exists idx_referral_credits_status on referral_credits(status);
create index if not exists idx_referral_credits_payout on referral_credits(status, payout_date) where status = 'approved';
create index if not exists idx_affiliates_email on affiliates(email);
create index if not exists idx_affiliates_status on affiliates(status);
create index if not exists idx_affiliates_code on affiliates(referral_code_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table referral_codes enable row level security;
alter table referral_credits enable row level security;
alter table affiliates enable row level security;

-- Referral codes: users can view their own, anyone can validate active codes
create policy "Users can view own referral codes" on referral_codes
  for select using (auth.uid() = user_id);

create policy "Anyone can validate active referral codes" on referral_codes
  for select using (is_active = true);

-- Referral credits: users can view their own earnings
create policy "Users can view own referral credits" on referral_credits
  for select using (auth.uid() = referrer_id);

-- Affiliates: public insert for signup, read own data
create policy "Anyone can apply as affiliate" on affiliates
  for insert with check (true);

create policy "Affiliates can view own data" on affiliates
  for select using (
    email = (select email from profiles where id = auth.uid())
    or auth.uid() is null -- Allow unauthenticated check by email during signup
  );

-- ============================================
-- FUNCTION: Generate unique referral code
-- ============================================
create or replace function generate_referral_code(prefix text default 'VDN')
returns text as $$
declare
  new_code text;
  code_exists boolean := true;
begin
  while code_exists loop
    -- Generate code: PREFIX + random 6 chars (uppercase alphanumeric)
    new_code := prefix || '-' || upper(substring(md5(random()::text) from 1 for 6));
    -- Check if code exists
    select exists(select 1 from referral_codes where code = new_code) into code_exists;
  end loop;
  return new_code;
end;
$$ language plpgsql;

-- ============================================
-- FUNCTION: Auto-create referral code on purchase
-- ============================================
create or replace function create_referral_code_on_purchase()
returns trigger as $$
declare
  existing_code uuid;
begin
  -- Only create for completed purchases
  if new.status = 'completed' then
    -- Check if user already has a referral code
    select id into existing_code from referral_codes where user_id = new.user_id limit 1;

    if existing_code is null then
      -- Create new referral code for this user
      insert into referral_codes (user_id, code, discount_percent, commission_percent)
      values (new.user_id, generate_referral_code('VDN'), 20, 20);
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Create referral code after purchase
drop trigger if exists create_referral_code_on_purchase on purchases;
create trigger create_referral_code_on_purchase
  after insert or update on purchases
  for each row execute procedure create_referral_code_on_purchase();

-- ============================================
-- FUNCTION: Update affiliate stats on credit
-- ============================================
create or replace function update_affiliate_stats_on_credit()
returns trigger as $$
begin
  -- Update affiliate totals when a credit is created or status changes
  if tg_op = 'INSERT' then
    update affiliates
    set total_referrals = total_referrals + 1,
        total_earnings_cents = total_earnings_cents + new.credit_amount_cents
    where referral_code_id = new.referral_code_id;
  elsif tg_op = 'UPDATE' and old.status != 'paid_out' and new.status = 'paid_out' then
    update affiliates
    set total_paid_out_cents = total_paid_out_cents + new.credit_amount_cents
    where referral_code_id = new.referral_code_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists update_affiliate_stats_on_credit on referral_credits;
create trigger update_affiliate_stats_on_credit
  after insert or update on referral_credits
  for each row execute procedure update_affiliate_stats_on_credit();

-- ============================================
-- COMMENTS
-- ============================================
comment on table referral_codes is 'Referral codes for customers and affiliates - auto-generated on purchase';
comment on table referral_credits is 'Commission credits earned from successful referrals';
comment on table affiliates is 'Self-service affiliate program signups';
comment on function generate_referral_code is 'Generates unique referral code with prefix';
comment on function create_referral_code_on_purchase is 'Auto-creates referral code when user makes first purchase';

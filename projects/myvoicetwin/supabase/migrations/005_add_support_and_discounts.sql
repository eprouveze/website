-- Migration: Support Tickets & Discount Codes
-- My Voice Twin - Phase 3 Features

-- ============================================
-- SUPPORT TICKETS (30-day support for Executive)
-- ============================================
create table if not exists support_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  purchase_id uuid references purchases(id) on delete set null,
  email text not null,
  subject text not null,
  description text not null,
  status text default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  support_expires_at timestamp with time zone, -- 30 days from purchase for Executive tier
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  resolved_at timestamp with time zone
);

-- Ticket messages/replies
create table if not exists ticket_messages (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references support_tickets(id) on delete cascade not null,
  sender_type text not null check (sender_type in ('user', 'support')),
  sender_id uuid references profiles(id) on delete set null,
  message text not null,
  attachments jsonb default '[]', -- [{name, url, size}]
  created_at timestamp with time zone default now()
);

-- ============================================
-- DISCOUNT CODES (Referrals & Promotions)
-- ============================================
create table if not exists discount_codes (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value int not null, -- percentage (10 = 10%) or cents (1000 = $10)
  max_uses int, -- null = unlimited
  current_uses int default 0,
  min_purchase_cents int, -- minimum order value to apply
  applicable_products text[] default '{}', -- empty = all products
  valid_from timestamp with time zone default now(),
  valid_until timestamp with time zone,
  is_active boolean default true,
  created_by text, -- 'system', 'admin', or user email for referrals
  created_at timestamp with time zone default now()
);

-- Track discount redemptions
create table if not exists discount_redemptions (
  id uuid default gen_random_uuid() primary key,
  discount_code_id uuid references discount_codes(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete set null,
  purchase_id uuid references purchases(id) on delete set null,
  original_amount_cents int not null,
  discount_amount_cents int not null,
  final_amount_cents int not null,
  created_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_support_tickets_user on support_tickets(user_id);
create index if not exists idx_support_tickets_status on support_tickets(status);
create index if not exists idx_support_tickets_expires on support_tickets(support_expires_at);
create index if not exists idx_ticket_messages_ticket on ticket_messages(ticket_id);
create index if not exists idx_discount_codes_code on discount_codes(code);
create index if not exists idx_discount_codes_active on discount_codes(is_active, valid_until);
create index if not exists idx_discount_redemptions_code on discount_redemptions(discount_code_id);
create index if not exists idx_discount_redemptions_user on discount_redemptions(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table support_tickets enable row level security;
alter table ticket_messages enable row level security;
alter table discount_codes enable row level security;
alter table discount_redemptions enable row level security;

-- Support tickets: users can manage their own tickets
create policy "Users can view own tickets" on support_tickets
  for select using (auth.uid() = user_id);
create policy "Users can create own tickets" on support_tickets
  for insert with check (auth.uid() = user_id);
create policy "Users can update own tickets" on support_tickets
  for update using (auth.uid() = user_id);

-- Ticket messages: users can view messages on their tickets
create policy "Users can view messages on own tickets" on ticket_messages
  for select using (
    ticket_id in (select id from support_tickets where user_id = auth.uid())
  );
create policy "Users can add messages to own tickets" on ticket_messages
  for insert with check (
    ticket_id in (select id from support_tickets where user_id = auth.uid())
    and sender_type = 'user'
  );

-- Discount codes: anyone can read active codes (for validation)
create policy "Anyone can view active discount codes" on discount_codes
  for select using (is_active = true);

-- Discount redemptions: users can view their own
create policy "Users can view own redemptions" on discount_redemptions
  for select using (auth.uid() = user_id);

-- ============================================
-- UPDATE TRIGGER FOR support_tickets.updated_at
-- ============================================
create or replace function update_support_ticket_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_support_ticket_timestamp on support_tickets;
create trigger update_support_ticket_timestamp
  before update on support_tickets
  for each row execute procedure update_support_ticket_timestamp();

-- ============================================
-- COMMENTS
-- ============================================
comment on table support_tickets is 'Support tickets for Executive tier users (30-day priority support)';
comment on table ticket_messages is 'Messages/replies within support tickets';
comment on table discount_codes is 'Promotional and referral discount codes';
comment on table discount_redemptions is 'History of discount code usage';

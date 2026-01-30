-- Seed Discount Codes
-- My Voice Twin - Initial Promotional Codes

-- LAUNCH10 - 10% off any product (launch promotion)
INSERT INTO discount_codes (code, description, discount_type, discount_value, max_uses, valid_until, created_by)
VALUES (
  'LAUNCH10',
  '10% off - Launch promotion',
  'percentage',
  10,
  100,
  NOW() + INTERVAL '90 days',
  'system'
) ON CONFLICT (code) DO NOTHING;

-- WELCOME20 - 20% off first purchase
INSERT INTO discount_codes (code, description, discount_type, discount_value, max_uses, valid_until, created_by)
VALUES (
  'WELCOME20',
  '20% off your first Voice Twin',
  'percentage',
  20,
  500,
  NOW() + INTERVAL '180 days',
  'system'
) ON CONFLICT (code) DO NOTHING;

-- EXECUTIVE50 - $50 off Executive tier only
INSERT INTO discount_codes (code, description, discount_type, discount_value, min_purchase_cents, applicable_products, created_by)
VALUES (
  'EXECUTIVE50',
  '$50 off Executive tier',
  'fixed',
  5000,
  24900, -- Executive tier price
  ARRAY['executive'],
  'system'
) ON CONFLICT (code) DO NOTHING;

-- FRIEND15 - 15% referral discount (unlimited use)
INSERT INTO discount_codes (code, description, discount_type, discount_value, created_by)
VALUES (
  'FRIEND15',
  '15% off - Referral discount',
  'percentage',
  15,
  'system'
) ON CONFLICT (code) DO NOTHING;

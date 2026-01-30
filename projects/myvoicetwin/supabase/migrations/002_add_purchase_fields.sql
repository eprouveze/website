-- Migration: 002_add_purchase_fields
-- Description: Add download tracking and regeneration limit fields to purchases table
--              Add rate limiting index to voice_tests table
-- Created: 2026-01-30

-- ============================================
-- ADD COLUMNS TO PURCHASES TABLE
-- ============================================

-- Download token for secure file access
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS download_token uuid;

-- Track number of times the file has been downloaded
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;

-- Maximum allowed downloads per purchase
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS max_downloads integer DEFAULT 5;

-- Expiration timestamp for download access
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;

-- Track number of regenerations used
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS regeneration_count integer DEFAULT 0;

-- Maximum allowed regenerations per purchase
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS regeneration_limit integer DEFAULT 3;

-- ============================================
-- ADD INDEX FOR RATE LIMITING ON VOICE_TESTS
-- ============================================

-- Index to efficiently query voice tests by user and creation time
-- Used for rate limiting voice test generation
CREATE INDEX IF NOT EXISTS idx_voice_tests_rate_limit
ON voice_tests(user_id, created_at);

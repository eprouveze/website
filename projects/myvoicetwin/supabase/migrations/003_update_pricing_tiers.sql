-- Migration: Update pricing tiers and questionnaire for corpus matrix
-- Run this in Supabase SQL Editor

-- ============================================
-- UPDATE PURCHASES TABLE FOR NEW TIERS
-- ============================================
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_product_check;
ALTER TABLE purchases ADD CONSTRAINT purchases_product_check
  CHECK (product IN ('starter', 'pro', 'executive'));

-- Add new fields for tier benefits tracking
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS tier_languages INT DEFAULT -1;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS tier_matrix_sections INT DEFAULT -1;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS regeneration_limit INT DEFAULT 1;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS first_year_discount BOOLEAN DEFAULT FALSE;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS includes_subscription BOOLEAN DEFAULT FALSE;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS audio_credits BOOLEAN DEFAULT FALSE;
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS priority_support BOOLEAN DEFAULT FALSE;

-- ============================================
-- UPDATE QUESTIONNAIRE FOR CORPUS MATRIX
-- ============================================
-- Add new corpus matrix fields
ALTER TABLE questionnaire_responses ADD COLUMN IF NOT EXISTS matrix_languages TEXT[] DEFAULT '{}';
ALTER TABLE questionnaire_responses ADD COLUMN IF NOT EXISTS matrix_tools TEXT[] DEFAULT '{}';
ALTER TABLE questionnaire_responses ADD COLUMN IF NOT EXISTS matrix_targets TEXT[] DEFAULT '{}';
ALTER TABLE questionnaire_responses ADD COLUMN IF NOT EXISTS matrix_format TEXT DEFAULT 'text_only';
ALTER TABLE questionnaire_responses ADD COLUMN IF NOT EXISTS matrix_cells JSONB DEFAULT '[]';

-- Add constraint for format
ALTER TABLE questionnaire_responses DROP CONSTRAINT IF EXISTS questionnaire_responses_format_check;
ALTER TABLE questionnaire_responses ADD CONSTRAINT questionnaire_responses_format_check
  CHECK (matrix_format IN ('text_only', 'text_and_voice'));

-- ============================================
-- UPDATE SAMPLES TABLE FOR MATRIX INTEGRATION
-- ============================================
-- Add matrix reference fields to samples
ALTER TABLE samples ADD COLUMN IF NOT EXISTS matrix_language TEXT;
ALTER TABLE samples ADD COLUMN IF NOT EXISTS matrix_tool TEXT;
ALTER TABLE samples ADD COLUMN IF NOT EXISTS matrix_target TEXT;

-- ============================================
-- ADD REGENERATION TRACKING
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS regenerations_used INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS regeneration_limit INT DEFAULT 1;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON COLUMN questionnaire_responses.matrix_languages IS 'Languages user communicates in (corpus matrix dimension)';
COMMENT ON COLUMN questionnaire_responses.matrix_tools IS 'Communication tools: email, slack, docs, etc (corpus matrix dimension)';
COMMENT ON COLUMN questionnaire_responses.matrix_targets IS 'Audience targets: customers, internal, executives (corpus matrix dimension)';
COMMENT ON COLUMN questionnaire_responses.matrix_format IS 'Text only or text+voice for presentations';
COMMENT ON COLUMN questionnaire_responses.matrix_cells IS 'Active matrix cells user needs samples for';
COMMENT ON COLUMN samples.matrix_language IS 'Which matrix language this sample belongs to';
COMMENT ON COLUMN samples.matrix_tool IS 'Which matrix tool this sample belongs to';
COMMENT ON COLUMN samples.matrix_target IS 'Which matrix target this sample belongs to';

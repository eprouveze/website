-- Migration: Add Corpus Matrix fields to questionnaire_responses
-- This migration adds new fields for the Corpus Matrix builder
-- and makes the old profile-related fields nullable for backward compatibility

-- Add new Corpus Matrix columns
ALTER TABLE questionnaire_responses
ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS communication_tools text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS communication_targets text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS communication_format text DEFAULT 'text_only'
  CHECK (communication_format IN ('text_only', 'text_voice'));

-- Add indexes for the new array columns (for efficient querying)
CREATE INDEX IF NOT EXISTS idx_questionnaire_languages
  ON questionnaire_responses USING GIN (languages);
CREATE INDEX IF NOT EXISTS idx_questionnaire_tools
  ON questionnaire_responses USING GIN (communication_tools);
CREATE INDEX IF NOT EXISTS idx_questionnaire_targets
  ON questionnaire_responses USING GIN (communication_targets);

-- Add comments for documentation
COMMENT ON COLUMN questionnaire_responses.languages IS
  'Languages for communication: english, french, spanish, german, japanese, chinese, other';
COMMENT ON COLUMN questionnaire_responses.communication_tools IS
  'Communication tools: email, slack_teams, documents_reports, presentations, social_media, blog_articles';
COMMENT ON COLUMN questionnaire_responses.communication_targets IS
  'Communication targets: customers_clients, internal_team, executives_leadership, public_social, partners_vendors';
COMMENT ON COLUMN questionnaire_responses.communication_format IS
  'Format type: text_only or text_voice (includes presentations/speeches)';

-- Note: Legacy fields (profession, industry, formality_level, etc.) are kept
-- for backward compatibility but are no longer actively used by the new questionnaire.
-- They can be removed in a future migration once data migration is complete.

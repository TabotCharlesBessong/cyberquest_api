-- CyberQuest API — Add double XP fields to users table
-- Run with: pnpm run migrate

ALTER TABLE users ADD COLUMN IF NOT EXISTS double_xp_active BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS double_xp_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS double_xp_source VARCHAR(255);

-- CyberQuest API — Add missing_words and sentence columns to questions table

ALTER TABLE questions ADD COLUMN IF NOT EXISTS missing_words JSONB;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS sentence TEXT;

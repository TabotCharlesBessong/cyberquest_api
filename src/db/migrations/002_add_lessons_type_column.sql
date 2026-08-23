-- CyberQuest API — Add missing type column to lessons table
-- This migration fixes the lessons table created before the type column was added
-- Run with: pnpm run migrate

-- Add type column if it doesn't exist
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'story';

-- Update any existing lessons that don't have a type
UPDATE lessons SET type = 'story' WHERE type IS NULL;

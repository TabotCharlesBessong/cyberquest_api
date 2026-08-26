-- CyberQuest API — Fix events and leaderboard_entries table to match Sequelize models
-- The events table was created with a different schema (title/type/rewards)
-- than what the model expects (key/name/description/multiplier).

-- Add key column (referenced by EventService and EventController)
ALTER TABLE events ADD COLUMN IF NOT EXISTS key VARCHAR(255) UNIQUE;

-- Add name column (model uses "name", table has "title" instead)
-- Using DEFAULT since there may be existing rows
ALTER TABLE events ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Add multiplier column (referenced by EventService for active event bonus)
ALTER TABLE events ADD COLUMN IF NOT EXISTS multiplier DECIMAL(3,2) DEFAULT 1.00;

-- Fix leaderboard_entries table: add scope and score columns (missing from initial schema)
-- The model expects scope and score, but the table has xp/rank only
ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS scope VARCHAR(50) DEFAULT 'global';
ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

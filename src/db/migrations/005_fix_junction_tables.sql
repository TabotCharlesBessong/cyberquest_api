-- CyberQuest API — Fix junction tables and missing columns
-- Run with: pnpm run migrate
-- Adds missing columns to bring schema in sync with Sequelize models
-- Safe for existing databases: uses ADD COLUMN IF NOT EXISTS

-- user_badges: add progress column (referenced by BadgeService)
ALTER TABLE user_badges ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 100;

-- user_quests: add status column (referenced by QuestService)
ALTER TABLE user_quests ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';

-- Tables with createdAt but missing updatedAt (Sequelize auto-generates updatedAt with underscored: false)
ALTER TABLE classroom_rounds ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE daily_activities ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE leaderboard_entries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE leagues ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE league_memberships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- CyberQuest API — Fix schema columns to match Sequelize models
-- Run with: pnpm run migrate
-- Adds missing columns that the models reference but the initial schema omitted
-- Safe for existing databases: uses ADD COLUMN IF NOT EXISTS

-- lessons: add columns referenced by Lesson model
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS question TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS answer INTEGER;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS explanation TEXT;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS icon VARCHAR(255);
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS mascot VARCHAR(255);
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS speech TEXT;

-- lesson_options: model uses position, old schema used order (reserved word)
-- Add position column, keep order for backward compatibility
ALTER TABLE lesson_options ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- lesson_choices: model uses position, feedback, consequence
ALTER TABLE lesson_choices ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE lesson_choices ADD COLUMN IF NOT EXISTS feedback TEXT NOT NULL DEFAULT '';
ALTER TABLE lesson_choices ADD COLUMN IF NOT EXISTS consequence VARCHAR(50) DEFAULT 'neutral';

-- concepts: model uses code, old schema used name
-- Add code column. Existing rows get NULL, app always sets it explicitly
ALTER TABLE concepts ADD COLUMN IF NOT EXISTS code VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS idx_concepts_code ON concepts(code);

-- standards: model uses code, old schema used name
ALTER TABLE standards ADD COLUMN IF NOT EXISTS code VARCHAR(255);
CREATE UNIQUE INDEX IF NOT EXISTS idx_standards_code ON standards(code);

-- badges: model references criteria column
ALTER TABLE badges ADD COLUMN IF NOT EXISTS criteria VARCHAR(255);

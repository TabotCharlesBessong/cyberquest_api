-- CyberQuest API — Seed Data
-- Run with: pnpm run migrate:seed
-- Compatible with local Postgres and Supabase

INSERT INTO users (id, name, email, password, age, age_group, avatar, xp, level, streak, hearts, gems, onboarded, is_verified, role, language_preference, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'Charles Bessong',
  'charlesbessongtabot@gmail.com',
  '$2a$10$rH8qHx8qHx8qHx8qHx8qHux8qHx8qHx8qHx8qHx8qHx8qHx8qHx8q',
  30,
  'B',
  '👑',
  0,
  1,
  0,
  5,
  100,
  true,
  true,
  'admin',
  'en',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

INSERT INTO badges ("key", name, description, icon, rarity, progress, xp_reward, gems_reward)
VALUES
  ('first_login', 'First Steps', 'Log in for the first time', '🌟', 'common', 1, 10, 1),
  ('streak_3', 'On Fire', 'Maintain a 3-day streak', '🔥', 'rare', 3, 25, 5),
  ('streak_7', 'Week Warrior', 'Maintain a 7-day streak', '⚡', 'epic', 7, 50, 10),
  ('module_complete', 'Module Master', 'Complete your first module', '🏆', 'common', 1, 20, 2),
  ('quiz_perfect', 'Perfect Score', 'Get 100% on a quiz', '💯', 'rare', 1, 30, 5)
ON CONFLICT ("key") DO NOTHING;

INSERT INTO quests ("key", title, description, type, target, xp_reward, gems_reward, is_active)
VALUES
  ('daily_login', 'Daily Login', 'Log in today', 'daily', 1, 10, 1, true),
  ('complete_lesson', 'Lesson Complete', 'Complete 1 lesson', 'daily', 1, 20, 2, true),
  ('perfect_quiz', 'Perfect Quiz', 'Get 100% on a quiz', 'daily', 1, 30, 3, true)
ON CONFLICT ("key") DO NOTHING;

INSERT INTO shop_items ("key", name, description, type, cost, cost_type, effect, icon, rarity, stock, is_active)
VALUES
  ('streak_freeze', 'Streak Freeze', 'Protect your streak for 1 day', 'consumable', 20, 'gems', 'freeze_streak', '❄️', 'common', 10, true),
  ('heart_refill', 'Heart Refill', 'Refill all hearts', 'consumable', 15, 'gems', 'refill_hearts', '❤️', 'common', 20, true),
  ('xp_boost', 'XP Boost', 'Double XP for next lesson', 'powerup', 30, 'gems', 'double_xp', '🚀', 'rare', 5, true),
  ('beginner_avatar', 'Cyber Hoodie', 'Cool cyberpunk hoodie', 'avatar', 50, 'gems', NULL, '🧥', 'common', NULL, true),
  ('pro_avatar', 'Hacker Mask', 'Elite hacker mask', 'avatar', 100, 'xp', NULL, '🎭', 'epic', NULL, true)
ON CONFLICT ("key") DO NOTHING;

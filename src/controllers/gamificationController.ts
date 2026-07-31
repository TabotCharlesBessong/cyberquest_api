import { Response } from "express";
import { User, DailyActivity } from "../db";
import { Op } from "sequelize";
import { GamificationService } from "../services/gamificationService";
import { BadgeService } from "../services/badgeService";
import { QuestService } from "../services/questService";
import { ShopService } from "../services/shopService";
import { sanitizeUser } from "../db/models/User";
import { asyncHandler } from "../middleware/asyncHandler";

const ACTIVITY_REWARDS: Record<string, { xp: number; gems: number; cooldownHours: number }> = {
  daily_login: { xp: 10, gems: 1, cooldownHours: 20 },
  profile_view: { xp: 2, gems: 0, cooldownHours: 0 },
  shop_visit: { xp: 2, gems: 0, cooldownHours: 0 },
  purchase: { xp: 10, gems: 0, cooldownHours: 0 },
  avatar_change: { xp: 5, gems: 0, cooldownHours: 0 },
  leaderboard_view: { xp: 2, gems: 0, cooldownHours: 0 },
};

export const recordActivity = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user.id;
  const { action } = req.body as { action: string };

  if (!action || !ACTIVITY_REWARDS[action]) {
    res.status(400).json({ success: false, message: "Invalid action" });
    return;
  }

  const reward = ACTIVITY_REWARDS[action];
  const today = new Date().toISOString().split("T")[0];

  if (reward.cooldownHours > 0) {
    const cutoff = new Date(Date.now() - reward.cooldownHours * 60 * 60 * 1000).toISOString();
    const recent = await DailyActivity.findOne({
      where: {
        userId,
        date: today,
        lastActionAt: { [Op.gte]: cutoff },
      },
    });
    if (recent) {
      res.status(200).json({
        success: true,
        data: {
          rewarded: false,
          message: `Already rewarded for ${action} today. Come back later!`,
          stats: await GamificationService.addXp(userId, 0, `activity_${action}`),
        },
      });
      return;
    }
  }

  const xpResult = await GamificationService.addXp(userId, reward.xp, `activity_${action}`);
  if (reward.gems > 0) {
    await GamificationService.addGems(userId, reward.gems);
  }

  const [activity] = await DailyActivity.findOrCreate({
    where: { userId, date: today },
    defaults: {
      userId,
      date: today,
      xpEarned: reward.xp,
      lessonsCompleted: 0,
      quizzesPassed: 0,
    },
  });

  if (!activity.isNewRecord) {
    activity.xpEarned += reward.xp;
    activity.lastActionAt = new Date();
    await activity.save();
  }

  await GamificationService.updateStreak(userId);
  await BadgeService.checkAndAwardBadges(userId);
  await QuestService.updateQuestProgress(userId, "daily_login");

  res.status(200).json({
    success: true,
    data: {
      rewarded: true,
      xpEarned: reward.xp,
      gemsEarned: reward.gems,
      stats: xpResult,
    },
  });
});

export const getProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  const [badges, dailyQuests, inventory] = await Promise.all([
    BadgeService.getUserBadges(user.id),
    QuestService.getDailyQuests(user.id),
    ShopService.getUserInventory(user.id),
  ]);

  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      badges,
      dailyQuests,
      inventory,
      stats: {
        xp: user.xp,
        level: user.level,
        xpForNext: GamificationService.xpForNextLevel(user.xp),
        xpIntoLevel: GamificationService.xpIntoLevel(user.xp),
        streak: user.streak,
        hearts: user.hearts,
        gems: user.gems,
      },
    },
  });
});

export const getBadges = asyncHandler(async (req: any, res: Response) => {
  const badges = await BadgeService.getBadgeProgress(req.user.id);
  res.status(200).json({ success: true, data: { badges } });
});

export const claimQuestReward = asyncHandler(async (req: any, res: Response) => {
  const { questId } = req.params;
  const result = await QuestService.claimQuestReward(req.user.id, questId);
  res.status(200).json({ success: true, data: result });
});

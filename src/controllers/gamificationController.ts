import { Response } from "express";
import { GamificationService } from "../services/gamificationService";
import { BadgeService } from "../services/badgeService";
import { QuestService } from "../services/questService";
import { ShopService } from "../services/shopService";
import { sanitizeUser } from "../db/models/User";
import { asyncHandler } from "../middleware/asyncHandler";

export const getProfile = asyncHandler(async (req: any, res: Response) => {
  const user = req.user;
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

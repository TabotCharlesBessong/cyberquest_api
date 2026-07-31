import { User, Badge, UserBadge, ModuleProgress } from "../db";
import { GamificationService } from "./gamificationService";

export class BadgeService {
  static async checkAndAwardBadges(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) return [];

    const allBadges = await Badge.findAll();
    const earnedBadges: any[] = [];

    for (const badge of allBadges) {
      const existing = await UserBadge.findOne({
        where: { userId, badgeId: badge.id },
      });
      if (existing) continue;

      let earned = false;
      let progress = 0;

      switch (badge.key) {
        case "first_lesson":
          progress = 100;
          earned = true;
          break;
        case "module_master":
          const completedModules = await ModuleProgress.count({
            where: { userId, status: "completed" },
          });
          progress = Math.min(completedModules * 20, 100);
          earned = completedModules >= 1;
          break;
        case "streak_3":
          progress = Math.min((await GamificationService.getStreak(userId)) * 33, 100);
          earned = (await GamificationService.getStreak(userId)) >= 3;
          break;
        case "streak_7":
          progress = Math.min((await GamificationService.getStreak(userId)) * 14, 100);
          earned = (await GamificationService.getStreak(userId)) >= 7;
          break;
        case "level_5":
          progress = Math.min(user.level * 20, 100);
          earned = user.level >= 5;
          break;
        case "xp_500":
          progress = Math.min(user.xp / 5, 100);
          earned = user.xp >= 500;
          break;
        case "perfect_quiz":
          const perfectQuizzes = await ModuleProgress.count({
            where: { userId, score: 100 },
          });
          progress = Math.min(perfectQuizzes * 100, 100);
          earned = perfectQuizzes >= 1;
          break;
        case "explorer":
          progress = 100;
          earned = true;
          break;
        default:
          progress = 0;
      }

      if (earned) {
        await UserBadge.create({
          userId,
          badgeId: badge.id,
          progress: 100,
        });

        await GamificationService.addXp(userId, badge.xpReward, `badge:${badge.key}`);
        await GamificationService.addGems(userId, badge.gemsReward);

        earnedBadges.push({
          badge,
          progress: 100,
          xpEarned: badge.xpReward,
          gemsEarned: badge.gemsReward,
        });
      }
    }

    return earnedBadges;
  }

  static async getUserBadges(userId: string) {
    const userBadges = await UserBadge.findAll({
      where: { userId },
      include: [
        {
          model: Badge,
          as: "badge",
        },
      ],
      order: [["earnedAt", "DESC"]],
    });

    return userBadges.map((ub: any) => ({
      ...ub.badge?.get({ plain: true }),
      earnedAt: ub.earnedAt,
      progress: ub.progress,
    }));
  }

  static async getBadgeProgress(userId: string) {
    const allBadges = await Badge.findAll();
    const userBadges = await UserBadge.findAll({
      where: { userId },
    });

    const earnedMap = new Map(userBadges.map((ub: any) => [ub.badgeId, ub]));

    return allBadges.map((badge) => {
      const earned = earnedMap.get(badge.id);
      return {
        id: badge.id,
        key: badge.key,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity,
        earned: !!earned,
        earnedAt: earned?.earnedAt || null,
        progress: earned ? 100 : 0,
        xpReward: badge.xpReward,
        gemsReward: badge.gemsReward,
      };
    });
  }
}

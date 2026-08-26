import { User, Quest, UserQuest, DailyActivity } from "../db";
import { Op } from "sequelize";
import { GamificationService } from "./gamificationService";

export class QuestService {
  static async getDailyQuests(userId: string) {
    const result = await this.getQuests(userId);
    return result.daily;
  }

  static async getWeeklyQuests(userId: string) {
    const result = await this.getQuests(userId);
    return result.weekly;
  }

  static async getQuests(userId: string) {
    const daily = await this._fetchQuestsByType(userId, "daily");
    const weekly = await this._fetchQuestsByType(userId, "weekly");
    return { daily, weekly };
  }

  private static async _fetchQuestsByType(userId: string, type: "daily" | "weekly") {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (type === "daily" ? 1 : 7));

    const quests = await Quest.findAll({
      where: { type, isActive: true },
    });

    const userQuests = await UserQuest.findAll({
      where: {
        userId,
        questId: quests.map((q) => q.id),
      },
    });

    const userQuestMap = new Map(userQuests.map((uq: any) => [uq.questId, uq]));

    let activityQuery: any = { where: { userId } };
    if (type === "daily") {
      const today = now.toISOString().split("T")[0];
      activityQuery = { where: { userId, date: today } };
    } else {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
        .toISOString()
        .split("T")[0];
      activityQuery = {
        where: {
          userId,
          date: { [Op.gte]: sevenDaysAgo },
        },
      };
    }

    const activities = await DailyActivity.findAll(activityQuery as any);
    const aggregated = activities.reduce(
      (acc, a: any) => ({
        xp: acc.xp + (a.xpEarned || 0),
        lessons: acc.lessons + (a.lessonsCompleted || 0),
        quizzes: acc.quizzes + (a.quizzesPassed || 0),
        days: acc.days + 1,
      }),
      { xp: 0, lessons: 0, quizzes: 0, days: 0 }
    );

    return quests.map((quest) => {
      const userQuest = userQuestMap.get(quest.id);
      let progress = 0;

      switch (quest.key) {
        case "complete_1_lesson":
        case "complete_3_lessons":
          progress = Math.min(aggregated.lessons, quest.target);
          break;
        case "win_2_quizzes":
          progress = Math.min(aggregated.quizzes, quest.target);
          break;
        case "earn_50_xp":
          progress = Math.min(aggregated.xp, quest.target);
          break;
        case "week_complete_3_lessons":
          progress = Math.min(aggregated.lessons, quest.target);
          break;
        case "week_earn_200_xp":
          progress = Math.min(aggregated.xp, quest.target);
          break;
        case "week_active_7_days":
          progress = Math.min(aggregated.days, quest.target);
          break;
        default:
          progress = userQuest?.progress || 0;
      }

      const isCompleted = progress >= quest.target;
      const isClaimed = userQuest?.status === "claimed";

      const expiresAt =
        type === "daily"
          ? new Date(now.getTime() + 86400000)
          : new Date(now.getTime() + 7 * 86400000);

      return {
        id: quest.id,
        key: quest.key,
        title: quest.title,
        description: quest.description,
        type: quest.type,
        target: quest.target,
        progress,
        isCompleted,
        isClaimed,
        xpReward: quest.xpReward,
        gemsReward: quest.gemsReward,
        expiresAt: expiresAt.toISOString(),
      };
    });
  }

  static async refreshWeeklyQuests() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

    const activeWeeklyQuests = await Quest.findAll({
      where: { type: "weekly", isActive: true },
    });

    for (const quest of activeWeeklyQuests) {
      await UserQuest.update(
        { status: "expired", expiresAt: now },
        {
          where: {
            questId: quest.id,
            status: { [Op.or]: ["active", "completed"] },
            expiresAt: { [Op.lt]: sevenDaysAgo },
          },
        }
      );
    }

    return { refreshed: activeWeeklyQuests.length };
  }

  static async claimQuestReward(userId: string, questId: string) {
    const userQuest = await UserQuest.findOne({
      where: { userId, questId },
    });

    if (!userQuest || userQuest.status !== "completed") {
      throw new Error("Quest not completed or not found");
    }

    const quest = await Quest.findByPk(questId);
    if (!quest) throw new Error("Quest not found");

    userQuest.status = "claimed";
    userQuest.claimedAt = new Date();
    await userQuest.save();

    await GamificationService.addXp(userId, quest.xpReward, `quest:${quest.key}`);
    await GamificationService.addGems(userId, quest.gemsReward);

    return {
      xpEarned: quest.xpReward,
      gemsEarned: quest.gemsReward,
    };
  }

  static async updateQuestProgress(userId: string, questKey: string, increment: number = 1) {
    const quest = await Quest.findOne({
      where: { key: questKey, isActive: true },
    });

    if (!quest) return null;

    const [userQuest] = await UserQuest.findOrCreate({
      where: { userId, questId: quest.id },
      defaults: {
        userId,
        questId: quest.id,
        status: "active",
        progress: 0,
        expiresAt: new Date(Date.now() + (quest.type === "weekly" ? 7 * 86400000 : 86400000)),
      },
    });

    if (userQuest.status === "claimed") return null;

    userQuest.progress = Math.min((userQuest as any).progress + increment, quest.target);

    if ((userQuest as any).progress >= quest.target) {
      (userQuest as any).status = "completed";
      await GamificationService.addGems(userId, quest.gemsReward);
    }

    await userQuest.save();
    return userQuest;
  }

  static async refreshDailyQuests() {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const activeQuests = await Quest.findAll({
      where: { type: "daily", isActive: true },
    });

    for (const quest of activeQuests) {
      await UserQuest.update(
        { status: "expired", expiresAt: new Date(today) },
        {
          where: {
            questId: quest.id,
            status: { [Op.or]: ["active", "completed"] },
            expiresAt: { [Op.lt]: new Date(today) },
          },
        }
      );
    }

    return { refreshed: activeQuests.length };
  }
}

import { User, Quest, UserQuest, DailyActivity } from "../db";
import { Op } from "sequelize";
import { GamificationService } from "./gamificationService";

export class QuestService {
  static async getDailyQuests(userId: string) {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const dailyQuests = await Quest.findAll({
      where: { type: "daily", isActive: true },
    });

    const userQuests = await UserQuest.findAll({
      where: {
        userId,
        questId: dailyQuests.map((q) => q.id),
      },
    });

    const userQuestMap = new Map(userQuests.map((uq: any) => [uq.questId, uq]));

    const todayActivity = await DailyActivity.findOne({
      where: { userId, date: today },
    });

    const lessonsToday = todayActivity?.lessonsCompleted || 0;
    const quizzesToday = todayActivity?.quizzesPassed || 0;
    const xpToday = todayActivity?.xpEarned || 0;

    return dailyQuests.map((quest) => {
      const userQuest = userQuestMap.get(quest.id);
      let progress = 0;

      switch (quest.key) {
        case "complete_1_lesson":
          progress = Math.min(lessonsToday, quest.target);
          break;
        case "complete_3_lessons":
          progress = Math.min(lessonsToday, quest.target);
          break;
        case "win_2_quizzes":
          progress = Math.min(quizzesToday, quest.target);
          break;
        case "earn_50_xp":
          progress = Math.min(xpToday, quest.target);
          break;
        default:
          progress = userQuest?.progress || 0;
      }

      const isCompleted = progress >= quest.target;
      const isClaimed = userQuest?.status === "claimed";

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
        expiresAt: tomorrow,
      };
    });
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
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    if (userQuest.status === "claimed") return null;

    userQuest.progress = Math.min((userQuest as any).progress + increment, quest.target);

    if ((userQuest as any).progress >= quest.target) {
      (userQuest as any).status = "completed";
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

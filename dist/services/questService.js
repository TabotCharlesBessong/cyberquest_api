"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestService = void 0;
const db_1 = require("../db");
const sequelize_1 = require("sequelize");
const gamificationService_1 = require("./gamificationService");
class QuestService {
    static async getDailyQuests(userId) {
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
        const dailyQuests = await db_1.Quest.findAll({
            where: { type: "daily", isActive: true },
        });
        const userQuests = await db_1.UserQuest.findAll({
            where: {
                userId,
                questId: dailyQuests.map((q) => q.id),
            },
        });
        const userQuestMap = new Map(userQuests.map((uq) => [uq.questId, uq]));
        const todayActivity = await db_1.DailyActivity.findOne({
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
    static async claimQuestReward(userId, questId) {
        const userQuest = await db_1.UserQuest.findOne({
            where: { userId, questId },
        });
        if (!userQuest || userQuest.status !== "completed") {
            throw new Error("Quest not completed or not found");
        }
        const quest = await db_1.Quest.findByPk(questId);
        if (!quest)
            throw new Error("Quest not found");
        userQuest.status = "claimed";
        userQuest.claimedAt = new Date();
        await userQuest.save();
        await gamificationService_1.GamificationService.addXp(userId, quest.xpReward, `quest:${quest.key}`);
        await gamificationService_1.GamificationService.addGems(userId, quest.gemsReward);
        return {
            xpEarned: quest.xpReward,
            gemsEarned: quest.gemsReward,
        };
    }
    static async updateQuestProgress(userId, questKey, increment = 1) {
        const quest = await db_1.Quest.findOne({
            where: { key: questKey, isActive: true },
        });
        if (!quest)
            return null;
        const [userQuest] = await db_1.UserQuest.findOrCreate({
            where: { userId, questId: quest.id },
            defaults: {
                userId,
                questId: quest.id,
                status: "active",
                progress: 0,
                expiresAt: new Date(Date.now() + 86400000),
            },
        });
        if (userQuest.status === "claimed")
            return null;
        userQuest.progress = Math.min(userQuest.progress + increment, quest.target);
        if (userQuest.progress >= quest.target) {
            userQuest.status = "completed";
        }
        await userQuest.save();
        return userQuest;
    }
    static async refreshDailyQuests() {
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
        const activeQuests = await db_1.Quest.findAll({
            where: { type: "daily", isActive: true },
        });
        for (const quest of activeQuests) {
            await db_1.UserQuest.update({ status: "expired", expiresAt: new Date(today) }, {
                where: {
                    questId: quest.id,
                    status: { [sequelize_1.Op.or]: ["active", "completed"] },
                    expiresAt: { [sequelize_1.Op.lt]: new Date(today) },
                },
            });
        }
        return { refreshed: activeQuests.length };
    }
}
exports.QuestService = QuestService;
//# sourceMappingURL=questService.js.map
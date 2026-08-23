"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const questService_1 = require("../services/questService");
jest.mock("../db", () => ({
    User: { findByPk: jest.fn(), update: jest.fn() },
    Quest: { findAll: jest.fn(), findOne: jest.fn(), findByPk: jest.fn() },
    UserQuest: { findAll: jest.fn(), findOne: jest.fn(), findOrCreate: jest.fn(), update: jest.fn() },
    DailyActivity: { findOne: jest.fn() },
}));
const db_1 = require("../db");
describe("QuestService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("getDailyQuests", () => {
        it("returns daily quests with progress", async () => {
            jest.mocked(db_1.Quest.findAll).mockResolvedValue([
                { id: "q1", key: "complete_1_lesson", title: "First Lesson", description: "Complete 1 lesson", target: 1, xpReward: 15, gemsReward: 5, type: "daily" },
            ]);
            jest.mocked(db_1.UserQuest.findAll).mockResolvedValue([]);
            jest.mocked(db_1.DailyActivity.findOne).mockResolvedValue({ lessonsCompleted: 1, quizzesPassed: 0, xpEarned: 10 });
            const result = await questService_1.QuestService.getDailyQuests("user-1");
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe("First Lesson");
            expect(result[0].progress).toBe(1);
            expect(result[0].isCompleted).toBe(true);
        });
    });
    describe("claimQuestReward", () => {
        it("claims completed quest and awards XP/gems", async () => {
            jest.mocked(db_1.User.findByPk).mockResolvedValue({ id: "user-1", level: 1, xp: 0, save: jest.fn() });
            jest.mocked(db_1.UserQuest.findOne).mockResolvedValue({ questId: "q1", status: "completed", save: jest.fn() });
            jest.mocked(db_1.Quest.findByPk).mockResolvedValue({ id: "q1", xpReward: 15, gemsReward: 5 });
            const result = await questService_1.QuestService.claimQuestReward("user-1", "q1");
            expect(result.xpEarned).toBe(15);
            expect(result.gemsEarned).toBe(5);
        });
        it("throws if quest not completed", async () => {
            jest.mocked(db_1.UserQuest.findOne).mockResolvedValue({ questId: "q1", status: "active" });
            await expect(questService_1.QuestService.claimQuestReward("user-1", "q1")).rejects.toThrow("Quest not completed");
        });
    });
    describe("updateQuestProgress", () => {
        it("creates and updates user quest progress", async () => {
            jest.mocked(db_1.Quest.findOne).mockResolvedValue({ id: "q1", key: "complete_1_lesson", target: 1, isActive: true });
            jest.mocked(db_1.UserQuest.findOrCreate).mockResolvedValue([
                { questId: "q1", progress: 0, status: "active", save: jest.fn() },
                true,
            ]);
            const result = await questService_1.QuestService.updateQuestProgress("user-1", "complete_1_lesson", 1);
            expect(result?.progress).toBe(1);
            expect(result?.status).toBe("completed");
        });
    });
});
//# sourceMappingURL=questService.test.js.map
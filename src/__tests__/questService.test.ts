import { QuestService } from "../services/questService";

jest.mock("../db", () => ({
  User: { findByPk: jest.fn(), update: jest.fn() },
  Quest: { findAll: jest.fn(), findOne: jest.fn(), findByPk: jest.fn() },
  UserQuest: { findAll: jest.fn(), findOne: jest.fn(), findOrCreate: jest.fn(), update: jest.fn() },
  DailyActivity: { findOne: jest.fn() },
}));

import { User, Quest, UserQuest, DailyActivity } from "../db";

describe("QuestService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getDailyQuests", () => {
    it("returns daily quests with progress", async () => {
      jest.mocked(Quest.findAll).mockResolvedValue([
        { id: "q1", key: "complete_1_lesson", title: "First Lesson", description: "Complete 1 lesson", target: 1, xpReward: 15, gemsReward: 5, type: "daily" },
      ] as any);
      jest.mocked(UserQuest.findAll).mockResolvedValue([] as any);
      jest.mocked(DailyActivity.findOne).mockResolvedValue({ lessonsCompleted: 1, quizzesPassed: 0, xpEarned: 10 } as any);

      const result = await QuestService.getDailyQuests("user-1");
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("First Lesson");
      expect(result[0].progress).toBe(1);
      expect(result[0].isCompleted).toBe(true);
    });
  });

  describe("claimQuestReward", () => {
    it("claims completed quest and awards XP/gems", async () => {
      jest.mocked(User.findByPk).mockResolvedValue({ id: "user-1", level: 1, xp: 0, save: jest.fn() } as any);
      jest.mocked(UserQuest.findOne).mockResolvedValue({ questId: "q1", status: "completed", save: jest.fn() } as any);
      jest.mocked(Quest.findByPk).mockResolvedValue({ id: "q1", xpReward: 15, gemsReward: 5 } as any);

      const result = await QuestService.claimQuestReward("user-1", "q1");
      expect(result.xpEarned).toBe(15);
      expect(result.gemsEarned).toBe(5);
    });

    it("throws if quest not completed", async () => {
      jest.mocked(UserQuest.findOne).mockResolvedValue({ questId: "q1", status: "active" } as any);
      await expect(QuestService.claimQuestReward("user-1", "q1")).rejects.toThrow("Quest not completed");
    });
  });

  describe("updateQuestProgress", () => {
    it("creates and updates user quest progress", async () => {
      jest.mocked(Quest.findOne).mockResolvedValue({ id: "q1", key: "complete_1_lesson", target: 1, isActive: true } as any);
      jest.mocked(UserQuest.findOrCreate).mockResolvedValue([
        { questId: "q1", progress: 0, status: "active", save: jest.fn() },
        true,
      ] as any);

      const result = await QuestService.updateQuestProgress("user-1", "complete_1_lesson", 1);
      expect(result?.progress).toBe(1);
      expect((result as any)?.status).toBe("completed");
    });
  });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const badgeService_1 = require("../services/badgeService");
jest.mock("../db", () => ({
    User: { findByPk: jest.fn() },
    Badge: { findAll: jest.fn() },
    UserBadge: { findOne: jest.fn(), create: jest.fn(), findAll: jest.fn() },
    ModuleProgress: { count: jest.fn() },
}));
const db_1 = require("../db");
describe("BadgeService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("checkAndAwardBadges", () => {
        it("returns empty array when user not found", async () => {
            jest.mocked(db_1.User.findByPk).mockResolvedValue(null);
            const result = await badgeService_1.BadgeService.checkAndAwardBadges("user-1");
            expect(result).toEqual([]);
        });
        it("awards first_lesson badge immediately", async () => {
            jest.mocked(db_1.User.findByPk).mockResolvedValue({ id: "user-1", level: 1, xp: 0, save: jest.fn() });
            jest.mocked(db_1.Badge.findAll).mockResolvedValue([
                { id: "badge-1", key: "first_lesson", xpReward: 10, gemsReward: 5 },
            ]);
            jest.mocked(db_1.UserBadge.findOne).mockResolvedValue(null);
            jest.mocked(db_1.UserBadge.create).mockResolvedValue({});
            const result = await badgeService_1.BadgeService.checkAndAwardBadges("user-1");
            expect(result).toHaveLength(1);
            expect(result[0].badge.key).toBe("first_lesson");
        });
        it("does not award badge already earned", async () => {
            jest.mocked(db_1.User.findByPk).mockResolvedValue({ id: "user-1", level: 1, xp: 0 });
            jest.mocked(db_1.Badge.findAll).mockResolvedValue([
                { id: "badge-1", key: "first_lesson", xpReward: 10, gemsReward: 5 },
            ]);
            jest.mocked(db_1.UserBadge.findOne).mockResolvedValue({ id: "ub-1" });
            const result = await badgeService_1.BadgeService.checkAndAwardBadges("user-1");
            expect(result).toHaveLength(0);
        });
    });
    describe("getUserBadges", () => {
        it("returns earned badges with badge details", async () => {
            jest.mocked(db_1.UserBadge.findAll).mockResolvedValue([
                { badgeId: "badge-1", earnedAt: new Date(), progress: 100, badge: { get: () => ({ id: "badge-1", key: "first_lesson", name: "First Steps", icon: "👣", rarity: "common", xpReward: 10, gemsReward: 5 }) } },
            ]);
            const result = await badgeService_1.BadgeService.getUserBadges("user-1");
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe("First Steps");
            expect(result[0].earnedAt).toBeInstanceOf(Date);
        });
    });
    describe("getBadgeProgress", () => {
        it("returns all badges with earned status", async () => {
            jest.mocked(db_1.Badge.findAll).mockResolvedValue([
                { id: "badge-1", key: "first_lesson", name: "First Steps", icon: "👣", rarity: "common", xpReward: 10, gemsReward: 5 },
            ]);
            jest.mocked(db_1.UserBadge.findAll).mockResolvedValue([]);
            const result = await badgeService_1.BadgeService.getBadgeProgress("user-1");
            expect(result).toHaveLength(1);
            expect(result[0].earned).toBe(false);
            expect(result[0].progress).toBe(0);
        });
    });
});
//# sourceMappingURL=badgeService.test.js.map
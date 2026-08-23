"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refillHearts = exports.consumeHeart = exports.claimQuestReward = exports.getBadges = exports.getProfile = exports.recordActivity = void 0;
const db_1 = require("../db");
const sequelize_1 = require("sequelize");
const gamificationService_1 = require("../services/gamificationService");
const badgeService_1 = require("../services/badgeService");
const questService_1 = require("../services/questService");
const shopService_1 = require("../services/shopService");
const User_1 = require("../db/models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const ACTIVITY_REWARDS = {
    daily_login: { xp: 10, gems: 1, cooldownHours: 20 },
    profile_view: { xp: 2, gems: 0, cooldownHours: 0 },
    shop_visit: { xp: 2, gems: 0, cooldownHours: 0 },
    purchase: { xp: 10, gems: 0, cooldownHours: 0 },
    avatar_change: { xp: 5, gems: 0, cooldownHours: 0 },
    leaderboard_view: { xp: 2, gems: 0, cooldownHours: 0 },
    watch_ad: { xp: 5, gems: 0, cooldownHours: 0 },
};
exports.recordActivity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { action } = req.body;
    if (!action || !ACTIVITY_REWARDS[action]) {
        res.status(400).json({ success: false, message: "Invalid action" });
        return;
    }
    const reward = ACTIVITY_REWARDS[action];
    const today = new Date().toISOString().split("T")[0];
    if (reward.cooldownHours > 0) {
        const cutoff = new Date(Date.now() - reward.cooldownHours * 60 * 60 * 1000).toISOString();
        const recent = await db_1.DailyActivity.findOne({
            where: {
                userId,
                date: today,
                lastActionAt: { [sequelize_1.Op.gte]: cutoff },
            },
        });
        if (recent) {
            res.status(200).json({
                success: true,
                data: {
                    rewarded: false,
                    message: `Already rewarded for ${action} today. Come back later!`,
                    stats: await gamificationService_1.GamificationService.addXp(userId, 0, `activity_${action}`),
                },
            });
            return;
        }
    }
    const xpResult = await gamificationService_1.GamificationService.addXp(userId, reward.xp, `activity_${action}`);
    if (reward.gems > 0) {
        await gamificationService_1.GamificationService.addGems(userId, reward.gems);
    }
    const [activity] = await db_1.DailyActivity.findOrCreate({
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
    await gamificationService_1.GamificationService.updateStreak(userId);
    await badgeService_1.BadgeService.checkAndAwardBadges(userId);
    await questService_1.QuestService.updateQuestProgress(userId, "daily_login");
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
exports.getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await db_1.User.findByPk(req.user.id);
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }
    const [badges, dailyQuests, inventory] = await Promise.all([
        badgeService_1.BadgeService.getUserBadges(user.id),
        questService_1.QuestService.getDailyQuests(user.id),
        shopService_1.ShopService.getUserInventory(user.id),
    ]);
    res.status(200).json({
        success: true,
        data: {
            user: (0, User_1.sanitizeUser)(user),
            badges,
            dailyQuests,
            inventory,
            stats: {
                xp: user.xp,
                level: user.level,
                xpForNext: gamificationService_1.GamificationService.xpForNextLevel(user.xp),
                xpIntoLevel: gamificationService_1.GamificationService.xpIntoLevel(user.xp),
                streak: user.streak,
                hearts: user.hearts,
                gems: user.gems,
            },
        },
    });
});
exports.getBadges = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const badges = await badgeService_1.BadgeService.getBadgeProgress(req.user.id);
    res.status(200).json({ success: true, data: { badges } });
});
exports.claimQuestReward = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { questId } = req.params;
    const result = await questService_1.QuestService.claimQuestReward(req.user.id, questId);
    res.status(200).json({ success: true, data: result });
});
exports.consumeHeart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const success = await gamificationService_1.GamificationService.consumeHeart(userId);
    const user = await db_1.User.findByPk(userId);
    res.status(200).json({
        success: true,
        data: {
            consumed: success,
            hearts: user?.hearts ?? 0,
        },
    });
});
exports.refillHearts = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { method } = req.body;
    const user = await db_1.User.findByPk(userId);
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }
    if (user.hearts >= 10) {
        res.status(200).json({ success: true, data: { hearts: user.hearts, message: "Hearts are already full" } });
        return;
    }
    if (method === "gems") {
        const GEM_COST_PER_HEART = 10;
        const missingHearts = 5 - (user.hearts ?? 0);
        if (missingHearts <= 0) {
            res.status(200).json({ success: true, data: { hearts: user.hearts, message: "Hearts are already full" } });
            return;
        }
        const totalCost = missingHearts * GEM_COST_PER_HEART;
        const spent = await gamificationService_1.GamificationService.spendGems(userId, totalCost);
        if (!spent) {
            res.status(400).json({ success: false, message: "Not enough gems" });
            return;
        }
        const newHearts = await gamificationService_1.GamificationService.replenishHearts(userId, missingHearts);
        const refreshed = await db_1.User.findByPk(userId);
        res.status(200).json({ success: true, data: { hearts: refreshed?.hearts ?? user.hearts, gemsSpent: totalCost } });
        return;
    }
    if (method === "ad") {
        await gamificationService_1.GamificationService.replenishHearts(userId, 1);
        await gamificationService_1.GamificationService.addXp(userId, 5, "watch_ad");
        res.status(200).json({ success: true, data: { hearts: user.hearts + 1, xpEarned: 5 } });
        return;
    }
    if (method === "rewards") {
        const cost = 50;
        if ((user.xp ?? 0) < cost) {
            res.status(400).json({ success: false, message: "Not enough XP" });
            return;
        }
        await gamificationService_1.GamificationService.addXp(userId, -cost, "refill_hearts_rewards");
        await gamificationService_1.GamificationService.replenishHearts(userId, 3);
        const refreshed = await db_1.User.findByPk(userId);
        res.status(200).json({ success: true, data: { hearts: refreshed?.hearts ?? user.hearts, xpSpent: cost } });
        return;
    }
    res.status(400).json({ success: false, message: "Invalid refill method" });
});
//# sourceMappingURL=gamificationController.js.map
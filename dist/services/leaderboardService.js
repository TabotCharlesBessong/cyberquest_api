"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const db_1 = require("../db");
const eventService_1 = require("./eventService");
const logger_1 = __importDefault(require("../utils/logger"));
class LeaderboardService {
    static getCurrentSeason() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        return `${year}-${month.toString().padStart(2, "0")}`;
    }
    static async getLeaderboard(scope, school) {
        const seasonId = this.getCurrentSeason();
        let where = { scope, seasonId };
        const entries = await db_1.LeaderboardEntry.findAll({
            where,
            include: [
                {
                    model: db_1.User,
                    as: "user",
                    attributes: ["id", "name", "avatar", "ageGroup"],
                },
            ],
            order: [["score", "DESC"], ["createdAt", "ASC"]],
        });
        const ranked = entries.map((entry, index) => {
            const user = entry.user;
            return {
                userId: entry.userId,
                name: user?.name || "Unknown",
                avatar: user?.avatar || "🦸",
                ageGroup: user?.ageGroup || "A",
                score: entry.score,
                rank: index + 1,
            };
        });
        logger_1.default.info("Leaderboard fetched", { scope, seasonId, count: ranked.length });
        return ranked;
    }
    static async recomputeLeaderboard(scope, school) {
        const seasonId = this.getCurrentSeason();
        const multiplier = await eventService_1.EventService.getActiveMultiplier();
        await db_1.LeaderboardEntry.destroy({
            where: { scope, seasonId },
        });
        const users = await db_1.User.findAll({
            where: { ageGroup: "B" },
            attributes: ["id", "name", "avatar", "ageGroup", "xp"],
        });
        const rows = users.map((user) => ({
            userId: user.id,
            scope,
            seasonId,
            score: Math.round(user.xp * multiplier),
        }));
        if (rows.length > 0) {
            await db_1.LeaderboardEntry.bulkCreate(rows);
        }
        logger_1.default.info("Leaderboard recomputed", { scope, seasonId, count: rows.length, multiplier });
        return rows.length;
    }
}
exports.LeaderboardService = LeaderboardService;
//# sourceMappingURL=leaderboardService.js.map
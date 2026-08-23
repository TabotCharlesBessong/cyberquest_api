"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueService = void 0;
const db_1 = require("../db");
const eventService_1 = require("./eventService");
const logger_1 = __importDefault(require("../utils/logger"));
const TIERS = ["bronze", "silver", "gold", "diamond"];
class LeagueService {
    static getCurrentSeason() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        return `${year}-${month.toString().padStart(2, "0")}`;
    }
    static getWeekRange() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);
        return { monday, sunday };
    }
    static async ensureLeague(tier, seasonId) {
        const { monday, sunday } = this.getWeekRange();
        const [league] = await db_1.League.findOrCreate({
            where: { tier, seasonId },
            defaults: {
                name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} League`,
                tier,
                seasonId,
                startsAt: monday,
                endsAt: sunday,
            },
        });
        return league;
    }
    static async getUserLeague(userId) {
        const user = await db_1.User.findByPk(userId);
        if (!user || user.ageGroup !== "B")
            return null;
        const seasonId = this.getCurrentSeason();
        const membership = await db_1.LeagueMembership.findOne({
            where: { userId },
            include: [
                {
                    model: db_1.League,
                    as: "league",
                    where: { seasonId },
                    required: true,
                },
            ],
        });
        return membership || null;
    }
    static async getLeagueStandings(leagueId) {
        const multiplier = await eventService_1.EventService.getActiveMultiplier();
        const members = await db_1.LeagueMembership.findAll({
            where: { leagueId },
            include: [
                {
                    model: db_1.User,
                    as: "user",
                    attributes: ["id", "name", "avatar"],
                },
            ],
            order: [["xp", "DESC"], ["createdAt", "ASC"]],
        });
        return members.map((m, index) => {
            const user = m.user;
            return {
                userId: m.userId,
                name: user?.name || "Unknown",
                avatar: user?.avatar || "🦸",
                xp: Math.round(m.xp * multiplier),
                rank: index + 1,
                promoted: m.promoted,
                demoted: m.demoted,
                changeNote: m.changeNote,
            };
        });
    }
    static async assignMembersToLeagues(seasonId) {
        const users = await db_1.User.findAll({
            where: { ageGroup: "B" },
            attributes: ["id", "xp"],
        });
        const sorted = users.sort((a, b) => b.xp - a.xp);
        const total = sorted.length;
        const perTier = Math.max(1, Math.floor(total / TIERS.length));
        for (const tier of TIERS) {
            await this.ensureLeague(tier, seasonId);
        }
        for (let i = 0; i < total; i++) {
            const user = sorted[i];
            const tierIndex = Math.min(TIERS.length - 1, Math.floor(i / perTier));
            const tier = TIERS[tierIndex];
            const league = await this.ensureLeague(tier, seasonId);
            await db_1.LeagueMembership.upsert({
                leagueId: league.id,
                userId: user.id,
                xp: user.xp,
                rank: i + 1,
                promoted: false,
                demoted: false,
                changeNote: undefined,
            });
        }
        logger_1.default.info("Members assigned to leagues", { seasonId, total });
        return total;
    }
    static async weeklyPromoteDemote() {
        const seasonId = this.getCurrentSeason();
        const multiplier = await eventService_1.EventService.getActiveMultiplier();
        const leagues = await db_1.League.findAll({ where: { seasonId } });
        for (const league of leagues) {
            const members = await db_1.LeagueMembership.findAll({
                where: { leagueId: league.id },
                include: [{ model: db_1.User, as: "user", attributes: ["id", "xp"] }],
                order: [["xp", "DESC"]],
            });
            const total = members.length;
            if (total === 0)
                continue;
            const ranked = members
                .map((m) => ({ ...m, adjustedXp: Math.round(m.user.xp * multiplier) }))
                .sort((a, b) => b.adjustedXp - a.adjustedXp);
            const promoteCount = Math.max(1, Math.floor(total * 0.2));
            const demoteCount = Math.max(1, Math.floor(total * 0.2));
            const tierIndex = TIERS.indexOf(league.tier);
            const nextTier = tierIndex < TIERS.length - 1 ? TIERS[tierIndex + 1] : null;
            const prevTier = tierIndex > 0 ? TIERS[tierIndex - 1] : null;
            const updates = [];
            for (let i = 0; i < total; i++) {
                const rankedMember = ranked[i];
                const originalMember = members[i];
                let promoted = false;
                let demoted = false;
                let changeNote;
                if (i < promoteCount && nextTier) {
                    promoted = true;
                    changeNote = `Promoted to ${nextTier}`;
                }
                else if (i >= total - demoteCount && prevTier) {
                    demoted = true;
                    changeNote = `Demoted to ${prevTier}`;
                }
                updates.push(db_1.LeagueMembership.upsert({
                    leagueId: originalMember.leagueId,
                    userId: originalMember.userId,
                    xp: originalMember.xp,
                    rank: i + 1,
                    promoted,
                    demoted,
                    changeNote,
                }));
            }
            await Promise.all(updates);
            logger_1.default.info("Weekly promote/demote complete", { leagueId: league.id, tier: league.tier, multiplier });
        }
    }
}
exports.LeagueService = LeagueService;
//# sourceMappingURL=leagueService.js.map
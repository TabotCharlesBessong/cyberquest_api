import { Op } from "sequelize";
import { sequelize } from "../db";
import { LeaderboardEntry, User } from "../db";
import { notFound } from "../utils/apiError";
import { EventService } from "./eventService";
import logger from "../utils/logger";

export class LeaderboardService {
  static getCurrentSeason(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, "0")}`;
  }

  static async getLeaderboard(scope: "class" | "school" | "global", school?: string) {
    const seasonId = this.getCurrentSeason();

    let where: Record<string, unknown> = { scope, seasonId };

    const entries = await LeaderboardEntry.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar", "ageGroup"],
        },
      ],
      order: [["score", "DESC"], ["createdAt", "ASC"]],
    });

    const ranked = entries.map((entry: any, index: number) => {
      const user = entry.user as { id: string; name: string; avatar: string; ageGroup: string } | null;
      return {
        userId: entry.userId,
        name: user?.name || "Unknown",
        avatar: user?.avatar || "🦸",
        ageGroup: user?.ageGroup || "A",
        score: entry.score,
        rank: index + 1,
      };
    });

    logger.info("Leaderboard fetched", { scope, seasonId, count: ranked.length });
    return ranked;
  }

  static async recomputeLeaderboard(scope: "class" | "school" | "global", school?: string) {
    const seasonId = this.getCurrentSeason();
    const multiplier = await EventService.getActiveMultiplier();

    await LeaderboardEntry.destroy({
      where: { scope, seasonId },
    });

    const users = await User.findAll({
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
      await LeaderboardEntry.bulkCreate(rows);
    }

    logger.info("Leaderboard recomputed", { scope, seasonId, count: rows.length, multiplier });
    return rows.length;
  }
}

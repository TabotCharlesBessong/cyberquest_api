import { Response } from "express";
import { LeaderboardService } from "../services/leaderboardService";
import { asyncHandler } from "../middleware/asyncHandler";

export const getLeaderboard = asyncHandler(async (req: any, res: Response) => {
  const scope = (req.query.scope as "class" | "school" | "global") || "global";
  const entries = await LeaderboardService.getLeaderboard(scope);
  res.status(200).json({ success: true, data: { entries } });
});

export const recomputeLeaderboard = asyncHandler(async (req: any, res: Response) => {
  const scope = (req.query.scope as "class" | "school" | "global") || "global";
  const count = await LeaderboardService.recomputeLeaderboard(scope);
  res.status(200).json({ success: true, data: { count } });
});

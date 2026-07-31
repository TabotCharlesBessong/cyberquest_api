import { Response } from "express";
import { AdminStatsService } from "../services/adminStatsService";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

export const getOverview = asyncHandler(
  async (_req: AuthedRequest, res: Response) => {
    const data = await AdminStatsService.getOverview();
    res.status(200).json({ success: true, data });
  }
);

export const getUserGrowth = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
    const data = await AdminStatsService.getUserGrowth(days);
    res.status(200).json({ success: true, data });
  }
);

export const getLessonCompletionStats = asyncHandler(
  async (_req: AuthedRequest, res: Response) => {
    const data = await AdminStatsService.getLessonCompletionStats();
    res.status(200).json({ success: true, data });
  }
);

export const getSectionPerformance = asyncHandler(
  async (_req: AuthedRequest, res: Response) => {
    const data = await AdminStatsService.getSectionPerformance();
    res.status(200).json({ success: true, data });
  }
);

export const getRecentActivity = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const data = await AdminStatsService.getRecentActivity(limit);
    res.status(200).json({ success: true, data });
  }
);

export const getUserActivityHeatmap = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const userId = typeof req.params.userId === "string" ? req.params.userId : "";
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
    const data = await AdminStatsService.getUserActivityHeatmap(userId, days);
    res.status(200).json({ success: true, data });
  }
);

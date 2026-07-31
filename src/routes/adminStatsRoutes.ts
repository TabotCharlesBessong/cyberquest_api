import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  getOverview,
  getUserGrowth,
  getLessonCompletionStats,
  getSectionPerformance,
  getRecentActivity,
  getUserActivityHeatmap,
} from "../controllers/adminStatsController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/overview", getOverview);
router.get("/users/growth", getUserGrowth);
router.get("/lessons/completion", getLessonCompletionStats);
router.get("/sections/performance", getSectionPerformance);
router.get("/recent-activity", getRecentActivity);
router.get("/users/:userId/activity-heatmap", getUserActivityHeatmap);

export default router;

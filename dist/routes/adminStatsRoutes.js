"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminStatsController_1 = require("../controllers/adminStatsController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/overview", adminStatsController_1.getOverview);
router.get("/users/growth", adminStatsController_1.getUserGrowth);
router.get("/lessons/completion", adminStatsController_1.getLessonCompletionStats);
router.get("/sections/performance", adminStatsController_1.getSectionPerformance);
router.get("/recent-activity", adminStatsController_1.getRecentActivity);
router.get("/users/:userId/activity-heatmap", adminStatsController_1.getUserActivityHeatmap);
exports.default = router;
//# sourceMappingURL=adminStatsRoutes.js.map
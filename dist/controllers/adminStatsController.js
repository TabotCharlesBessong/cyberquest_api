"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserActivityHeatmap = exports.getRecentActivity = exports.getSectionPerformance = exports.getLessonCompletionStats = exports.getUserGrowth = exports.getOverview = void 0;
const adminStatsService_1 = require("../services/adminStatsService");
const asyncHandler_1 = require("../middleware/asyncHandler");
exports.getOverview = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const data = await adminStatsService_1.AdminStatsService.getOverview();
    res.status(200).json({ success: true, data });
});
exports.getUserGrowth = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days, 10) : 7;
    const data = await adminStatsService_1.AdminStatsService.getUserGrowth(days);
    res.status(200).json({ success: true, data });
});
exports.getLessonCompletionStats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const data = await adminStatsService_1.AdminStatsService.getLessonCompletionStats();
    res.status(200).json({ success: true, data });
});
exports.getSectionPerformance = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const data = await adminStatsService_1.AdminStatsService.getSectionPerformance();
    res.status(200).json({ success: true, data });
});
exports.getRecentActivity = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const data = await adminStatsService_1.AdminStatsService.getRecentActivity(limit);
    res.status(200).json({ success: true, data });
});
exports.getUserActivityHeatmap = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = typeof req.params.userId === "string" ? req.params.userId : "";
    const days = req.query.days ? parseInt(req.query.days, 10) : 7;
    const data = await adminStatsService_1.AdminStatsService.getUserActivityHeatmap(userId, days);
    res.status(200).json({ success: true, data });
});
//# sourceMappingURL=adminStatsController.js.map
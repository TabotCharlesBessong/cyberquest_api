"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recomputeLeaderboard = exports.getLeaderboard = void 0;
const leaderboardService_1 = require("../services/leaderboardService");
const asyncHandler_1 = require("../middleware/asyncHandler");
exports.getLeaderboard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const scope = req.query.scope || "global";
    const entries = await leaderboardService_1.LeaderboardService.getLeaderboard(scope);
    res.status(200).json({ success: true, data: { entries } });
});
exports.recomputeLeaderboard = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const scope = req.query.scope || "global";
    const count = await leaderboardService_1.LeaderboardService.recomputeLeaderboard(scope);
    res.status(200).json({ success: true, data: { count } });
});
//# sourceMappingURL=leaderboardController.js.map
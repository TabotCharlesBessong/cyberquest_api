"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWeeklyReset = exports.getMyLeague = void 0;
const leagueService_1 = require("../services/leagueService");
const asyncHandler_1 = require("../middleware/asyncHandler");
exports.getMyLeague = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const membership = await leagueService_1.LeagueService.getUserLeague(req.user.id);
    if (!membership) {
        res.status(200).json({ success: true, data: { league: null } });
        return;
    }
    const standings = await leagueService_1.LeagueService.getLeagueStandings(membership.leagueId);
    res.status(200).json({
        success: true,
        data: {
            league: {
                id: membership.leagueId,
                tier: membership.league.tier,
                name: membership.league.name,
                xp: membership.xp,
                rank: membership.rank,
                promoted: membership.promoted,
                demoted: membership.demoted,
                changeNote: membership.changeNote,
                endsAt: membership.league.endsAt,
            },
            standings,
        },
    });
});
exports.runWeeklyReset = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    await leagueService_1.LeagueService.weeklyPromoteDemote();
    res.status(200).json({ success: true, message: "Weekly league reset complete" });
});
//# sourceMappingURL=leagueController.js.map
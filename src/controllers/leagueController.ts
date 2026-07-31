import { Response } from "express";
import { LeagueService } from "../services/leagueService";
import { asyncHandler } from "../middleware/asyncHandler";

export const getMyLeague = asyncHandler(async (req: any, res: Response) => {
  const membership: any = await LeagueService.getUserLeague(req.user.id);
  if (!membership) {
    res.status(200).json({ success: true, data: { league: null } });
    return;
  }

  const standings = await LeagueService.getLeagueStandings(membership.leagueId);
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

export const runWeeklyReset = asyncHandler(async (_req: any, res: Response) => {
  await LeagueService.weeklyPromoteDemote();
  res.status(200).json({ success: true, message: "Weekly league reset complete" });
});

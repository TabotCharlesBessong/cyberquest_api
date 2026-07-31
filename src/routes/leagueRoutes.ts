import { Router } from "express";
import { getMyLeague, runWeeklyReset } from "../controllers/leagueController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/me", getMyLeague);
router.post("/weekly-reset", runWeeklyReset);

export default router;

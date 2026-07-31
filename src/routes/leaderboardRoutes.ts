import { Router } from "express";
import { getLeaderboard, recomputeLeaderboard } from "../controllers/leaderboardController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/", getLeaderboard);
router.post("/recompute", recomputeLeaderboard);

export default router;

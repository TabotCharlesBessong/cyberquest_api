import { Router } from "express";
import { getLeaderboard, recomputeLeaderboard } from "../controllers/leaderboardController";
import { authMiddleware, adminOnly } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     tags: [Leaderboard]
 *     summary: Get global leaderboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     leaderboard:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           xp:
 *                             type: integer
 *                           level:
 *                             type: integer
 *                           rank:
 *                             type: integer
 *       401:
 *         description: Not authenticated
 */
router.get("/", getLeaderboard);

/**
 * @swagger
 * /leaderboard/recompute:
 *   post:
 *     tags: [Leaderboard]
 *     summary: Recompute leaderboard rankings (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard recomputed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/recompute", adminOnly, recomputeLeaderboard);

export default router;

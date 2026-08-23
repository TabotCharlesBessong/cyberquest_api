"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboardController_1 = require("../controllers/leaderboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
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
router.get("/", leaderboardController_1.getLeaderboard);
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
router.post("/recompute", auth_1.adminOnly, leaderboardController_1.recomputeLeaderboard);
exports.default = router;
//# sourceMappingURL=leaderboardRoutes.js.map
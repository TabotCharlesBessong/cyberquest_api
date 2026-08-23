"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leagueController_1 = require("../controllers/leagueController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
/**
 * @swagger
 * /leagues/me:
 *   get:
 *     tags: [Leagues]
 *     summary: Get current user's league information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User league data
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
 *                     league:
 *                       type: string
 *                       enum: [bronze, silver, gold, platinum, diamond]
 *                     rank:
 *                       type: integer
 *                     totalPlayers:
 *                       type: integer
 *                     topPlayers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           xp:
 *                             type: integer
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/me", leagueController_1.getMyLeague);
/**
 * @swagger
 * /leagues/weekly-reset:
 *   post:
 *     tags: [Leagues]
 *     summary: Trigger weekly league reset (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: League reset completed
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
router.post("/weekly-reset", auth_1.adminOnly, leagueController_1.runWeeklyReset);
exports.default = router;
//# sourceMappingURL=leagueRoutes.js.map
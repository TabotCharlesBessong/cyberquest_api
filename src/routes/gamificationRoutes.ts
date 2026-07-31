import { Router } from "express";
import { getProfile, getBadges, claimQuestReward, recordActivity } from "../controllers/gamificationController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /gamification/activity:
 *   post:
 *     tags: [Gamification]
 *     summary: Record gamification activity for non-lesson actions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [daily_login, profile_view, shop_visit, purchase, avatar_change, leaderboard_view]
 *     responses:
 *       200:
 *         description: Activity recorded with XP/gems rewards
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
 *                     rewarded:
 *                       type: boolean
 *                     xpEarned:
 *                       type: integer
 *                     gemsEarned:
 *                       type: integer
 *                     stats:
 *                       $ref: '#/components/schemas/UserStats'
 *       400:
 *         description: Invalid action
 *       401:
 *         description: Not authenticated
 */
router.post("/activity", recordActivity);

/**
 * @swagger
 * /gamification/profile:
 *   get:
 *     tags: [Gamification]
 *     summary: Get gamification profile with stats, badges, quests and inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gamification profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GamificationProfile'
 *       401:
 *         description: Not authenticated
 */
router.get("/profile", getProfile);

/**
 * @swagger
 * /gamification/badges:
 *   get:
 *     tags: [Gamification]
 *     summary: Get badge progress for the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Badge progress list
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
 *                     badges:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Badge'
 *       401:
 *         description: Not authenticated
 */
router.get("/badges", getBadges);

/**
 * @swagger
 * /gamification/quests/{questId}/claim:
 *   post:
 *     tags: [Gamification]
 *     summary: Claim rewards for a completed quest
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Quest ID to claim
 *     responses:
 *       200:
 *         description: Quest rewards claimed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/QuestClaimResult'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Quest not found or not completed
 */
router.post("/quests/:questId/claim", claimQuestReward);

export default router;

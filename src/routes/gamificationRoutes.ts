import { Router } from "express";
import { getProfile, getBadges, claimQuestReward, recordActivity, consumeHeart, refillHearts } from "../controllers/gamificationController";
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
 *             required:
 *               - action
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
 *                       $ref: '#/components/schemas/Stats'
 *       400:
 *         description: Invalid action
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *               $ref: '#/components/schemas/GamificationProfile'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Quest not found or not completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/quests/:questId/claim", claimQuestReward);

/**
 * @swagger
 * /gamification/hearts/consume:
 *   post:
 *     tags: [Gamification]
 *     summary: Consume one heart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Heart consumed
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
 *                     consumed:
 *                       type: boolean
 *                     hearts:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/hearts/consume", consumeHeart);

/**
 * @swagger
 * /gamification/hearts/refill:
 *   post:
 *     tags: [Gamification]
 *     summary: Refill hearts using gems, ad, or rewards
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [gems, ad, rewards]
 *     responses:
 *       200:
 *         description: Hearts refilled
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
 *                     hearts:
 *                       type: integer
 *                     gemsSpent:
 *                       type: integer
 *                     xpEarned:
 *                       type: integer
 *                     xpSpent:
 *                       type: integer
 *       400:
 *         description: Invalid method or insufficient currency
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/hearts/refill", refillHearts);

export default router;

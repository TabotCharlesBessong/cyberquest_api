import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  getOverview,
  getUserGrowth,
  getLessonCompletionStats,
  getSectionPerformance,
  getRecentActivity,
  getUserActivityHeatmap,
} from "../controllers/adminStatsController";

const router = Router();

router.use(authMiddleware, adminOnly);

/**
 * @swagger
 * /admin/stats/overview:
 *   get:
 *     tags: [Admin - Statistics]
 *     summary: Get dashboard overview statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AdminStatsOverview'
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
router.get("/overview", getOverview);

/**
 * @swagger
 * /admin/stats/users/growth:
 *   get:
 *     tags: [Admin - Statistics]
 *     summary: Get user growth over time
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *         description: Number of days to look back
 *     responses:
 *       200:
 *         description: User growth data points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
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
router.get("/users/growth", getUserGrowth);

/**
 * @swagger
 * /admin/stats/lessons/completion:
 *   get:
 *     tags: [Admin - Statistics]
 *     summary: Get lesson completion statistics over time
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lesson completion data points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       count:
 *                         type: integer
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
router.get("/lessons/completion", getLessonCompletionStats);

/**
 * @swagger
 * /admin/stats/sections/performance:
 *   get:
 *     tags: [Admin - Statistics]
 *     summary: Get performance metrics by section
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Section performance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       color:
 *                         type: string
 *                       icon:
 *                         type: string
 *                       totalLessons:
 *                         type: integer
 *                       completedCount:
 *                         type: integer
 *                       completionRate:
 *                         type: integer
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
router.get("/sections/performance", getSectionPerformance);

/**
 * @swagger
 * /admin/stats/recent-activity:
 *   get:
 *     tags: [Admin - Statistics]
 *     summary: Get recent platform activity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Recent activity entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       userName:
 *                         type: string
 *                       action:
 *                         type: string
 *                       timestamp:
 *                         type: string
 *                         format: date-time
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
router.get("/recent-activity", getRecentActivity);

/**
 * @swagger
 * /admin/stats/users/{userId}/activity-heatmap:
 *   get:
 *     tags: [Admin - Statistics]
 *     summary: Get activity heatmap for a specific user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 14
 *     responses:
 *       200:
 *         description: Activity heatmap data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       lessonsCompleted:
 *                         type: integer
 *                       xpEarned:
 *                         type: integer
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
router.get("/users/:userId/activity-heatmap", getUserActivityHeatmap);

export default router;

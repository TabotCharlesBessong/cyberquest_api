import { Router } from "express";
import { getActiveEvent, listEvents } from "../controllers/eventController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /events/active:
 *   get:
 *     tags: [Events]
 *     summary: Get currently active event
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active event details
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
 *                     event:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                         type:
 *                           type: string
 *                         startAt:
 *                           type: string
 *                           format: date-time
 *                         endAt:
 *                           type: string
 *                           format: date-time
 *                         rewards:
 *                           type: object
 *                           properties:
 *                             xp:
 *                               type: integer
 *                             gems:
 *                               type: integer
 *       404:
 *         description: No active event
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
router.get("/active", getActiveEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     tags: [Events]
 *     summary: List all events
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events
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
 *                     events:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           type:
 *                             type: string
 *                           startAt:
 *                             type: string
 *                             format: date-time
 *                           endAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", listEvents);

export default router;

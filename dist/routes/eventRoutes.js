"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
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
router.get("/active", eventController_1.getActiveEvent);
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
router.get("/", eventController_1.listEvents);
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map
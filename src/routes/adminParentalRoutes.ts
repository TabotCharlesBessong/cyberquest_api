import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  getParentalControls,
  upsertParentalControls,
} from "../controllers/adminParentalController";

const router = Router();

router.use(authMiddleware, adminOnly);

/**
 * @swagger
 * /admin/parental-controls/users/{userId}/parental-controls:
 *   get:
 *     tags: [Admin - Parental Controls]
 *     summary: Get parental controls for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Parental controls data
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
 *                     control:
 *                       $ref: '#/components/schemas/ParentalControl'
 *       404:
 *         description: Parental controls not found
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
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/users/:userId/parental-controls", getParentalControls);

/**
 * @swagger
 * /admin/parental-controls/users/{userId}/parental-controls:
 *   put:
 *     tags: [Admin - Parental Controls]
 *     summary: Create or update parental controls for a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dailyScreenTimeLimit
 *               - allowedHoursStart
 *               - allowedHoursEnd
 *               - maxDailyLessons
 *             properties:
 *               dailyScreenTimeLimit:
 *                 type: integer
 *               allowedHoursStart:
 *                 type: string
 *                 example: "08:00"
 *               allowedHoursEnd:
 *                 type: string
 *                 example: "20:00"
 *               blockedDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
 *               requireApprovalForLessons:
 *                 type: boolean
 *               maxDailyLessons:
 *                 type: integer
 *               allowChat:
 *                 type: boolean
 *               allowSocialFeatures:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Parental controls saved
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
 *                     control:
 *                       $ref: '#/components/schemas/ParentalControl'
 *       400:
 *         description: Invalid request body
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
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/users/:userId/parental-controls", upsertParentalControls);

export default router;

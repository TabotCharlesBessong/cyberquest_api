import { Router } from "express";
import { submitLessonProgress, getMyProgress } from "../controllers/progressController";
import { authMiddleware } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { progressSubmitSchema } from "../validation/schemas";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /progress/lesson:
 *   post:
 *     tags: [Progress]
 *     summary: Submit lesson progress and earn XP
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lessonId
 *               - score
 *             properties:
 *               lessonId:
 *                 type: string
 *                 format: uuid
 *               score:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               correctCount:
 *                 type: integer
 *               total:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Progress saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     lessonProgress:
 *                       $ref: '#/components/schemas/LessonProgress'
 *                     moduleProgress:
 *                       $ref: '#/components/schemas/ModuleProgress'
 *                     xpEarned:
 *                       type: integer
 *                     newLevel:
 *                       type: integer
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
 */
router.post("/lesson", validateBody(progressSubmitSchema), submitLessonProgress);

/**
 * @swagger
 * /progress/me:
 *   get:
 *     tags: [Progress]
 *     summary: Get current user's progress
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/me", getMyProgress);

export default router;

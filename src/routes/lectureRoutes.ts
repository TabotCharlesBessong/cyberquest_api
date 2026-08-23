import { Router } from "express";
import { getAllLectures, getLectureBySlug } from "../controllers/lectureController";
import { authMiddleware } from "../middleware/auth";
import { validateParams, validateQuery } from "../middleware/validate";
import { slugParamSchema, ageGroupQuerySchema } from "../validation/schemas";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /lectures:
 *   get:
 *     tags: [Lectures]
 *     summary: Get all lectures/modules
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ageGroup
 *         schema:
 *           type: string
 *           enum: [A, B]
 *         description: Filter lessons by age group
 *     responses:
 *       200:
 *         description: List of all lectures with lessons
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
 *                     lectures:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Lecture'
 *       401:
 *         description: Not authenticated
 */
router.get("/", validateQuery(ageGroupQuerySchema), getAllLectures);

/**
 * @swagger
 * /lectures/{slug}:
 *   get:
 *     tags: [Lectures]
 *     summary: Get a single lecture by slug
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Lecture slug
 *       - in: query
 *         name: ageGroup
 *         schema:
 *           type: string
 *           enum: [A, B]
 *         description: Filter lessons by age group
 *     responses:
 *       200:
 *         description: Lecture details with lessons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Lecture'
 *       404:
 *         description: Lecture not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 */
router.get(
  "/:slug",
  validateParams(slugParamSchema),
  validateQuery(ageGroupQuerySchema),
  getLectureBySlug
);

export default router;

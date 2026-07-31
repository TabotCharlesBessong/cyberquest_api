import { Router } from "express";
import { getSections, getSectionBySlug, getUnits, getUnitById, getLessons, getLessonById } from "../controllers/curriculumController";
import { authMiddleware } from "../middleware/auth";
import { validateParams, validateQuery } from "../middleware/validate";
import { slugParamSchema, ageGroupQuerySchema } from "../validation/schemas";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /curriculum/sections:
 *   get:
 *     tags: [Curriculum]
 *     summary: Get all curriculum sections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: ageGroup
 *         schema:
 *           type: string
 *           enum: [A, B]
 *         description: Filter by age group
 *     responses:
 *       200:
 *         description: List of curriculum sections with units and lessons
 */
router.get("/sections", validateQuery(ageGroupQuerySchema), getSections);

/**
 * @swagger
 * /curriculum/sections/{slug}:
 *   get:
 *     tags: [Curriculum]
 *     summary: Get a curriculum section by slug
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: ageGroup
 *         schema:
 *           type: string
 *           enum: [A, B]
 *     responses:
 *       200:
 *         description: Curriculum section with units and lessons
 *       404:
 *         description: Section not found
 */
router.get(
  "/sections/:slug",
  validateParams(slugParamSchema),
  validateQuery(ageGroupQuerySchema),
  getSectionBySlug
);

/**
 * @swagger
 * /curriculum/sections/{sectionId}/units:
 *   get:
 *     tags: [Curriculum]
 *     summary: Get units for a section
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of units with lessons
 */
router.get("/sections/:sectionId/units", getUnits);

/**
 * @swagger
 * /curriculum/units/{id}:
 *   get:
 *     tags: [Curriculum]
 *     summary: Get a unit by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unit with lessons
 *       404:
 *         description: Unit not found
 */
router.get("/units/:id", getUnitById);

/**
 * @swagger
 * /curriculum/units/{unitId}/lessons:
 *   get:
 *     tags: [Curriculum]
 *     summary: Get lessons for a unit
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of lessons with questions
 */
router.get("/units/:unitId/lessons", getLessons);

/**
 * @swagger
 * /curriculum/lessons/{id}:
 *   get:
 *     tags: [Curriculum]
 *     summary: Get a lesson by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson with questions
 *       404:
 *         description: Lesson not found
 */
router.get("/lessons/:id", getLessonById);

export default router;

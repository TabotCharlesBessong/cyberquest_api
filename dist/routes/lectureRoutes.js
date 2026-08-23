"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lectureController_1 = require("../controllers/lectureController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
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
 */
router.get("/", (0, validate_1.validateQuery)(schemas_1.ageGroupQuerySchema), lectureController_1.getAllLectures);
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
 *       404:
 *         description: Lecture not found
 */
router.get("/:slug", (0, validate_1.validateParams)(schemas_1.slugParamSchema), (0, validate_1.validateQuery)(schemas_1.ageGroupQuerySchema), lectureController_1.getLectureBySlug);
exports.default = router;
//# sourceMappingURL=lectureRoutes.js.map
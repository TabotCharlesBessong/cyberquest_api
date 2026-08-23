"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progressController_1 = require("../controllers/progressController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
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
router.post("/lesson", (0, validate_1.validateBody)(schemas_1.progressSubmitSchema), progressController_1.submitLessonProgress);
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
router.get("/me", progressController_1.getMyProgress);
exports.default = router;
//# sourceMappingURL=progressRoutes.js.map
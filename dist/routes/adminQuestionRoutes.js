"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminCurriculumController_1 = require("../controllers/adminCurriculumController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
/**
 * @swagger
 * /admin/questions/lessons/{lessonId}/questions:
 *   get:
 *     tags: [Admin - Questions]
 *     summary: Get questions for a lesson with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of questions
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
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
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
router.get("/lessons/:lessonId/questions", adminCurriculumController_1.getQuestionsByLesson);
/**
 * @swagger
 * /admin/questions:
 *   post:
 *     tags: [Admin - Questions]
 *     summary: Create a new question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *               - question
 *               - type
 *               - lessonId
 *             properties:
 *               slug:
 *                 type: string
 *               question:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [mcq, matching, sentence_builder, investigation]
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctIndex:
 *                 type: integer
 *               pairs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     left:
 *                       type: string
 *                     right:
 *                       type: string
 *               sentenceParts:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctSentence:
 *                 type: string
 *               investigationSteps:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctOrder:
 *                 type: array
 *                 items:
 *                   type: integer
 *               explanation:
 *                 type: string
 *               difficulty:
 *                 type: integer
 *               xpReward:
 *                 type: integer
 *               lessonId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Question created
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
 *                     question:
 *                       $ref: '#/components/schemas/Question'
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
router.post("/questions", adminCurriculumController_1.createQuestion);
/**
 * @swagger
 * /admin/questions/{id}:
 *   put:
 *     tags: [Admin - Questions]
 *     summary: Update a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               slug:
 *                 type: string
 *               question:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [mcq, matching, sentence_builder, investigation]
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctIndex:
 *                 type: integer
 *               pairs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     left:
 *                       type: string
 *                     right:
 *                       type: string
 *               sentenceParts:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctSentence:
 *                 type: string
 *               investigationSteps:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctOrder:
 *                 type: array
 *                 items:
 *                   type: integer
 *               explanation:
 *                 type: string
 *               difficulty:
 *                 type: integer
 *               xpReward:
 *                 type: integer
 *               lessonId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Question updated
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
 *                     question:
 *                       $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
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
router.put("/questions/:id", adminCurriculumController_1.updateQuestion);
/**
 * @swagger
 * /admin/questions/{id}:
 *   delete:
 *     tags: [Admin - Questions]
 *     summary: Delete a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Question deleted
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
 *                     question:
 *                       $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
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
router.delete("/questions/:id", adminCurriculumController_1.deleteQuestion);
exports.default = router;
//# sourceMappingURL=adminQuestionRoutes.js.map
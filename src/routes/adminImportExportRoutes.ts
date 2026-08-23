import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  exportCurriculum,
  importCurriculum,
} from "../controllers/adminCurriculumController";

const router = Router();

router.use(authMiddleware, adminOnly);

/**
 * @swagger
 * /admin/import-export/export:
 *   get:
 *     tags: [Admin - Import/Export]
 *     summary: Export full curriculum as JSON
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Curriculum JSON exported
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
 *                     curriculum:
 *                       type: object
 *                       properties:
 *                         sections:
 *                           type: array
 *                           items:
 *                             type: object
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
router.get("/export", exportCurriculum);

/**
 * @swagger
 * /admin/import-export/import:
 *   post:
 *     tags: [Admin - Import/Export]
 *     summary: Import curriculum from JSON
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - curriculum
 *             properties:
 *               curriculum:
 *                 type: object
 *                 properties:
 *                   sections:
 *                     type: array
 *                     items:
 *                       type: object
 *     responses:
 *       200:
 *         description: Curriculum imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid curriculum payload
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
router.post("/import", importCurriculum);

export default router;

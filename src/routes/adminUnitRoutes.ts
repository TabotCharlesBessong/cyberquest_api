import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  createUnit,
  updateUnit,
  deleteUnit,
  getUnitsBySection,
} from "../controllers/adminCurriculumController";

const router = Router();

router.use(authMiddleware, adminOnly);

/**
 * @swagger
 * /admin/units/sections/{sectionId}/units:
 *   get:
 *     tags: [Admin - Units]
 *     summary: Get units for a section with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
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
 *         description: Paginated list of units
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
 *                     units:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Unit'
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
router.get("/sections/:sectionId/units", getUnitsBySection);

/**
 * @swagger
 * /admin/units:
 *   post:
 *     tags: [Admin - Units]
 *     summary: Create a new unit
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
 *               - title
 *               - sectionId
 *             properties:
 *               slug:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               order:
 *                 type: integer
 *               ageGroup:
 *                 type: string
 *                 enum: [A, B]
 *               sectionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Unit created
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
 *                     unit:
 *                       $ref: '#/components/schemas/Unit'
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
router.post("/units", createUnit);

/**
 * @swagger
 * /admin/units/{id}:
 *   put:
 *     tags: [Admin - Units]
 *     summary: Update a unit
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               icon:
 *                 type: string
 *               order:
 *                 type: integer
 *               ageGroup:
 *                 type: string
 *                 enum: [A, B]
 *               sectionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Unit updated
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
 *                     unit:
 *                       $ref: '#/components/schemas/Unit'
 *       404:
 *         description: Unit not found
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
router.put("/units/:id", updateUnit);

/**
 * @swagger
 * /admin/units/{id}:
 *   delete:
 *     tags: [Admin - Units]
 *     summary: Delete a unit
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
 *         description: Unit deleted
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
 *                     unit:
 *                       $ref: '#/components/schemas/Unit'
 *       404:
 *         description: Unit not found
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
router.delete("/units/:id", deleteUnit);

export default router;

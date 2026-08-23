import { Router } from "express";
import { getShopItems, purchaseItem, getInventory, equipItem, unequipItem } from "../controllers/shopController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /shop/items:
 *   get:
 *     tags: [Shop]
 *     summary: Get all active shop items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active shop items
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ShopItem'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/items", getShopItems);

/**
 * @swagger
 * /shop/purchase:
 *   post:
 *     tags: [Shop]
 *     summary: Purchase a shop item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemId
 *             properties:
 *               itemId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the item to purchase
 *     responses:
 *       200:
 *         description: Item purchased successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PurchaseResult'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Item not found or out of stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Insufficient currency
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/purchase", purchaseItem);

/**
 * @swagger
 * /shop/inventory:
 *   get:
 *     tags: [Shop]
 *     summary: Get current user's inventory
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User inventory list
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
 *                     inventory:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/InventoryItem'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/inventory", getInventory);

/**
 * @swagger
 * /shop/equip/{itemId}:
 *   post:
 *     tags: [Shop]
 *     summary: Equip an item from inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the item to equip
 *     responses:
 *       200:
 *         description: Item equipped successfully
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
 *                     success:
 *                       type: boolean
 *                     equipped:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Item not found in inventory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/equip/:itemId", equipItem);

/**
 * @swagger
 * /shop/unequip/{itemId}:
 *   post:
 *     tags: [Shop]
 *     summary: Unequip an item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the item to unequip
 *     responses:
 *       200:
 *         description: Item unequipped successfully
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
 *                     success:
 *                       type: boolean
 *                     unequipped:
 *                       type: string
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Item not found in inventory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/unequip/:itemId", unequipItem);

export default router;

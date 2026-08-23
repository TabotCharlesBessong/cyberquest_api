"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unequipItem = exports.equipItem = exports.getInventory = exports.purchaseItem = exports.getShopItems = void 0;
const shopService_1 = require("../services/shopService");
const asyncHandler_1 = require("../middleware/asyncHandler");
exports.getShopItems = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const items = await shopService_1.ShopService.getShopItems();
    res.status(200).json({ success: true, data: { items } });
});
exports.purchaseItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { itemId } = req.body;
    const result = await shopService_1.ShopService.purchaseItem(req.user.id, itemId);
    res.status(200).json({ success: true, data: result });
});
exports.getInventory = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const inventory = await shopService_1.ShopService.getUserInventory(req.user.id);
    res.status(200).json({ success: true, data: { inventory } });
});
exports.equipItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { itemId } = req.params;
    const result = await shopService_1.ShopService.equipItem(req.user.id, itemId);
    res.status(200).json({ success: true, data: result });
});
exports.unequipItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { itemId } = req.params;
    const result = await shopService_1.ShopService.unequipItem(req.user.id, itemId);
    res.status(200).json({ success: true, data: result });
});
//# sourceMappingURL=shopController.js.map
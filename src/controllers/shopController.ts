import { Response } from "express";
import { ShopService } from "../services/shopService";
import { asyncHandler } from "../middleware/asyncHandler";

export const getShopItems = asyncHandler(async (_req: any, res: Response) => {
  const items = await ShopService.getShopItems();
  res.status(200).json({ success: true, data: { items } });
});

export const purchaseItem = asyncHandler(async (req: any, res: Response) => {
  const { itemId } = req.body;
  const result = await ShopService.purchaseItem(req.user.id, itemId);
  res.status(200).json({ success: true, data: result });
});

export const getInventory = asyncHandler(async (req: any, res: Response) => {
  const inventory = await ShopService.getUserInventory(req.user.id);
  res.status(200).json({ success: true, data: { inventory } });
});

export const equipItem = asyncHandler(async (req: any, res: Response) => {
  const { itemId } = req.params;
  const result = await ShopService.equipItem(req.user.id, itemId);
  res.status(200).json({ success: true, data: result });
});

export const unequipItem = asyncHandler(async (req: any, res: Response) => {
  const { itemId } = req.params;
  const result = await ShopService.unequipItem(req.user.id, itemId);
  res.status(200).json({ success: true, data: result });
});

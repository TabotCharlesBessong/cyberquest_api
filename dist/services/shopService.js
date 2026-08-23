"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const db_1 = require("../db");
const gamificationService_1 = require("./gamificationService");
class ShopService {
    static async getShopItems() {
        const items = await db_1.ShopItem.findAll({
            where: { isActive: true },
            order: [["rarity", "ASC"], ["cost", "ASC"]],
        });
        return items.map((item) => ({
            id: item.id,
            key: item.key,
            name: item.name,
            description: item.description,
            type: item.type,
            cost: item.cost,
            costType: item.costType,
            effect: item.effect,
            icon: item.icon,
            rarity: item.rarity,
            stock: item.stock,
        }));
    }
    static async purchaseItem(userId, itemId) {
        const user = await db_1.User.findByPk(userId);
        const item = await db_1.ShopItem.findByPk(itemId);
        if (!user || !item) {
            throw new Error("User or item not found");
        }
        if (!item.isActive) {
            throw new Error("Item not available");
        }
        if (item.stock !== null && item.stock <= 0) {
            throw new Error("Item out of stock");
        }
        const currency = item.costType === "gems" ? user.gems : user.xp;
        if (currency < item.cost) {
            throw new Error(`Insufficient ${item.costType}`);
        }
        const existing = await db_1.UserInventory.findOne({
            where: { userId, shopItemId: itemId },
        });
        if (existing) {
            existing.quantity += 1;
            await existing.save();
        }
        else {
            await db_1.UserInventory.create({
                userId,
                shopItemId: itemId,
                quantity: 1,
            });
        }
        if (item.costType === "gems") {
            await gamificationService_1.GamificationService.spendGems(userId, item.cost);
        }
        else {
            user.xp -= item.cost;
            await user.save();
        }
        if (item.stock !== null) {
            item.stock -= 1;
            await item.save();
        }
        return {
            success: true,
            item: {
                id: item.id,
                key: item.key,
                name: item.name,
                icon: item.icon,
                type: item.type,
            },
            remainingCurrency: item.costType === "gems" ? user.gems : user.xp,
        };
    }
    static async getUserInventory(userId) {
        const inventory = await db_1.UserInventory.findAll({
            where: { userId },
            include: [
                {
                    model: db_1.ShopItem,
                    as: "shopItem",
                },
            ],
            order: [["purchasedAt", "DESC"]],
        });
        return inventory.map((inv) => ({
            id: inv.shopItemId,
            key: inv.shopItem?.key,
            name: inv.shopItem?.name,
            description: inv.shopItem?.description,
            icon: inv.shopItem?.icon,
            type: inv.shopItem?.type,
            rarity: inv.shopItem?.rarity,
            quantity: inv.quantity,
            equipped: inv.equipped,
            purchasedAt: inv.purchasedAt,
        }));
    }
    static async equipItem(userId, itemId) {
        const user = await db_1.User.findByPk(userId);
        const inventory = await db_1.UserInventory.findOne({
            where: { userId, shopItemId: itemId },
        });
        if (!user || !inventory) {
            throw new Error("Item not found in inventory");
        }
        await db_1.UserInventory.update({ equipped: false }, { where: { userId } });
        inventory.equipped = true;
        await inventory.save();
        const item = await db_1.ShopItem.findByPk(itemId);
        if (item && item.type === "avatar" && item.effect) {
            user.avatar = item.effect;
            await user.save();
        }
        return { success: true, equipped: itemId };
    }
    static async unequipItem(userId, itemId) {
        const inventory = await db_1.UserInventory.findOne({
            where: { userId, shopItemId: itemId },
        });
        if (!inventory) {
            throw new Error("Item not found in inventory");
        }
        inventory.equipped = false;
        await inventory.save();
        const user = await db_1.User.findByPk(userId);
        if (user) {
            user.avatar = null;
            await user.save();
        }
        return { success: true, unequipped: itemId };
    }
}
exports.ShopService = ShopService;
//# sourceMappingURL=shopService.js.map
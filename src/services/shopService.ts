import { User, ShopItem, UserInventory } from "../db";
import { GamificationService } from "./gamificationService";

export class ShopService {
  static async getShopItems() {
    const items = await ShopItem.findAll({
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

  static async purchaseItem(userId: string, itemId: string) {
    const user = await User.findByPk(userId);
    const item = await ShopItem.findByPk(itemId);

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

    const existing = await UserInventory.findOne({
      where: { userId, shopItemId: itemId },
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
    } else {
      await UserInventory.create({
        userId,
        shopItemId: itemId,
        quantity: 1,
      });
    }

    if (item.costType === "gems") {
      await GamificationService.spendGems(userId, item.cost);
    } else {
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
      remainingCurrency:
        item.costType === "gems" ? user.gems : user.xp,
    };
  }

  static async getUserInventory(userId: string) {
    const inventory = await UserInventory.findAll({
      where: { userId },
      include: [
        {
          model: ShopItem,
          as: "shopItem",
        },
      ],
      order: [["purchasedAt", "DESC"]],
    });

    return inventory.map((inv: any) => ({
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

  static async equipItem(userId: string, itemId: string) {
    const user = await User.findByPk(userId);
    const inventory = await UserInventory.findOne({
      where: { userId, shopItemId: itemId },
    });

    if (!user || !inventory) {
      throw new Error("Item not found in inventory");
    }

    await UserInventory.update(
      { equipped: false },
      { where: { userId } }
    );

    inventory.equipped = true;
    await inventory.save();

    const item = await ShopItem.findByPk(itemId);
    if (item && item.type === "avatar" && item.effect) {
      user.avatar = item.effect as string;
      await user.save();
    }

    return { success: true, equipped: itemId };
  }

  static async unequipItem(userId: string, itemId: string) {
    const inventory = await UserInventory.findOne({
      where: { userId, shopItemId: itemId },
    });

    if (!inventory) {
      throw new Error("Item not found in inventory");
    }

    inventory.equipped = false;
    await inventory.save();

    const user = await User.findByPk(userId);
    if (user) {
      user.avatar = null;
      await user.save();
    }

    return { success: true, unequipped: itemId };
  }
}

import { ShopService } from "../services/shopService";

jest.mock("../services/gamificationService", () => ({
  GamificationService: {
    addXp: jest.fn(),
    addGems: jest.fn(),
    spendGems: jest.fn(),
    recordDailyActivity: jest.fn(),
    updateStreak: jest.fn(),
    consumeHeart: jest.fn(),
    replenishHearts: jest.fn(),
    calculateLevel: jest.fn(),
    xpForNextLevel: jest.fn(),
    xpIntoLevel: jest.fn(),
  },
}));

import { GamificationService } from "../services/gamificationService";

jest.mock("../db", () => ({
  User: { findByPk: jest.fn() },
  ShopItem: { findAll: jest.fn(), findByPk: jest.fn() },
  UserInventory: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
}));

import { User, ShopItem, UserInventory } from "../db";

describe("ShopService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getShopItems", () => {
    it("returns active shop items sorted by rarity and cost", async () => {
      jest.mocked(ShopItem.findAll).mockResolvedValue([
        { id: "item-1", key: "hero_cape", name: "Hero Cape", description: "A cape", type: "avatar", cost: 50, costType: "gems", effect: "🦸", icon: "🦸", rarity: "rare", stock: 10, isActive: true },
        { id: "item-2", key: "wizard_hat", name: "Wizard Hat", description: "A hat", type: "avatar", cost: 75, costType: "gems", effect: "🧙", icon: "🧙", rarity: "epic", stock: 5, isActive: true },
      ] as any);

      const result = await ShopService.getShopItems();
      expect(result).toHaveLength(2);
      expect(result[0].key).toBe("hero_cape");
      expect(result[1].key).toBe("wizard_hat");
    });
  });

  describe("purchaseItem", () => {
    it("purchases item with gems and creates inventory entry", async () => {
      jest.mocked(User.findByPk).mockResolvedValue({ id: "user-1", gems: 100, save: jest.fn() } as any);
      jest.mocked(ShopItem.findByPk).mockResolvedValue({ id: "item-1", key: "hero_cape", cost: 50, costType: "gems", stock: 10, isActive: true, save: jest.fn() } as any);
      jest.mocked(UserInventory.findOne).mockResolvedValue(null as any);
      jest.mocked(UserInventory.create).mockResolvedValue({} as any);
      jest.mocked(GamificationService.spendGems).mockResolvedValue(true);

      const result = await ShopService.purchaseItem("user-1", "item-1");
      expect(result.success).toBe(true);
      expect(result.item.key).toBe("hero_cape");
    });

    it("throws for insufficient gems", async () => {
      jest.mocked(User.findByPk).mockResolvedValue({ id: "user-1", gems: 10 } as any);
      jest.mocked(ShopItem.findByPk).mockResolvedValue({ id: "item-1", cost: 50, costType: "gems", isActive: true } as any);

      await expect(ShopService.purchaseItem("user-1", "item-1")).rejects.toThrow("Insufficient gems");
    });
  });

  describe("getUserInventory", () => {
    it("returns user inventory with shop item details", async () => {
      jest.mocked(UserInventory.findAll).mockResolvedValue([
        { shopItemId: "item-1", quantity: 1, equipped: false, purchasedAt: new Date(), shopItem: { key: "hero_cape", name: "Hero Cape", description: "A cape", icon: "🦸", type: "avatar", rarity: "rare" } },
      ] as any);

      const result = await ShopService.getUserInventory("user-1");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Hero Cape");
      expect(result[0].equipped).toBe(false);
    });
  });

  describe("equipItem", () => {
    it("equips item and updates user avatar", async () => {
      jest.mocked(User.findByPk).mockResolvedValue({ id: "user-1", avatar: null, save: jest.fn() } as any);
      jest.mocked(UserInventory.findOne).mockResolvedValue({ userId: "user-1", shopItemId: "item-1", equipped: false, save: jest.fn() } as any);
      jest.mocked(UserInventory.update).mockResolvedValue([1] as any);
      jest.mocked(ShopItem.findByPk).mockResolvedValue({ type: "avatar", effect: "🦸" } as any);

      const result = await ShopService.equipItem("user-1", "item-1");
      expect(result.success).toBe(true);
    });
  });
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shopService_1 = require("../services/shopService");
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
const gamificationService_1 = require("../services/gamificationService");
jest.mock("../db", () => ({
    User: { findByPk: jest.fn() },
    ShopItem: { findAll: jest.fn(), findByPk: jest.fn() },
    UserInventory: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
}));
const db_1 = require("../db");
describe("ShopService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("getShopItems", () => {
        it("returns active shop items sorted by rarity and cost", async () => {
            jest.mocked(db_1.ShopItem.findAll).mockResolvedValue([
                { id: "item-1", key: "hero_cape", name: "Hero Cape", description: "A cape", type: "avatar", cost: 50, costType: "gems", effect: "🦸", icon: "🦸", rarity: "rare", stock: 10, isActive: true },
                { id: "item-2", key: "wizard_hat", name: "Wizard Hat", description: "A hat", type: "avatar", cost: 75, costType: "gems", effect: "🧙", icon: "🧙", rarity: "epic", stock: 5, isActive: true },
            ]);
            const result = await shopService_1.ShopService.getShopItems();
            expect(result).toHaveLength(2);
            expect(result[0].key).toBe("hero_cape");
            expect(result[1].key).toBe("wizard_hat");
        });
    });
    describe("purchaseItem", () => {
        it("purchases item with gems and creates inventory entry", async () => {
            jest.mocked(db_1.User.findByPk).mockResolvedValue({ id: "user-1", gems: 100, save: jest.fn() });
            jest.mocked(db_1.ShopItem.findByPk).mockResolvedValue({ id: "item-1", key: "hero_cape", cost: 50, costType: "gems", stock: 10, isActive: true, save: jest.fn() });
            jest.mocked(db_1.UserInventory.findOne).mockResolvedValue(null);
            jest.mocked(db_1.UserInventory.create).mockResolvedValue({});
            jest.mocked(gamificationService_1.GamificationService.spendGems).mockResolvedValue(true);
            const result = await shopService_1.ShopService.purchaseItem("user-1", "item-1");
            expect(result.success).toBe(true);
            expect(result.item.key).toBe("hero_cape");
        });
        it("throws for insufficient gems", async () => {
            jest.mocked(db_1.User.findByPk).mockResolvedValue({ id: "user-1", gems: 10 });
            jest.mocked(db_1.ShopItem.findByPk).mockResolvedValue({ id: "item-1", cost: 50, costType: "gems", isActive: true });
            await expect(shopService_1.ShopService.purchaseItem("user-1", "item-1")).rejects.toThrow("Insufficient gems");
        });
    });
    describe("getUserInventory", () => {
        it("returns user inventory with shop item details", async () => {
            jest.mocked(db_1.UserInventory.findAll).mockResolvedValue([
                { shopItemId: "item-1", quantity: 1, equipped: false, purchasedAt: new Date(), shopItem: { key: "hero_cape", name: "Hero Cape", description: "A cape", icon: "🦸", type: "avatar", rarity: "rare" } },
            ]);
            const result = await shopService_1.ShopService.getUserInventory("user-1");
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe("Hero Cape");
            expect(result[0].equipped).toBe(false);
        });
    });
    describe("equipItem", () => {
        it("equips item and updates user avatar", async () => {
            jest.mocked(db_1.User.findByPk).mockResolvedValue({ id: "user-1", avatar: null, save: jest.fn() });
            jest.mocked(db_1.UserInventory.findOne).mockResolvedValue({ userId: "user-1", shopItemId: "item-1", equipped: false, save: jest.fn() });
            jest.mocked(db_1.UserInventory.update).mockResolvedValue([1]);
            jest.mocked(db_1.ShopItem.findByPk).mockResolvedValue({ type: "avatar", effect: "🦸" });
            const result = await shopService_1.ShopService.equipItem("user-1", "item-1");
            expect(result.success).toBe(true);
        });
    });
});
//# sourceMappingURL=shopService.test.js.map
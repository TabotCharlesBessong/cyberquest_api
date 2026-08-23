"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopItem = void 0;
exports.initShopItem = initShopItem;
const sequelize_1 = require("sequelize");
class ShopItem extends sequelize_1.Model {
}
exports.ShopItem = ShopItem;
function initShopItem(sequelize) {
    ShopItem.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        key: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM("avatar", "powerup", "consumable"),
            allowNull: false,
        },
        cost: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        costType: {
            type: sequelize_1.DataTypes.ENUM("gems", "xp"),
            allowNull: false,
            defaultValue: "gems",
        },
        effect: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        icon: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        rarity: {
            type: sequelize_1.DataTypes.ENUM("common", "rare", "epic", "legendary"),
            allowNull: false,
            defaultValue: "common",
        },
        stock: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "shop_items",
    });
}
//# sourceMappingURL=ShopItem.js.map
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
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: "type",
        },
        cost: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        costType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "gems",
            field: "cost_type",
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
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "common",
            field: "rarity",
        },
        stock: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "is_active",
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: "created_at",
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: "updated_at",
        },
    }, {
        sequelize,
        tableName: "shop_items",
    });
}
//# sourceMappingURL=ShopItem.js.map
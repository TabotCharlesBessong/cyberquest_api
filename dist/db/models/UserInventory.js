"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInventory = void 0;
exports.initUserInventory = initUserInventory;
exports.associateUserInventory = associateUserInventory;
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
const ShopItem_1 = require("./ShopItem");
class UserInventory extends sequelize_1.Model {
}
exports.UserInventory = UserInventory;
function initUserInventory(sequelize) {
    UserInventory.init({
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        shopItemId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        quantity: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        purchasedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        equipped: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: "user_inventory",
    });
}
// Associations
function associateUserInventory() {
    UserInventory.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
    UserInventory.belongsTo(ShopItem_1.ShopItem, { foreignKey: "shopItemId", as: "shopItem" });
    User_1.User.hasMany(UserInventory, { foreignKey: "userId", as: "inventory" });
    ShopItem_1.ShopItem.hasMany(UserInventory, { foreignKey: "shopItemId", as: "inventory" });
}
//# sourceMappingURL=UserInventory.js.map
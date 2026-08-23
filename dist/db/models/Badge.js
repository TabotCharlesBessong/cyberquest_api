"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
exports.initBadge = initBadge;
const sequelize_1 = require("sequelize");
class Badge extends sequelize_1.Model {
}
exports.Badge = Badge;
function initBadge(sequelize) {
    Badge.init({
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
        icon: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        rarity: {
            type: sequelize_1.DataTypes.ENUM("common", "rare", "epic", "legendary"),
            allowNull: false,
            defaultValue: "common",
        },
        criteria: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        xpReward: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        gemsReward: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
        tableName: "badges",
    });
}
//# sourceMappingURL=Badge.js.map
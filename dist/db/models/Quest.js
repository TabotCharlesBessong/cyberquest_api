"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quest = void 0;
exports.initQuest = initQuest;
const sequelize_1 = require("sequelize");
class Quest extends sequelize_1.Model {
}
exports.Quest = Quest;
function initQuest(sequelize) {
    Quest.init({
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
        type: {
            type: sequelize_1.DataTypes.ENUM("daily", "weekly", "special"),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        target: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
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
        tableName: "quests",
    });
}
//# sourceMappingURL=Quest.js.map
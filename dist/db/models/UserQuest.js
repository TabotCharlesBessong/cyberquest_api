"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuest = void 0;
exports.initUserQuest = initUserQuest;
exports.associateUserQuest = associateUserQuest;
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
const Quest_1 = require("./Quest");
class UserQuest extends sequelize_1.Model {
}
exports.UserQuest = UserQuest;
function initUserQuest(sequelize) {
    UserQuest.init({
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            field: "user_id",
        },
        questId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            field: "quest_id",
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "active",
            field: "status",
        },
        progress: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        claimedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: "claimed_at",
        },
        expiresAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: "expires_at",
        },
    }, {
        sequelize,
        tableName: "user_quests",
    });
}
// Associations
function associateUserQuest() {
    UserQuest.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
    UserQuest.belongsTo(Quest_1.Quest, { foreignKey: "questId", as: "quest" });
    User_1.User.hasMany(UserQuest, { foreignKey: "userId", as: "userQuests" });
    Quest_1.Quest.hasMany(UserQuest, { foreignKey: "questId", as: "userQuests" });
}
//# sourceMappingURL=UserQuest.js.map
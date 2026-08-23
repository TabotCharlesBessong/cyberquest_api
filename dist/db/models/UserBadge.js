"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBadge = void 0;
exports.initUserBadge = initUserBadge;
exports.associateUserBadge = associateUserBadge;
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
const Badge_1 = require("./Badge");
class UserBadge extends sequelize_1.Model {
}
exports.UserBadge = UserBadge;
function initUserBadge(sequelize) {
    UserBadge.init({
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        badgeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        earnedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        progress: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
        },
    }, {
        sequelize,
        tableName: "user_badges",
    });
}
// Associations
function associateUserBadge() {
    UserBadge.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
    UserBadge.belongsTo(Badge_1.Badge, { foreignKey: "badgeId", as: "badge" });
    User_1.User.hasMany(UserBadge, { foreignKey: "userId", as: "userBadges" });
    Badge_1.Badge.hasMany(UserBadge, { foreignKey: "badgeId", as: "userBadges" });
}
//# sourceMappingURL=UserBadge.js.map
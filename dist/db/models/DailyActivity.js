"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyActivity = void 0;
exports.initDailyActivity = initDailyActivity;
exports.associateDailyActivity = associateDailyActivity;
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
class DailyActivity extends sequelize_1.Model {
}
exports.DailyActivity = DailyActivity;
function initDailyActivity(sequelize) {
    DailyActivity.init({
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            field: "user_id",
        },
        date: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        xpEarned: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "xp_earned",
        },
        lessonsCompleted: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "lessons_completed",
        },
        quizzesPassed: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "quizzes_passed",
        },
        lastActionAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: "last_action_at",
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: "created_at",
        },
    }, {
        sequelize,
        tableName: "daily_activities",
    });
}
// Associations
function associateDailyActivity() {
    DailyActivity.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
    User_1.User.hasMany(DailyActivity, { foreignKey: "userId", as: "dailyActivities" });
}
//# sourceMappingURL=DailyActivity.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentalControl = void 0;
exports.initParentalControl = initParentalControl;
exports.associateParentalControl = associateParentalControl;
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
class ParentalControl extends sequelize_1.Model {
}
exports.ParentalControl = ParentalControl;
function initParentalControl(sequelize) {
    ParentalControl.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
            field: "user_id",
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: "users", key: "id" },
            onDelete: "SET NULL",
            field: "parent_id",
        },
        dailyScreenTimeLimit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 60,
            field: "daily_screen_time_limit",
        },
        allowedHoursStart: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: "08:00",
            field: "allowed_hours_start",
        },
        allowedHoursEnd: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: "20:00",
            field: "allowed_hours_end",
        },
        blockedDays: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
            field: "blocked_days",
        },
        requireApprovalForLessons: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: "require_approval_for_lessons",
        },
        maxDailyLessons: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 10,
            field: "max_daily_lessons",
        },
        allowChat: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "allow_chat",
        },
        allowSocialFeatures: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: "allow_social_features",
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
        tableName: "parental_controls",
    });
}
function associateParentalControl() {
    ParentalControl.belongsTo(User_1.User, { foreignKey: "userId", as: "child" });
    ParentalControl.belongsTo(User_1.User, { foreignKey: "parentId", as: "parent" });
    User_1.User.hasMany(ParentalControl, { foreignKey: "userId", as: "parentalControls" });
    User_1.User.hasMany(ParentalControl, { foreignKey: "parentId", as: "managedChildren" });
}
//# sourceMappingURL=ParentalControl.js.map
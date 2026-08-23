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
        },
        parentId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: "users", key: "id" },
            onDelete: "SET NULL",
        },
        dailyScreenTimeLimit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 60,
        },
        allowedHoursStart: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: "08:00",
        },
        allowedHoursEnd: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            defaultValue: "20:00",
        },
        blockedDays: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: [],
        },
        requireApprovalForLessons: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        maxDailyLessons: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 10,
        },
        allowChat: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        allowSocialFeatures: {
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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleProgress = void 0;
exports.initModuleProgress = initModuleProgress;
const sequelize_1 = require("sequelize");
class ModuleProgress extends sequelize_1.Model {
}
exports.ModuleProgress = ModuleProgress;
function initModuleProgress(sequelize) {
    ModuleProgress.init({
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
        lectureId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: "lectures", key: "id" },
            onDelete: "CASCADE",
            field: "lecture_id",
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "not_started",
            field: "status",
        },
        score: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        stars: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        xpEarned: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "xp_earned",
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: "completed_at",
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
        tableName: "module_progress",
    });
}
//# sourceMappingURL=ModuleProgress.js.map
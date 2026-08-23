"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonProgress = void 0;
exports.initLessonProgress = initLessonProgress;
const sequelize_1 = require("sequelize");
class LessonProgress extends sequelize_1.Model {
}
exports.LessonProgress = LessonProgress;
function initLessonProgress(sequelize) {
    LessonProgress.init({
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
        lessonId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: "lessons", key: "id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        attempts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        correct: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        bestScore: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        completed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        lastResult: {
            type: sequelize_1.DataTypes.ENUM("pass", "fail"),
            allowNull: true,
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
        tableName: "lesson_progress",
    });
}
//# sourceMappingURL=LessonProgress.js.map
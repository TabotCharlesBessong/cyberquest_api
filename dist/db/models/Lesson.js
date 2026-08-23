"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
exports.initLesson = initLesson;
const sequelize_1 = require("sequelize");
class Lesson extends sequelize_1.Model {
}
exports.Lesson = Lesson;
function initLesson(sequelize) {
    Lesson.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        lectureId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: "lectures", key: "id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        unitId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            references: { model: "units", key: "id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        stepId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.ENUM("story", "quiz", "mini-game", "challenge"),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        question: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        answer: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        explanation: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        icon: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        mascot: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        speech: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        missionBriefing: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ageGroup: {
            type: sequelize_1.DataTypes.ENUM("A", "B", "ALL"),
            allowNull: false,
            defaultValue: "B",
        },
        difficulty: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 1, max: 5 },
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
        tableName: "lessons",
    });
}
//# sourceMappingURL=Lesson.js.map
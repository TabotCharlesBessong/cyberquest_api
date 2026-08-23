"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
exports.initQuestion = initQuestion;
const sequelize_1 = require("sequelize");
class Question extends sequelize_1.Model {
}
exports.Question = Question;
function initQuestion(sequelize) {
    Question.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        lessonId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: "lessons", key: "id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        question: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        options: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
        },
        correctIndex: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "mcq",
        },
        pairs: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        sentenceParts: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        correctSentence: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        investigationSteps: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        correctOrder: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        explanation: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        difficulty: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 5 },
        },
        xpReward: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
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
        tableName: "questions",
    });
}
//# sourceMappingURL=Question.js.map
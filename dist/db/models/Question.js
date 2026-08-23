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
            field: "lesson_id",
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
            field: "correct_index",
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
            field: "sentence_parts",
        },
        correctSentence: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            field: "correct_sentence",
        },
        investigationSteps: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: "investigation_steps",
        },
        correctOrder: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            field: "correct_order",
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
            field: "xp_reward",
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
        tableName: "questions",
    });
}
//# sourceMappingURL=Question.js.map
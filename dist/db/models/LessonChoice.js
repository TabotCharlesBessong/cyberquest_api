"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonChoice = void 0;
exports.initLessonChoice = initLessonChoice;
const sequelize_1 = require("sequelize");
class LessonChoice extends sequelize_1.Model {
}
exports.LessonChoice = LessonChoice;
function initLessonChoice(sequelize) {
    LessonChoice.init({
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
        position: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        feedback: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        consequence: {
            type: sequelize_1.DataTypes.ENUM("positive", "negative", "neutral"),
            allowNull: false,
        },
        xpDelta: {
            type: sequelize_1.DataTypes.INTEGER,
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
        tableName: "lesson_choices",
    });
}
//# sourceMappingURL=LessonChoice.js.map
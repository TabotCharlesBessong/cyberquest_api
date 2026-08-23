"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonOption = void 0;
exports.initLessonOption = initLessonOption;
const sequelize_1 = require("sequelize");
class LessonOption extends sequelize_1.Model {
}
exports.LessonOption = LessonOption;
function initLessonOption(sequelize) {
    LessonOption.init({
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
        position: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        text: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
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
        tableName: "lesson_options",
    });
}
//# sourceMappingURL=LessonOption.js.map
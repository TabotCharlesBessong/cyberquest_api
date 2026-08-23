"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonStandard = void 0;
exports.initLessonStandard = initLessonStandard;
const sequelize_1 = require("sequelize");
class LessonStandard extends sequelize_1.Model {
}
exports.LessonStandard = LessonStandard;
function initLessonStandard(sequelize) {
    LessonStandard.init({
        lessonId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: { model: "lessons", key: "id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        standardId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: { model: "standards", key: "id" },
            onDelete: "CASCADE",
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "lesson_standards",
        timestamps: true,
        updatedAt: false,
    });
}
//# sourceMappingURL=LessonStandard.js.map
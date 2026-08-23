"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonConcept = void 0;
exports.initLessonConcept = initLessonConcept;
const sequelize_1 = require("sequelize");
class LessonConcept extends sequelize_1.Model {
}
exports.LessonConcept = LessonConcept;
function initLessonConcept(sequelize) {
    LessonConcept.init({
        lessonId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: { model: "lessons", key: "id" },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            field: "lesson_id",
        },
        conceptId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: { model: "concepts", key: "id" },
            onDelete: "CASCADE",
            field: "concept_id",
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            field: "created_at",
        },
    }, {
        sequelize,
        tableName: "lesson_concepts",
        timestamps: true,
        updatedAt: false,
    });
}
//# sourceMappingURL=LessonConcept.js.map
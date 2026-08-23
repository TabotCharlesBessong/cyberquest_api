"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomRound = void 0;
exports.initClassroomRound = initClassroomRound;
exports.associateClassroomRound = associateClassroomRound;
const sequelize_1 = require("sequelize");
class ClassroomRound extends sequelize_1.Model {
}
exports.ClassroomRound = ClassroomRound;
function initClassroomRound(sequelize) {
    ClassroomRound.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        classroomId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            field: "classroom_id",
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "waiting",
            field: "status",
        },
        currentQuestionIndex: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: "current_question_index",
        },
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: "started_at",
        },
        finishedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            field: "finished_at",
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: "created_at",
        },
    }, {
        sequelize,
        tableName: "classroom_rounds",
    });
}
function associateClassroomRound() {
    // associations defined in db/index.ts after all models are imported
}
//# sourceMappingURL=ClassroomRound.js.map
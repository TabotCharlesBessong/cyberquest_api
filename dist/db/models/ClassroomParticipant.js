"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomParticipant = void 0;
exports.initClassroomParticipant = initClassroomParticipant;
exports.associateClassroomParticipant = associateClassroomParticipant;
const sequelize_1 = require("sequelize");
class ClassroomParticipant extends sequelize_1.Model {
}
exports.ClassroomParticipant = ClassroomParticipant;
function initClassroomParticipant(sequelize) {
    ClassroomParticipant.init({
        roundId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        score: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        joinedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: "classroom_participants",
    });
}
function associateClassroomParticipant() {
    // associations defined in db/index.ts after all models are imported
}
//# sourceMappingURL=ClassroomParticipant.js.map
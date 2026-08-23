"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classroom = void 0;
exports.initClassroom = initClassroom;
exports.associateClassroom = associateClassroom;
const sequelize_1 = require("sequelize");
class Classroom extends sequelize_1.Model {
}
exports.Classroom = Classroom;
function initClassroom(sequelize) {
    Classroom.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        school: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        teacherId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            field: "teacher_id",
        },
        memberIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
            allowNull: false,
            defaultValue: [],
            field: "member_ids",
        },
        code: {
            type: sequelize_1.DataTypes.STRING(8),
            allowNull: false,
            unique: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            field: "created_at",
        },
    }, {
        sequelize,
        tableName: "classrooms",
        indexes: [{ fields: ["code"], unique: true }],
    });
}
function associateClassroom() {
    // associations defined in db/index.ts after all models are imported
}
//# sourceMappingURL=Classroom.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecture = void 0;
exports.initLecture = initLecture;
const sequelize_1 = require("sequelize");
class Lecture extends sequelize_1.Model {
}
exports.Lecture = Lecture;
function initLecture(sequelize) {
    Lecture.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        slug: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        subtitle: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        icon: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "📘",
        },
        color: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "#4D96FF",
        },
        badge: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "⭐",
        },
        badgeName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ageGroup: {
            type: sequelize_1.DataTypes.ENUM("A", "B"),
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
        tableName: "lectures",
    });
}
//# sourceMappingURL=Lecture.js.map
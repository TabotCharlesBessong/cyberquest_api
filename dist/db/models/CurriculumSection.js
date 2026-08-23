"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculumSection = void 0;
exports.initCurriculumSection = initCurriculumSection;
const sequelize_1 = require("sequelize");
class CurriculumSection extends sequelize_1.Model {
}
exports.CurriculumSection = CurriculumSection;
function initCurriculumSection(sequelize) {
    CurriculumSection.init({
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
        description: {
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
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ageGroup: {
            type: sequelize_1.DataTypes.ENUM("A", "B"),
            allowNull: false,
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
        tableName: "curriculum_sections",
    });
}
//# sourceMappingURL=CurriculumSection.js.map
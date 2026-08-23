"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = void 0;
exports.initUnit = initUnit;
const sequelize_1 = require("sequelize");
class Unit extends sequelize_1.Model {
}
exports.Unit = Unit;
function initUnit(sequelize) {
    Unit.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        sectionId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: { model: "lectures", key: "id" },
            onDelete: "CASCADE",
            field: "section_id",
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
            defaultValue: "📚",
        },
        order: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ageGroup: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            field: "age_group",
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
        tableName: "units",
    });
}
//# sourceMappingURL=Unit.js.map
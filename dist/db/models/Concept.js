"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concept = void 0;
exports.initConcept = initConcept;
const sequelize_1 = require("sequelize");
class Concept extends sequelize_1.Model {
}
exports.Concept = Concept;
function initConcept(sequelize) {
    Concept.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        code: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
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
        tableName: "concepts",
    });
}
//# sourceMappingURL=Concept.js.map
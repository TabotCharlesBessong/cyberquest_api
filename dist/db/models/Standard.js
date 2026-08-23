"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Standard = void 0;
exports.initStandard = initStandard;
const sequelize_1 = require("sequelize");
class Standard extends sequelize_1.Model {
}
exports.Standard = Standard;
function initStandard(sequelize) {
    Standard.init({
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
        tableName: "standards",
    });
}
//# sourceMappingURL=Standard.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.League = void 0;
exports.initLeague = initLeague;
exports.associateLeague = associateLeague;
const sequelize_1 = require("sequelize");
class League extends sequelize_1.Model {
}
exports.League = League;
function initLeague(sequelize) {
    League.init({
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
        tier: {
            type: sequelize_1.DataTypes.ENUM("bronze", "silver", "gold", "diamond"),
            allowNull: false,
        },
        seasonId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        startsAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        endsAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: "leagues",
        indexes: [{ fields: ["seasonId", "tier"] }],
    });
}
function associateLeague() {
    // associations defined in db/index.ts after both models are imported
}
//# sourceMappingURL=League.js.map
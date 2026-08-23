"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueMembership = void 0;
exports.initLeagueMembership = initLeagueMembership;
exports.associateLeagueMembership = associateLeagueMembership;
const sequelize_1 = require("sequelize");
class LeagueMembership extends sequelize_1.Model {
}
exports.LeagueMembership = LeagueMembership;
function initLeagueMembership(sequelize) {
    LeagueMembership.init({
        leagueId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        xp: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        rank: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        promoted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        demoted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        changeNote: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: "league_memberships",
        indexes: [{ fields: ["leagueId", "xp"] }],
    });
}
function associateLeagueMembership() {
    // associations defined in db/index.ts after all models are imported
}
//# sourceMappingURL=LeagueMembership.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardEntry = void 0;
exports.initLeaderboardEntry = initLeaderboardEntry;
exports.associateLeaderboardEntry = associateLeaderboardEntry;
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
class LeaderboardEntry extends sequelize_1.Model {
}
exports.LeaderboardEntry = LeaderboardEntry;
function initLeaderboardEntry(sequelize) {
    LeaderboardEntry.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        userId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
        },
        scope: {
            type: sequelize_1.DataTypes.ENUM("class", "school", "global"),
            allowNull: false,
        },
        seasonId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        rank: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: "leaderboard_entries",
        indexes: [
            { fields: ["scope", "seasonId", "score"] },
            { fields: ["userId", "scope", "seasonId"] },
        ],
    });
}
function associateLeaderboardEntry() {
    LeaderboardEntry.belongsTo(User_1.User, { foreignKey: "userId", as: "user" });
    User_1.User.hasMany(LeaderboardEntry, { foreignKey: "userId", as: "leaderboardEntries" });
}
//# sourceMappingURL=LeaderboardEntry.js.map
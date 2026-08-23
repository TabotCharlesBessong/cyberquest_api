"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
exports.initEvent = initEvent;
const sequelize_1 = require("sequelize");
class Event extends sequelize_1.Model {
}
exports.Event = Event;
function initEvent(sequelize) {
    Event.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
        },
        key: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        multiplier: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 1.0,
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
        tableName: "events",
    });
}
//# sourceMappingURL=Event.js.map
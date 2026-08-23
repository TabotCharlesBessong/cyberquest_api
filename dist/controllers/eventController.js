"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvents = exports.getActiveEvent = void 0;
const db_1 = require("../db");
const asyncHandler_1 = require("../middleware/asyncHandler");
exports.getActiveEvent = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const now = new Date();
    const event = await db_1.Event.findOne({
        where: {
            startsAt: { [require("sequelize").Op.lte]: now },
            endsAt: { [require("sequelize").Op.gte]: now },
        },
    });
    res.status(200).json({
        success: true,
        data: event || null,
    });
});
exports.listEvents = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const events = await db_1.Event.findAll({
        order: [["startsAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: events });
});
//# sourceMappingURL=eventController.js.map
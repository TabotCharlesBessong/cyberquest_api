"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const db_1 = require("../db");
const logger_1 = __importDefault(require("../utils/logger"));
class EventService {
    static async getActiveMultiplier() {
        const now = new Date();
        const event = await db_1.Event.findOne({
            where: {
                startsAt: { [require("sequelize").Op.lte]: now },
                endsAt: { [require("sequelize").Op.gte]: now },
            },
        });
        if (!event)
            return 1.0;
        logger_1.default.info("Active event applied", { key: event.key, multiplier: event.multiplier });
        return event.multiplier;
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map
import { Event } from "../db";
import logger from "../utils/logger";

export class EventService {
  static async getActiveMultiplier(): Promise<number> {
    const now = new Date();
    const event = await Event.findOne({
      where: {
        startsAt: { [require("sequelize").Op.lte]: now },
        endsAt: { [require("sequelize").Op.gte]: now },
      },
    });

    if (!event) return 1.0;

    logger.info("Active event applied", { key: event.key, multiplier: event.multiplier });
    return event.multiplier;
  }
}

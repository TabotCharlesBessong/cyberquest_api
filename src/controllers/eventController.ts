import { Response } from "express";
import { Event } from "../db";
import { asyncHandler } from "../middleware/asyncHandler";

export const getActiveEvent = asyncHandler(async (_req: any, res: Response) => {
  const now = new Date();
  const event = await Event.findOne({
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

export const listEvents = asyncHandler(async (_req: any, res: Response) => {
  const events = await Event.findAll({
    order: [["startsAt", "DESC"]],
  });
  res.status(200).json({ success: true, data: events });
});

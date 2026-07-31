import { Response } from "express";
import { ParentalControl } from "../db";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";

export const getParentalControls = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const userId = typeof req.params.userId === "string" ? req.params.userId : "";
    const control = await ParentalControl.findOne({
      where: { userId },
      include: [
        { model: require("../db/models/User").default, as: "child", attributes: ["id", "name", "email", "age", "ageGroup"] },
        { model: require("../db/models/User").default, as: "parent", attributes: ["id", "name", "email"] },
      ],
    });

    if (!control) {
      return res.status(200).json({ success: true, data: { control: null } });
    }

    res.status(200).json({ success: true, data: { control } });
  }
);

export const upsertParentalControls = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const userId = typeof req.params.userId === "string" ? req.params.userId : "";
    const payload = req.body;

    const [control] = await ParentalControl.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        parentId: null,
        dailyScreenTimeLimit: payload.dailyScreenTimeLimit ?? 60,
        allowedHoursStart: payload.allowedHoursStart ?? "08:00",
        allowedHoursEnd: payload.allowedHoursEnd ?? "20:00",
        blockedDays: payload.blockedDays ?? [],
        requireApprovalForLessons: payload.requireApprovalForLessons ?? false,
        maxDailyLessons: payload.maxDailyLessons ?? 10,
        allowChat: payload.allowChat ?? true,
        allowSocialFeatures: payload.allowSocialFeatures ?? true,
      },
    });

    await control.update({
      dailyScreenTimeLimit: payload.dailyScreenTimeLimit ?? control.dailyScreenTimeLimit,
      allowedHoursStart: payload.allowedHoursStart ?? control.allowedHoursStart,
      allowedHoursEnd: payload.allowedHoursEnd ?? control.allowedHoursEnd,
      blockedDays: payload.blockedDays ?? control.blockedDays,
      requireApprovalForLessons: payload.requireApprovalForLessons ?? control.requireApprovalForLessons,
      maxDailyLessons: payload.maxDailyLessons ?? control.maxDailyLessons,
      allowChat: payload.allowChat ?? control.allowChat,
      allowSocialFeatures: payload.allowSocialFeatures ?? control.allowSocialFeatures,
    });

    res.status(200).json({ success: true, data: { control } });
  }
);

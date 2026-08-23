"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertParentalControls = exports.getParentalControls = void 0;
const db_1 = require("../db");
const asyncHandler_1 = require("../middleware/asyncHandler");
exports.getParentalControls = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = typeof req.params.userId === "string" ? req.params.userId : "";
    const control = await db_1.ParentalControl.findOne({
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
});
exports.upsertParentalControls = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = typeof req.params.userId === "string" ? req.params.userId : "";
    const payload = req.body;
    const [control] = await db_1.ParentalControl.findOrCreate({
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
});
//# sourceMappingURL=adminParentalController.js.map
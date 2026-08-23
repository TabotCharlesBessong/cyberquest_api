"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProgress = exports.submitLessonProgress = void 0;
const progressService_1 = require("../services/progressService");
const User_1 = require("../db/models/User");
const asyncHandler_1 = require("../middleware/asyncHandler");
const apiError_1 = require("../utils/apiError");
exports.submitLessonProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { lessonId, score, correctCount, total } = req.body;
    const user = await User_1.User.findByPk(req.user.id);
    if (!user)
        throw (0, apiError_1.notFound)("User not found");
    const result = await progressService_1.ProgressService.submitLessonProgress(req.user.id, lessonId, score, correctCount, total, user.ageGroup);
    res.status(200).json({
        success: true,
        message: "Progress saved",
        data: result,
    });
});
exports.getMyProgress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await progressService_1.ProgressService.getUserProgress(req.user.id);
    res.status(200).json({ success: true, data });
});
//# sourceMappingURL=progressController.js.map
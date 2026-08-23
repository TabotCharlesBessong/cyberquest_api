"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLectureBySlug = exports.getAllLectures = void 0;
const lectureService_1 = require("../services/lectureService");
const asyncHandler_1 = require("../middleware/asyncHandler");
const apiError_1 = require("../utils/apiError");
exports.getAllLectures = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lectures = await lectureService_1.LectureService.getAllLectures(req.query.ageGroup);
    res.status(200).json({ success: true, data: { lectures } });
});
exports.getLectureBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lecture = await lectureService_1.LectureService.getLectureBySlug(req.params.slug, req.query.ageGroup);
    if (!lecture)
        throw (0, apiError_1.notFound)("Lecture not found");
    res.status(200).json({ success: true, data: { lecture } });
});
//# sourceMappingURL=lectureController.js.map
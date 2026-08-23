"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLessonById = exports.getLessons = exports.getUnitById = exports.getUnits = exports.getSectionBySlug = exports.getSections = void 0;
const curriculumService_1 = require("../services/curriculumService");
const asyncHandler_1 = require("../middleware/asyncHandler");
const apiError_1 = require("../utils/apiError");
exports.getSections = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const ageGroup = req.query.ageGroup;
    const sections = await curriculumService_1.CurriculumService.getSections(ageGroup);
    res.status(200).json({ success: true, data: { sections } });
});
exports.getSectionBySlug = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
    const ageGroup = req.query.ageGroup;
    const section = await curriculumService_1.CurriculumService.getSectionBySlug(slug, ageGroup);
    if (!section)
        throw (0, apiError_1.notFound)("Section not found");
    res.status(200).json({ success: true, data: { section } });
});
exports.getUnits = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const sectionId = typeof req.params.sectionId === 'string' ? req.params.sectionId : '';
    const units = await curriculumService_1.CurriculumService.getUnits(sectionId);
    res.status(200).json({ success: true, data: { units } });
});
exports.getUnitById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const unit = await curriculumService_1.CurriculumService.getUnitById(id);
    if (!unit)
        throw (0, apiError_1.notFound)("Unit not found");
    res.status(200).json({ success: true, data: { unit } });
});
exports.getLessons = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const unitId = typeof req.params.unitId === 'string' ? req.params.unitId : '';
    const lessons = await curriculumService_1.CurriculumService.getLessons(unitId);
    res.status(200).json({ success: true, data: { lessons } });
});
exports.getLessonById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const lesson = await curriculumService_1.CurriculumService.getLessonById(id);
    if (!lesson)
        throw (0, apiError_1.notFound)("Lesson not found");
    res.status(200).json({ success: true, data: { lesson } });
});
//# sourceMappingURL=curriculumController.js.map
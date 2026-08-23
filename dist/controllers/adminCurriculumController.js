"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCurriculum = exports.exportCurriculum = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionsByLesson = exports.deleteLesson = exports.updateLesson = exports.createLesson = exports.getLessonsByUnit = exports.deleteUnit = exports.updateUnit = exports.createUnit = exports.getUnitsBySection = exports.deleteSection = exports.updateSection = exports.createSection = exports.getAdminSections = void 0;
const adminCurriculumService_1 = require("../services/adminCurriculumService");
const asyncHandler_1 = require("../middleware/asyncHandler");
const apiError_1 = require("../utils/apiError");
const curriculumData_1 = require("../seeders/curriculumData");
exports.getAdminSections = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const result = await adminCurriculumService_1.CurriculumService.getSections(page, limit);
    res.status(200).json({ success: true, data: result });
});
exports.createSection = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const section = await adminCurriculumService_1.CurriculumService.createSection(req.body);
    res.status(201).json({ success: true, data: { section } });
});
exports.updateSection = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const section = await adminCurriculumService_1.CurriculumService.updateSection(id, req.body);
    if (!section)
        throw (0, apiError_1.notFound)("Section not found");
    res.status(200).json({ success: true, data: { section } });
});
exports.deleteSection = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const section = await adminCurriculumService_1.CurriculumService.deleteSection(id);
    if (!section)
        throw (0, apiError_1.notFound)("Section not found");
    res.status(200).json({ success: true, data: { section } });
});
exports.getUnitsBySection = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const sectionId = typeof req.params.sectionId === "string" ? req.params.sectionId : "";
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const result = await adminCurriculumService_1.CurriculumService.getUnits(sectionId, page, limit);
    res.status(200).json({ success: true, data: result });
});
exports.createUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const unit = await adminCurriculumService_1.CurriculumService.createUnit(req.body);
    res.status(201).json({ success: true, data: { unit } });
});
exports.updateUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const unit = await adminCurriculumService_1.CurriculumService.updateUnit(id, req.body);
    if (!unit)
        throw (0, apiError_1.notFound)("Unit not found");
    res.status(200).json({ success: true, data: { unit } });
});
exports.deleteUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const unit = await adminCurriculumService_1.CurriculumService.deleteUnit(id);
    if (!unit)
        throw (0, apiError_1.notFound)("Unit not found");
    res.status(200).json({ success: true, data: { unit } });
});
exports.getLessonsByUnit = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const unitId = typeof req.params.unitId === "string" ? req.params.unitId : "";
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const result = await adminCurriculumService_1.CurriculumService.getLessons(unitId, page, limit);
    res.status(200).json({ success: true, data: result });
});
exports.createLesson = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lesson = await adminCurriculumService_1.CurriculumService.createLesson(req.body);
    res.status(201).json({ success: true, data: { lesson } });
});
exports.updateLesson = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const lesson = await adminCurriculumService_1.CurriculumService.updateLesson(id, req.body);
    if (!lesson)
        throw (0, apiError_1.notFound)("Lesson not found");
    res.status(200).json({ success: true, data: { lesson } });
});
exports.deleteLesson = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const lesson = await adminCurriculumService_1.CurriculumService.deleteLesson(id);
    if (!lesson)
        throw (0, apiError_1.notFound)("Lesson not found");
    res.status(200).json({ success: true, data: { lesson } });
});
exports.getQuestionsByLesson = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const lessonId = typeof req.params.lessonId === "string" ? req.params.lessonId : "";
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const result = await adminCurriculumService_1.CurriculumService.getQuestions(lessonId, page, limit);
    res.status(200).json({ success: true, data: result });
});
exports.createQuestion = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const question = await adminCurriculumService_1.CurriculumService.createQuestion(req.body);
    res.status(201).json({ success: true, data: { question } });
});
exports.updateQuestion = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const question = await adminCurriculumService_1.CurriculumService.updateQuestion(id, req.body);
    if (!question)
        throw (0, apiError_1.notFound)("Question not found");
    res.status(200).json({ success: true, data: { question } });
});
exports.deleteQuestion = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const question = await adminCurriculumService_1.CurriculumService.deleteQuestion(id);
    if (!question)
        throw (0, apiError_1.notFound)("Question not found");
    res.status(200).json({ success: true, data: { question } });
});
exports.exportCurriculum = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const data = { curriculum: curriculumData_1.CURRICULUM };
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=curriculum.json");
    res.status(200).json(data);
});
exports.importCurriculum = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
        res
            .status(400)
            .json({ success: false, message: "Invalid curriculum payload" });
        return;
    }
    const curriculum = payload.curriculum;
    if (!curriculum || !Array.isArray(curriculum.sections)) {
        res
            .status(400)
            .json({ success: false, message: "Missing curriculum.sections" });
        return;
    }
    await adminCurriculumService_1.CurriculumService.importCurriculum(curriculum);
    res.status(200).json({ success: true, message: "Curriculum imported" });
});
//# sourceMappingURL=adminCurriculumController.js.map
import { Response } from "express";
import { CurriculumService } from "../services/adminCurriculumService";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";
import { CURRICULUM } from "../seeders/curriculumData";

export const getAdminSections = asyncHandler(
  async (_req: AuthedRequest, res: Response) => {
    const sections = await CurriculumService.getSections();
    res.status(200).json({ success: true, data: { sections } });
  },
);

export const createSection = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const section = await CurriculumService.createSection(req.body);
    res.status(201).json({ success: true, data: { section } });
  },
);

export const updateSection = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const section = await CurriculumService.updateSection(id, req.body);
    if (!section) throw notFound("Section not found");
    res.status(200).json({ success: true, data: { section } });
  },
);

export const deleteSection = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const section = await CurriculumService.deleteSection(id);
    if (!section) throw notFound("Section not found");
    res.status(200).json({ success: true, data: { section } });
  },
);

export const getUnitsBySection = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const sectionId =
      typeof req.params.sectionId === "string" ? req.params.sectionId : "";
    const units = await CurriculumService.getUnits(sectionId);
    res.status(200).json({ success: true, data: { units } });
  },
);

export const createUnit = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const unit = await CurriculumService.createUnit(req.body);
    res.status(201).json({ success: true, data: { unit } });
  },
);

export const updateUnit = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const unit = await CurriculumService.updateUnit(id, req.body);
    if (!unit) throw notFound("Unit not found");
    res.status(200).json({ success: true, data: { unit } });
  },
);

export const deleteUnit = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const unit = await CurriculumService.deleteUnit(id);
    if (!unit) throw notFound("Unit not found");
    res.status(200).json({ success: true, data: { unit } });
  },
);

export const getLessonsByUnit = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const unitId =
      typeof req.params.unitId === "string" ? req.params.unitId : "";
    const lessons = await CurriculumService.getLessons(unitId);
    res.status(200).json({ success: true, data: { lessons } });
  },
);

export const createLesson = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const lesson = await CurriculumService.createLesson(req.body);
    res.status(201).json({ success: true, data: { lesson } });
  },
);

export const updateLesson = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const lesson = await CurriculumService.updateLesson(id, req.body);
    if (!lesson) throw notFound("Lesson not found");
    res.status(200).json({ success: true, data: { lesson } });
  },
);

export const deleteLesson = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const lesson = await CurriculumService.deleteLesson(id);
    if (!lesson) throw notFound("Lesson not found");
    res.status(200).json({ success: true, data: { lesson } });
  },
);

export const getQuestionsByLesson = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const lessonId =
      typeof req.params.lessonId === "string" ? req.params.lessonId : "";
    const questions = await CurriculumService.getQuestions(lessonId);
    res.status(200).json({ success: true, data: { questions } });
  },
);

export const createQuestion = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const question = await CurriculumService.createQuestion(req.body);
    res.status(201).json({ success: true, data: { question } });
  },
);

export const updateQuestion = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const question = await CurriculumService.updateQuestion(id, req.body);
    if (!question) throw notFound("Question not found");
    res.status(200).json({ success: true, data: { question } });
  },
);

export const deleteQuestion = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const question = await CurriculumService.deleteQuestion(id);
    if (!question) throw notFound("Question not found");
    res.status(200).json({ success: true, data: { question } });
  },
);

export const exportCurriculum = asyncHandler(
  async (_req: AuthedRequest, res: Response) => {
    const data = { curriculum: CURRICULUM };
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=curriculum.json",
    );
    res.status(200).json(data);
  },
);

export const importCurriculum = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
      res
        .status(400)
        .json({ success: false, message: "Invalid curriculum payload" });
      return;
    }
    const curriculum = (payload as any).curriculum;
    if (!curriculum || !Array.isArray(curriculum.sections)) {
      res
        .status(400)
        .json({ success: false, message: "Missing curriculum.sections" });
      return;
    }
    await CurriculumService.importCurriculum(curriculum);
    res.status(200).json({ success: true, message: "Curriculum imported" });
  },
);

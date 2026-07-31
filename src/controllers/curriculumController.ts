import { Response } from "express";
import { CurriculumService } from "../services/curriculumService";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";
import { AgeGroup } from "../db/models/Lesson";

export const getSections = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const ageGroup = req.query.ageGroup as AgeGroup | undefined;
    const sections = await CurriculumService.getSections(ageGroup);
    res.status(200).json({ success: true, data: { sections } });
  }
);

export const getSectionBySlug = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
    const ageGroup = req.query.ageGroup as AgeGroup | undefined;
    const section = await CurriculumService.getSectionBySlug(slug, ageGroup);
    if (!section) throw notFound("Section not found");
    res.status(200).json({ success: true, data: { section } });
  }
);

export const getUnits = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const sectionId = typeof req.params.sectionId === 'string' ? req.params.sectionId : '';
    const units = await CurriculumService.getUnits(sectionId);
    res.status(200).json({ success: true, data: { units } });
  }
);

export const getUnitById = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const unit = await CurriculumService.getUnitById(id);
    if (!unit) throw notFound("Unit not found");
    res.status(200).json({ success: true, data: { unit } });
  }
);

export const getLessons = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const unitId = typeof req.params.unitId === 'string' ? req.params.unitId : '';
    const lessons = await CurriculumService.getLessons(unitId);
    res.status(200).json({ success: true, data: { lessons } });
  }
);

export const getLessonById = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const lesson = await CurriculumService.getLessonById(id);
    if (!lesson) throw notFound("Lesson not found");
    res.status(200).json({ success: true, data: { lesson } });
  }
);

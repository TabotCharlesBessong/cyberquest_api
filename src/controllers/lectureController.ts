import { Response } from "express";
import { LectureService } from "../services/lectureService";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";
import { validateParams, validateQuery } from "../middleware/validate";
import { slugParamSchema, ageGroupQuerySchema } from "../validation/schemas";

export const getAllLectures = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const raw = req.query.ageGroup;
    const ageGroup = typeof raw === "string" ? (raw as "A" | "B") : undefined;
    const lectures = await LectureService.getAllLectures(ageGroup);

    res.status(200).json({ success: true, data: { lectures } });
  }
);

export const getLectureBySlug = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const raw = req.query.ageGroup;
    const ageGroup = typeof raw === "string" ? (raw as "A" | "B") : undefined;
    const lecture = await LectureService.getLectureBySlug(req.params.slug as string, ageGroup);

    if (!lecture) throw notFound("Lecture not found");

    res.status(200).json({ success: true, data: { lecture } });
  }
);

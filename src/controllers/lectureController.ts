import { Response } from "express";
import { LectureService } from "../services/lectureService";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";

export const getAllLectures = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const lectures = await LectureService.getAllLectures(req.query.ageGroup as any);
    res.status(200).json({ success: true, data: { lectures } });
  }
);

export const getLectureBySlug = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const lecture = await LectureService.getLectureBySlug(req.params.slug as string, req.query.ageGroup as any);
    if (!lecture) throw notFound("Lecture not found");

    res.status(200).json({ success: true, data: { lecture } });
  }
);

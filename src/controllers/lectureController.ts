import { Response } from "express";
import { Lecture } from "../db/models/Lecture";
import { Lesson } from "../db/models/Lesson";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";

// GET /api/lectures
export const getAllLectures = asyncHandler(
  async (_req: AuthedRequest, res: Response) => {
    const lectures = await Lecture.findAll({
      include: [{ model: Lesson, as: "lessons", order: [["order", "ASC"]] }],
      order: [["order", "ASC"]],
    });

    res.status(200).json({ success: true, data: { lectures } });
  }
);

// GET /api/lectures/:slug
export const getLectureBySlug = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const lecture = await Lecture.findOne({
      where: { slug: req.params.slug },
      include: [{ model: Lesson, as: "lessons", order: [["order", "ASC"]] }],
    });

    if (!lecture) throw notFound("Lecture not found");

    res.status(200).json({ success: true, data: { lecture } });
  }
);

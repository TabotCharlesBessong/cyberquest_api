import { Response } from "express";
import {
  Lecture,
  Lesson,
  LessonOption,
  LessonChoice,
  Concept,
  Standard,
} from "../db";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";

function flattenLesson(lesson: any): Record<string, unknown> {
  const plain = lesson.get({ plain: true });

  if (lesson.options?.length) {
    plain.options = lesson.options
      .sort((a: any, b: any) => a.position - b.position)
      .map((o: any) => o.text);
  }

  if (lesson.choices?.length) {
    plain.choices = lesson.choices
      .sort((a: any, b: any) => a.position - b.position)
      .map((c: any) => ({
        text: c.text,
        feedback: c.feedback,
        consequence: c.consequence,
        xpDelta: c.xpDelta,
      }));
  }

  if (lesson.concepts?.length) {
    plain.conceptKeys = lesson.concepts.map((c: any) => c.code);
  }

  if (lesson.standards?.length) {
    plain.connexusStandards = lesson.standards.map((s: any) => s.code);
  }

  return plain;
}

// GET /api/lectures
export const getAllLectures = asyncHandler(
  async (_req: AuthedRequest, res: Response) => {
    const lectures = await Lecture.findAll({
      include: [
        {
          model: Lesson,
          as: "lessons",
          order: [["order", "ASC"]],
          include: [
            { model: LessonOption, as: "options", order: [["position", "ASC"]] },
            { model: LessonChoice, as: "choices", order: [["position", "ASC"]] },
            { model: Concept, as: "concepts" },
            { model: Standard, as: "standards" },
          ],
        },
      ],
      order: [["order", "ASC"]],
    });

    const data = lectures.map((lecture) => {
      const lecturePlain = lecture.get({ plain: true }) as Record<string, unknown>;
      return {
        ...lecturePlain,
        lessons: (lecture as any).lessons.map((lesson: any) => flattenLesson(lesson)),
      };
    });

    res.status(200).json({ success: true, data: { lectures: data } });
  }
);

// GET /api/lectures/:slug
export const getLectureBySlug = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const lecture = await Lecture.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: Lesson,
          as: "lessons",
          order: [["order", "ASC"]],
          include: [
            { model: LessonOption, as: "options", order: [["position", "ASC"]] },
            { model: LessonChoice, as: "choices", order: [["position", "ASC"]] },
            { model: Concept, as: "concepts" },
            { model: Standard, as: "standards" },
          ],
        },
      ],
    });

    if (!lecture) throw notFound("Lecture not found");

    const lecturePlain = lecture.get({ plain: true }) as Record<string, unknown>;
    const data = {
      ...lecturePlain,
      lessons: (lecture as any).lessons.map((lesson: any) => flattenLesson(lesson)),
    };

    res.status(200).json({ success: true, data: { lecture: data } });
  }
);

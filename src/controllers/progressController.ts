import { Response } from "express";
import { ProgressService } from "../services/progressService";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { progressSubmitSchema } from "../validation/schemas";

export const submitLessonProgress = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { lessonId, score } = req.body as { lessonId: string; score: number };
    const result = await ProgressService.submitLessonProgress(
      req.user!.id,
      lessonId,
      score
    );

    res.status(200).json({
      success: true,
      message: "Progress saved",
      data: result,
    });
  }
);

export const getMyProgress = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const data = await ProgressService.getUserProgress(req.user!.id);

    res.status(200).json({ success: true, data });
  }
);

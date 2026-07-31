import { Response } from "express";
import { ProgressService } from "../services/progressService";
import { User } from "../db/models/User";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";

export const submitLessonProgress = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { lessonId, score, correctCount, total } = req.body as { 
      lessonId: string; 
      score: number; 
      correctCount?: number; 
      total?: number; 
    };
    const user = await User.findByPk(req.user!.id);
    if (!user) throw notFound("User not found");
    const result = await ProgressService.submitLessonProgress(
      req.user!.id,
      lessonId,
      score,
      correctCount,
      total,
      user.ageGroup as "A" | "B" | undefined
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

import { Response } from "express";
import { ClassroomService } from "../services/classroomService";
import { asyncHandler } from "../middleware/asyncHandler";

export const createClassroom = asyncHandler(async (req: any, res: Response) => {
  const { name, school } = req.body as { name: string; school: string };
  const classroom = await ClassroomService.createClassroom(name, school, req.user.id);
  res.status(201).json({ success: true, data: classroom });
});

export const joinClassroom = asyncHandler(async (req: any, res: Response) => {
  const { code } = req.body as { code: string };
  const classroom = await ClassroomService.getClassroomByCode(code);
  if (!classroom) {
    res.status(404).json({ success: false, message: "Classroom not found" });
    return;
  }
  const joined = await ClassroomService.joinClassroom(classroom.id, req.user.id);
  res.status(200).json({ success: true, data: joined });
});

export const startRound = asyncHandler(async (req: any, res: Response) => {
  const { classroomId } = req.params;
  const { questions } = req.body as { questions: { id: string; text: string; options: string[]; correctIndex: number }[] };
  const result = await ClassroomService.startRound(classroomId, questions);
  res.status(201).json({ success: true, data: result });
});

export const submitAnswer = asyncHandler(async (req: any, res: Response) => {
  const { roundId } = req.params;
  const { questionId, selectedIndex, correctIndex } = req.body as {
    questionId: string;
    selectedIndex: number;
    correctIndex: number;
  };
  const result = await ClassroomService.submitAnswer(roundId, req.user.id, questionId, selectedIndex, correctIndex);
  res.status(200).json({ success: true, data: result });
});

export const finishRound = asyncHandler(async (req: any, res: Response) => {
  const { roundId } = req.params;
  const result = await ClassroomService.finishRound(roundId);
  res.status(200).json({ success: true, data: result });
});

import { Router } from "express";
import { createClassroom, joinClassroom, startRound, submitAnswer, finishRound } from "../controllers/classroomController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.post("/", createClassroom);
router.post("/join", joinClassroom);
router.post("/:classroomId/round/start", startRound);
router.post("/rounds/:roundId/answer", submitAnswer);
router.post("/rounds/:roundId/finish", finishRound);

export default router;

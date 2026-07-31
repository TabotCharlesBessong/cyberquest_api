import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByLesson,
} from "../controllers/adminCurriculumController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/lessons/:lessonId/questions", getQuestionsByLesson);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;

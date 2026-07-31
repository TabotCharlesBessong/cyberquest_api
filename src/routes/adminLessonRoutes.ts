import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsByUnit,
} from "../controllers/adminCurriculumController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/units/:unitId/lessons", getLessonsByUnit);
router.post("/lessons", createLesson);
router.put("/lessons/:id", updateLesson);
router.delete("/lessons/:id", deleteLesson);

export default router;

import { Router } from "express";
import { submitLessonProgress, getMyProgress } from "../controllers/progressController";
import { authMiddleware } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { progressSubmitSchema } from "../validation/schemas";

const router = Router();

router.use(authMiddleware);

router.post("/lesson", validateBody(progressSubmitSchema), submitLessonProgress);
router.get("/me", getMyProgress);

export default router;

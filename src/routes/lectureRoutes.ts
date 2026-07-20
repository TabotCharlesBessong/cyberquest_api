import { Router } from "express";
import { getAllLectures, getLectureBySlug } from "../controllers/lectureController";
import { authMiddleware } from "../middleware/auth";
import { validateParams, validateQuery } from "../middleware/validate";
import { slugParamSchema, ageGroupQuerySchema } from "../validation/schemas";

const router = Router();

router.use(authMiddleware);

router.get("/", validateQuery(ageGroupQuerySchema), getAllLectures);
router.get(
  "/:slug",
  validateParams(slugParamSchema),
  validateQuery(ageGroupQuerySchema),
  getLectureBySlug
);

export default router;

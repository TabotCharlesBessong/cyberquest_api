import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getAllLectures,
  getLectureBySlug,
} from "../controllers/lectureController";

const router = Router();

router.get("/", getAllLectures);
router.get("/:slug", authMiddleware, getLectureBySlug);

export default router;

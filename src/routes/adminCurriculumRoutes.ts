import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  createSection,
  updateSection,
  deleteSection,
  getAdminSections,
} from "../controllers/adminCurriculumController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/sections", getAdminSections);
router.post("/sections", createSection);
router.put("/sections/:id", updateSection);
router.delete("/sections/:id", deleteSection);

export default router;

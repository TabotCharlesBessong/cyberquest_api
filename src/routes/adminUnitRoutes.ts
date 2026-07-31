import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  createUnit,
  updateUnit,
  deleteUnit,
  getUnitsBySection,
} from "../controllers/adminCurriculumController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/sections/:sectionId/units", getUnitsBySection);
router.post("/units", createUnit);
router.put("/units/:id", updateUnit);
router.delete("/units/:id", deleteUnit);

export default router;

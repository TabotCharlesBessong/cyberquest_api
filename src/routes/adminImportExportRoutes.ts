import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import { exportCurriculum, importCurriculum } from "../controllers/adminCurriculumController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/export", exportCurriculum);
router.post("/import", importCurriculum);

export default router;

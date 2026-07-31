import { Router } from "express";
import { getActiveEvent, listEvents } from "../controllers/eventController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

router.get("/active", getActiveEvent);
router.get("/", listEvents);

export default router;

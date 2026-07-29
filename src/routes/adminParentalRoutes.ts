import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  getParentalControls,
  upsertParentalControls,
} from "../controllers/adminParentalController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/users/:userId/parental-controls", getParentalControls);
router.put("/users/:userId/parental-controls", upsertParentalControls);

export default router;

import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  signup,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  resetPassword,
  me,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/verify", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authMiddleware, me);

export default router;

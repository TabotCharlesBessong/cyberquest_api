import { Router } from "express";
import { signup, verifyEmail, resendVerification, login, forgotPassword, resetPassword, me } from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { signupSchema, verifyEmailSchema, resendVerificationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validation/schemas";

const router = Router();

router.post("/signup", validateBody(signupSchema), signup);
router.post("/verify", validateBody(verifyEmailSchema), verifyEmail);
router.post("/resend-verification", validateBody(resendVerificationSchema), resendVerification);
router.post("/login", validateBody(loginSchema), login);
router.post("/forgot-password", validateBody(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateBody(resetPasswordSchema), resetPassword);
router.get("/me", me);

export default router;

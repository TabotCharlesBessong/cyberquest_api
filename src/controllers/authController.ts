import { Response } from "express";
import { User, sanitizeUser } from "../db/models/User";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError, badRequest, forbidden, unauthorized } from "../utils/apiError";
import { signToken } from "../utils/token";
import { generateCode } from "../utils/code";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../utils/email";
import config from "../config/config";

function issueToken(user: User): string {
  return signToken({ id: user.id });
}

// POST /api/auth/signup
export const signup = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { name, email, password, age, avatar } = req.body ?? {};

  if (!name || !email || !password) {
    throw badRequest("Name, email and password are required");
  }
  if (typeof password !== "string" || password.length < 6) {
    throw badRequest("Password must be at least 6 characters");
  }
  if (typeof email !== "string" || !email.includes("@")) {
    throw badRequest("A valid email is required");
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const verificationCode = generateCode(6);
  const verificationCodeExpires = new Date(
    Date.now() + config.codeExpiryMinutes * 60 * 1000
  );

  const user = await User.create({
    name,
    email,
    password,
    age: age ?? null,
    avatar: avatar ?? null,
    verificationCode,
    verificationCodeExpires,
  });

  await sendVerificationEmail(email, verificationCode);

  res.status(201).json({
    success: true,
    message:
      "Account created. Check your email for the 6-character verification code.",
    data: { user: sanitizeUser(user) },
  });
});

// POST /api/auth/verify
export const verifyEmail = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { email, code } = req.body ?? {};
    if (!email || !code) {
      throw badRequest("Email and code are required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.verificationCode) {
      throw badRequest("No verification pending for this email");
    }
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      throw badRequest("Verification code has expired. Request a new one.");
    }
    if (user.verificationCode !== String(code).toUpperCase()) {
      throw badRequest("Invalid verification code");
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: {
        token: issueToken(user),
        user: sanitizeUser(user),
      },
    });
  }
);

// POST /api/auth/resend-verification
export const resendVerification = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { email } = req.body ?? {};
    if (!email) throw badRequest("Email is required");

    const user = await User.findOne({ where: { email } });
    if (!user) throw badRequest("No account found for this email");
    if (user.isVerified) throw badRequest("This account is already verified");

    const verificationCode = generateCode(6);
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(
      Date.now() + config.codeExpiryMinutes * 60 * 1000
    );
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({
      success: true,
      message: "A new verification code has been sent to your email.",
    });
  }
);

// POST /api/auth/login
export const login = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) throw badRequest("Email and password are required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw unauthorized("Invalid credentials");

  const valid = await user.comparePassword(password);
  if (!valid) throw unauthorized("Invalid credentials");

  if (!user.isVerified) {
    throw forbidden("Please verify your email before logging in");
  }

  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    data: { token: issueToken(user), user: sanitizeUser(user) },
  });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { email } = req.body ?? {};

    // Always respond generically to avoid leaking account existence.
    const generic = {
      success: true,
      message:
        "If an account exists for that email, a reset code has been sent.",
    };

    if (!email) return res.status(200).json(generic);

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(200).json(generic);

    const resetPasswordCode = generateCode(6);
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordExpires = new Date(
      Date.now() + config.codeExpiryMinutes * 60 * 1000
    );
    await user.save();

    await sendPasswordResetEmail(email, resetPasswordCode);

    res.status(200).json(generic);
  }
);

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { email, code, newPassword } = req.body ?? {};
    if (!email || !code || !newPassword) {
      throw badRequest("Email, code and newPassword are required");
    }
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      throw badRequest("New password must be at least 6 characters");
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.resetPasswordCode) {
      throw badRequest("No password reset pending for this email");
    }
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw badRequest("Reset code has expired. Request a new one.");
    }
    if (user.resetPasswordCode !== String(code).toUpperCase()) {
      throw badRequest("Invalid reset code");
    }

    user.password = newPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  }
);

// GET /api/auth/me
export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const user = await User.findByPk(req.user!.id);
  if (!user) throw unauthorized("User no longer exists");

  res.status(200).json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
});

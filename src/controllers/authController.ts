import { Response } from "express";
import { AuthService } from "../services/authService";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError, forbidden, unauthorized } from "../utils/apiError";
import { signToken } from "../utils/token";
import { sanitizeUser } from "../db/models/User";

export const signup = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const result = await AuthService.signup(req.body);
  res.status(201).json({
    success: true,
    message: result.message,
    data: { user: sanitizeUser(result.user) },
  });
});

export const verifyEmail = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const result = await AuthService.verifyEmail(req.body);
    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
      data: {
        token: result.token,
        user: sanitizeUser(result.user),
      },
    });
  }
);

export const resendVerification = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const result = await AuthService.resendVerification(req.body.email);
    res.status(200).json(result);
  }
);

export const login = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const result = await AuthService.login(req.body);
  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    data: { token: signToken({ id: result.user.id }), user: sanitizeUser(result.user) },
  });
});

export const forgotPassword = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const result = await AuthService.forgotPassword(req.body.email);
    res.status(200).json(result);
  }
);

export const resetPassword = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const result = await AuthService.resetPassword(req.body);
    res.status(200).json(result);
  }
);

export const me = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const user = await AuthService.getMe(req.user!.id);
  res.status(200).json({
    success: true,
    data: { user: sanitizeUser(user) },
  });
});

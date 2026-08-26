import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z.coerce.number().int().positive().optional(),
  avatar: z.string().optional(),
});

export const verifyEmailSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("A valid email is required"),
});

export const loginSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("A valid email is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("A valid email is required"),
  code: z.string().length(6, "Code must be 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.coerce.number().int().positive().optional(),
  avatar: z.string().optional(),
  ageGroup: z.enum(["A", "B"]).optional(),
  onboarded: z.boolean().optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const lessonIdParamSchema = z.object({
  id: z.string().uuid("Valid lesson ID is required"),
});

export const progressSubmitSchema = z.object({
  lessonId: z.string().uuid("Valid lesson ID is required"),
  score: z.coerce.number().min(0).max(100),
  correctCount: z.coerce.number().int().min(0).optional(),
  total: z.coerce.number().int().min(1).optional(),
  answers: z.array(z.any()).optional(),
});

export const ageGroupQuerySchema = z.object({
  ageGroup: z.enum(["A", "B"]).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ProgressSubmitInput = z.infer<typeof progressSubmitSchema>;

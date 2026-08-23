"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ageGroupQuerySchema = exports.progressSubmitSchema = exports.lessonIdParamSchema = exports.slugParamSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.resendVerificationSchema = exports.verifyEmailSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("A valid email is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    age: zod_1.z.coerce.number().int().positive().optional(),
    avatar: zod_1.z.string().optional(),
});
exports.verifyEmailSchema = zod_1.z.object({
    code: zod_1.z.string().length(6, "Code must be 6 characters"),
});
exports.resendVerificationSchema = zod_1.z.object({
    email: zod_1.z.string().email("A valid email is required"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("A valid email is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("A valid email is required"),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("A valid email is required"),
    code: zod_1.z.string().length(6, "Code must be 6 characters"),
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters"),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    age: zod_1.z.coerce.number().int().positive().optional(),
    avatar: zod_1.z.string().optional(),
    ageGroup: zod_1.z.enum(["A", "B"]).optional(),
});
exports.slugParamSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1, "Slug is required"),
});
exports.lessonIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Valid lesson ID is required"),
});
exports.progressSubmitSchema = zod_1.z.object({
    lessonId: zod_1.z.string().uuid("Valid lesson ID is required"),
    score: zod_1.z.coerce.number().min(0).max(100),
    correctCount: zod_1.z.coerce.number().int().min(0).optional(),
    total: zod_1.z.coerce.number().int().min(1).optional(),
    answers: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.ageGroupQuerySchema = zod_1.z.object({
    ageGroup: zod_1.z.enum(["A", "B"]).optional(),
});
//# sourceMappingURL=schemas.js.map
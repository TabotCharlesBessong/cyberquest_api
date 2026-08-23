"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.me = exports.resetPassword = exports.forgotPassword = exports.login = exports.resendVerification = exports.verifyEmail = exports.signup = void 0;
const authService_1 = require("../services/authService");
const asyncHandler_1 = require("../middleware/asyncHandler");
const User_1 = require("../db/models/User");
exports.signup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService_1.AuthService.signup(req.body);
    res.status(201).json({
        success: true,
        message: result.message,
        data: { user: (0, User_1.sanitizeUser)(result.user) },
    });
});
exports.verifyEmail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService_1.AuthService.verifyEmail(req.body);
    res.status(200).json({
        success: true,
        message: "Email verified successfully.",
        data: {
            token: result.token,
            user: (0, User_1.sanitizeUser)(result.user),
        },
    });
});
exports.resendVerification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService_1.AuthService.resendVerification(req.body.email);
    res.status(200).json(result);
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService_1.AuthService.login(req.body);
    res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        data: { token: result.token, user: (0, User_1.sanitizeUser)(result.user) },
    });
});
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService_1.AuthService.forgotPassword(req.body.email);
    res.status(200).json(result);
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService_1.AuthService.resetPassword(req.body);
    res.status(200).json(result);
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await authService_1.AuthService.getMe(req.user.id);
    res.status(200).json({
        success: true,
        data: { user: (0, User_1.sanitizeUser)(user) },
    });
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, age, avatar } = req.body;
    const user = await authService_1.AuthService.updateProfile(req.user.id, { name, age, avatar });
    res.status(200).json({
        success: true,
        data: { user: (0, User_1.sanitizeUser)(user) },
    });
});
//# sourceMappingURL=authController.js.map
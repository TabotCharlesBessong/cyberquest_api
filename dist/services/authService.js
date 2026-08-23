"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const User_1 = require("../db/models/User");
const token_1 = require("../utils/token");
const code_1 = require("../utils/code");
const config_1 = __importDefault(require("../config/config"));
const email_1 = require("../utils/email");
const apiError_1 = require("../utils/apiError");
class AuthService {
    static async signup(input) {
        const existing = await User_1.User.findOne({ where: { email: input.email } });
        if (existing) {
            throw new apiError_1.ApiError(409, "An account with this email already exists");
        }
        const verificationCode = (0, code_1.generateCode)(6);
        const verificationCodeExpires = new Date(Date.now() + config_1.default.codeExpiryMinutes * 60 * 1000);
        const user = await User_1.User.create({
            name: input.name,
            email: input.email,
            password: input.password,
            age: input.age ?? null,
            avatar: input.avatar ?? null,
            verificationCode,
            verificationCodeExpires,
        });
        await (0, email_1.sendVerificationEmail)(input.email, verificationCode);
        return {
            user,
            message: "Account created. Check your email for the 6-character verification code.",
        };
    }
    static async verifyEmail(input) {
        const user = await User_1.User.findOne({ where: { verificationCode: String(input.code).toUpperCase() } });
        if (!user) {
            throw (0, apiError_1.badRequest)("Invalid verification code");
        }
        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
            throw (0, apiError_1.badRequest)("Verification code has expired. Request a new one.");
        }
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();
        await (0, email_1.sendWelcomeEmail)(user.email, user.name);
        const token = (0, token_1.signToken)({ id: user.id, role: user.role });
        return { user, token };
    }
    static async resendVerification(email) {
        const user = await User_1.User.findOne({ where: { email } });
        if (!user)
            throw (0, apiError_1.badRequest)("No account found for this email");
        if (user.isVerified)
            throw (0, apiError_1.badRequest)("This account is already verified");
        const verificationCode = (0, code_1.generateCode)(6);
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = new Date(Date.now() + config_1.default.codeExpiryMinutes * 60 * 1000);
        await user.save();
        await (0, email_1.sendVerificationEmail)(email, verificationCode);
        return { message: "A new verification code has been sent to your email." };
    }
    static async login(input) {
        const user = await User_1.User.findOne({ where: { email: input.email } });
        if (!user)
            throw (0, apiError_1.unauthorized)("Invalid credentials");
        const valid = await user.comparePassword(input.password);
        if (!valid)
            throw (0, apiError_1.unauthorized)("Invalid credentials");
        if (!user.isVerified) {
            throw (0, apiError_1.forbidden)("Please verify your email before logging in");
        }
        const token = (0, token_1.signToken)({ id: user.id, role: user.role });
        return { user, token };
    }
    static async forgotPassword(email) {
        const generic = {
            success: true,
            message: "If an account exists for that email, a reset code has been sent.",
        };
        if (!email)
            return generic;
        const user = await User_1.User.findOne({ where: { email } });
        if (!user)
            return generic;
        const resetPasswordCode = (0, code_1.generateCode)(6);
        user.resetPasswordCode = resetPasswordCode;
        user.resetPasswordExpires = new Date(Date.now() + config_1.default.codeExpiryMinutes * 60 * 1000);
        await user.save();
        await (0, email_1.sendPasswordResetEmail)(email, resetPasswordCode);
        return generic;
    }
    static async resetPassword(input) {
        const user = await User_1.User.findOne({ where: { email: input.email } });
        if (!user || !user.resetPasswordCode) {
            throw (0, apiError_1.badRequest)("No password reset pending for this email");
        }
        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw (0, apiError_1.badRequest)("Reset code has expired. Request a new one.");
        }
        if (user.resetPasswordCode !== String(input.code).toUpperCase()) {
            throw (0, apiError_1.badRequest)("Invalid reset code");
        }
        user.password = input.newPassword;
        user.resetPasswordCode = null;
        user.resetPasswordExpires = null;
        await user.save();
        return { message: "Password reset successful. You can now log in." };
    }
    static async getMe(userId) {
        const user = await User_1.User.findByPk(userId);
        if (!user)
            throw (0, apiError_1.unauthorized)("User no longer exists");
        return user;
    }
    static async updateProfile(userId, input) {
        const user = await User_1.User.findByPk(userId);
        if (!user)
            throw (0, apiError_1.unauthorized)("User no longer exists");
        if (input.name !== undefined)
            user.name = input.name;
        if (input.age !== undefined)
            user.age = input.age;
        if (input.avatar !== undefined)
            user.avatar = input.avatar;
        if (input.ageGroup !== undefined)
            user.ageGroup = input.ageGroup;
        await user.save();
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map
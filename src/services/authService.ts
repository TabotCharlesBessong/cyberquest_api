import { User } from "../db/models/User";
import { signToken } from "../utils/token";
import { generateCode } from "../utils/code";
import config from "../config/config";
import logger from "../utils/logger";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "../utils/email";
import { ApiError, badRequest, forbidden, unauthorized } from "../utils/apiError";
import { SignupInput, LoginInput, UpdateProfileInput } from "../validation/schemas";

export class AuthService {
  static async signup(input: SignupInput) {
    const existing = await User.findOne({ where: { email: input.email } });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists");
    }

    const verificationCode = generateCode(6);
    const verificationCodeExpires = new Date(
      Date.now() + config.codeExpiryMinutes * 60 * 1000
    );

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: input.password,
      age: input.age ?? null,
      ageGroup: input.age ? (input.age <= 8 ? "A" : "B") : "A",
      avatar: input.avatar ?? null,
      verificationCode,
      verificationCodeExpires,
    });

    void sendVerificationEmail(input.email, verificationCode);

    return {
      user,
      message: "Account created. Check your email for the 6-character verification code.",
    };
  }

  static async verifyEmail(input: { code: string }) {
    const user = await User.findOne({ where: { verificationCode: String(input.code).toUpperCase() } });
    if (!user) {
      throw badRequest("Invalid verification code");
    }
    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
      throw badRequest("Verification code has expired. Request a new one.");
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      logger.warn("Welcome email failed to send", {
        component: "auth",
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }

    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
  }

  static async resendVerification(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw badRequest("No account found for this email");
    if (user.isVerified) throw badRequest("This account is already verified");

    const verificationCode = generateCode(6);
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(
      Date.now() + config.codeExpiryMinutes * 60 * 1000
    );
    await user.save();

    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (e) {
      logger.warn("Verification email failed to send", {
        component: "auth",
        error: e instanceof Error ? e.message : "Unknown error",
      });
    }
    return { message: "A new verification code has been sent to your email." };
  }

  static async login(input: LoginInput) {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user) throw unauthorized("Invalid credentials");

    const valid = await user.comparePassword(input.password);
    if (!valid) throw unauthorized("Invalid credentials");

    if (!user.isVerified) {
      throw forbidden("Please verify your email before logging in");
    }

    const token = signToken({ id: user.id, role: user.role });
    return { user, token };
  }

  static async forgotPassword(email: string) {
    const generic = {
      success: true as const,
      message: "If an account exists for that email, a reset code has been sent.",
    };

    if (!email) return generic;

    const user = await User.findOne({ where: { email } });
    if (!user) return generic;

    const resetPasswordCode = generateCode(6);
    user.resetPasswordCode = resetPasswordCode;
    user.resetPasswordExpires = new Date(
      Date.now() + config.codeExpiryMinutes * 60 * 1000
    );
    await user.save();

    logger.info("About to send password reset email", { component: "auth", email });

    void sendPasswordResetEmail(email, resetPasswordCode);
    return generic;
  }

  static async resetPassword(input: { email: string; code: string; newPassword: string }) {
    const user = await User.findOne({ where: { email: input.email } });
    if (!user || !user.resetPasswordCode) {
      throw badRequest("No password reset pending for this email");
    }
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw badRequest("Reset code has expired. Request a new one.");
    }
    if (user.resetPasswordCode !== String(input.code).toUpperCase()) {
      throw badRequest("Invalid reset code");
    }

    user.password = input.newPassword;
    user.resetPasswordCode = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { message: "Password reset successful. You can now log in." };
  }

  static async getMe(userId: string) {
    const user = await User.findByPk(userId);
    if (!user) throw unauthorized("User no longer exists");
    return user;
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await User.findByPk(userId);
    if (!user) throw unauthorized("User no longer exists");

    if (input.name !== undefined) user.name = input.name;
    if (input.age !== undefined) user.age = input.age;
    if (input.avatar !== undefined) user.avatar = input.avatar;
    if (input.ageGroup !== undefined) user.ageGroup = input.ageGroup;
    if (input.onboarded !== undefined) user.onboarded = input.onboarded;

    await user.save();
    return user;
  }
}

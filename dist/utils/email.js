"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("./logger"));
const isConfigured = Boolean(config_1.default.email.host && config_1.default.email.user);
exports.transporter = isConfigured
    ? nodemailer_1.default.createTransport({
        host: config_1.default.email.host,
        port: config_1.default.email.port,
        secure: config_1.default.email.secure,
        auth: {
            user: config_1.default.email.user,
            pass: config_1.default.email.pass,
        },
    })
    : null;
async function sendMail({ to, subject, html }) {
    if (!exports.transporter) {
        logger_1.default.warn("SMTP not configured - skipping email send", {
            component: "email",
            subject,
        });
        return;
    }
    try {
        await exports.transporter.sendMail({
            from: config_1.default.email.from,
            to,
            subject,
            html,
        });
        logger_1.default.info("Email sent successfully", {
            component: "email",
            subject,
        });
    }
    catch (err) {
        logger_1.default.error("Failed to send email", {
            component: "email",
            subject,
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}
function sendVerificationEmail(email, code) {
    return sendMail({
        to: email,
        subject: "Verify your CyberQuest account",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome to CyberQuest! 🛡️</h2>
        <p>Thanks for signing up. Use the code below to verify your account:</p>
        <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; margin: 24px 0; color: #4D96FF;">
          ${code}
        </div>
        <p>This code expires in ${config_1.default.codeExpiryMinutes} minutes.</p>
        <p>If you didn't create this account, you can ignore this email.</p>
      </div>`,
    });
}
function sendPasswordResetEmail(email, code) {
    return sendMail({
        to: email,
        subject: "Reset your CyberQuest password",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Password reset request 🔐</h2>
        <p>We received a request to reset your password. Use the code below:</p>
        <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; margin: 24px 0; color: #9B5DE5;">
          ${code}
        </div>
        <p>This code expires in ${config_1.default.codeExpiryMinutes} minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      </div>`,
    });
}
function sendWelcomeEmail(email, name) {
    return sendMail({
        to: email,
        subject: "You're all set! 🎉",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>Welcome aboard, ${name}! 🚀</h2>
        <p>Your account is verified. Time to start your cyber-safety adventure!</p>
      </div>`,
    });
}
//# sourceMappingURL=email.js.map
import nodemailer, { Transporter } from "nodemailer";
import config from "../config/config";
import logger from "./logger";

const isConfigured = Boolean(config.email.host && config.email.user);

export const transporter: Transporter | null = isConfigured
  ? nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    })
  : null;

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendMail({ to, subject, html }: MailOptions): Promise<void> {
  if (!transporter) {
    logger.warn("SMTP not configured - skipping email send", {
      component: "email",
      subject,
    });
    return;
  }
  try {
    await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });
    logger.info("Email sent successfully", {
      component: "email",
      subject,
    });
  } catch (err) {
    logger.error("Failed to send email", {
      component: "email",
      subject,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export function sendVerificationEmail(email: string, code: string): Promise<void> {
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
        <p>This code expires in ${config.codeExpiryMinutes} minutes.</p>
        <p>If you didn't create this account, you can ignore this email.</p>
      </div>`,
  });
}

export function sendPasswordResetEmail(email: string, code: string): Promise<void> {
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
        <p>This code expires in ${config.codeExpiryMinutes} minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      </div>`,
  });
}

export function sendWelcomeEmail(email: string, name: string): Promise<void> {
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

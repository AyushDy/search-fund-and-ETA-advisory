import { Resend } from 'resend';
import { getConfig } from '../config/env';

interface Message { to: string; subject: string; html: string; text: string; }

export async function sendEmail(message: Message): Promise<boolean> {
  const config = getConfig();
  if (!config.RESEND_API_KEY || !config.EMAIL_FROM) {
    console.warn('Email delivery is not configured; no email was sent.');
    return false;
  }
  const resend = new Resend(config.RESEND_API_KEY);
  const result = await resend.emails.send({ from: config.EMAIL_FROM, to: message.to, subject: message.subject, html: message.html, text: message.text });
  if (result.error) throw new Error(`Email delivery failed: ${result.error.message}`);
  return true;
}

export async function sendVerificationEmail(to: string, token: string): Promise<boolean> {
  const link = `${getConfig().APP_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`;
  return sendEmail({ to, subject: 'Verify your Northstar Advisory email', html: `<p>Verify your email address to continue using Northstar Advisory.</p><p><a href="${link}">Verify email address</a></p>`, text: `Verify your email address: ${link}` });
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<boolean> {
  const link = `${getConfig().APP_BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail({ to, subject: 'Reset your Northstar Advisory password', html: `<p>We received a request to reset your password.</p><p><a href="${link}">Reset password</a></p><p>This link expires soon and can only be used once.</p>`, text: `Reset your password: ${link}` });
}

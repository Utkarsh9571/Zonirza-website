import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport(
  process.env.EMAIL_SERVER_USER
    ? {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      }
    : {
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || 'test@example.com',
          pass: process.env.SMTP_PASS || 'password',
        },
      }
);

export const sendEmail = async (
  { to, subject, html }: { to: string; subject: string; html: string },
  retries = 3,
  delayMs = 1000
) => {
  // If SMTP is not configured and no Gmail service is configured, fallback to console log for testing
  if (!process.env.SMTP_HOST && !process.env.EMAIL_SERVER_USER) {
    logger.info('MOCK EMAIL DISPATCH', { to, subject });
    return { success: true, message: 'Mock email sent successfully (check console)' };
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"Zoniraz Luxury" <${process.env.EMAIL_SERVER_USER || process.env.SMTP_USER || 'no-reply@zoniraz.com'}>`,
        to,
        subject,
        html,
      });
      logger.info('Email dispatched successfully', { messageId: info.messageId, to, attempt });
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      logger.warn(`Email dispatch failed (Attempt ${attempt}/${retries})`, { to, error: error.message });
      if (attempt === retries) {
        logger.error('Email dispatch completely failed after retries', error, { to, subject });
        return { success: false, error };
      }
      // Exponential backoff
      await new Promise(res => setTimeout(res, delayMs * Math.pow(2, attempt - 1)));
    }
  }
};

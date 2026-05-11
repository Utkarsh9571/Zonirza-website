import nodemailer from "nodemailer";

// Reuse the transporter configuration from auth.ts logic
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Centralized mail utility for Zoniraz Luxury Branding
 */
export async function sendZonirazMail({ to, subject, html }: MailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Zoniraz Luxury" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Mail utility error:", error);
    return { success: false, error };
  }
}

/**
 * Generates a premium luxury-themed email wrapper
 */
export function getLuxuryEmailTemplate(content: string, previewText: string = "Zoniraz Luxury Branding") {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
          body { margin: 0; padding: 0; background-color: #f9f5f0; }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9f5f0; font-family: 'Playfair Display', serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9f5f0;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 50px rgba(58, 28, 22, 0.05);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 60px 40px 40px 40px; background-color: #3A1C16;">
                    <h1 style="color: #EAE1D5; margin: 0; font-size: 36px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: normal;">Zoniraz</h1>
                    <p style="color: #EAE1D5; opacity: 0.6; margin: 15px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4em;">Timeless Luxury & Craftsmanship</p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 60px 50px; color: #3A1C16; line-height: 1.8; font-size: 16px;">
                    ${content}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 40px; background-color: #fdfaf5; border-top: 1px solid #f2ede4;">
                    <p style="margin: 0; font-size: 12px; color: rgba(58, 28, 22, 0.4); text-transform: uppercase; letter-spacing: 0.2em;">
                      © 2026 Zoniraz Jewel House Pvt LTD.
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 10px; color: rgba(58, 28, 22, 0.3);">
                      Leading Luxury Jewellery Manufacturer & Exporter
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

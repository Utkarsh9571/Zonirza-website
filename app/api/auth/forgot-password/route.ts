import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendZonirazMail, getLuxuryEmailTemplate } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();
    const emailLower = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailLower });

    // To prevent user enumeration, we return a success status even if email doesn't exist
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we have sent a password reset link.",
      });
    }

    // Generate token and expiry (1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    const content = `
      <h2 style="font-size: 28px; font-weight: normal; font-style: italic; margin-bottom: 20px; text-align: center;">Reset Your Password</h2>
      <p style="text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(58, 28, 22, 0.4); margin-bottom: 40px;">Zoniraz Security Portal</p>
      
      <p>Dear ${user.name || "Valued Customer"},</p>
      <p>We received a request to reset the password for your Zoniraz account. If you did not make this request, you can safely ignore this email.</p>
      
      <div style="text-align: center; margin: 50px 0;">
        <a href="${resetUrl}" style="background-color: #3A1C16; color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      
      <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(58, 28, 22, 0.4); text-align: center;">This link will expire in 60 minutes.</p>
    `;

    const emailResult = await sendZonirazMail({
      to: emailLower,
      subject: "Zoniraz Password Reset Request",
      html: getLuxuryEmailTemplate(content),
    });

    if (!emailResult.success) {
      console.error("Failed to send password reset email:", emailResult.error);
      return NextResponse.json({ error: "Failed to send reset email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we have sent a password reset link.",
    });
  } catch (error: any) {
    console.error("Forgot Password API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

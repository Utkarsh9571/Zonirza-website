import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import OTPRequest from '@/models/OTPRequest';
import { otpService, normalizePhoneNumber } from '@/lib/otpService';

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const normalizedMobile = normalizePhoneNumber(identifier);
    if (!normalizedMobile) {
      return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 });
    }

    await dbConnect();

    // Enforce rate limiting & cooldown
    const rateLimit = await OTPRequest.findOne({ mobileNumber: normalizedMobile });
    const now = new Date();

    if (rateLimit) {
      // 1. Enforce 60-second resend cooldown
      const diffMs = now.getTime() - rateLimit.lastRequestedAt.getTime();
      if (diffMs < 60000) {
        const remainingSec = Math.ceil((60000 - diffMs) / 1000);
        return NextResponse.json({ 
          error: `Please wait ${remainingSec} seconds before requesting another OTP.` 
        }, { status: 429 });
      }

      // 2. Enforce max 5 attempts per hour
      if (rateLimit.attempts >= 5) {
        return NextResponse.json({ 
          error: 'Too many OTP requests. Please try again in an hour.' 
        }, { status: 429 });
      }

      // Update attempts and last requested timestamp
      rateLimit.attempts += 1;
      rateLimit.lastRequestedAt = now;
      rateLimit.expiresAt = new Date(now.getTime() + 3600000); // 1 hour window
      await rateLimit.save();
    } else {
      // Create new request tracker
      await OTPRequest.create({
        mobileNumber: normalizedMobile,
        attempts: 1,
        lastRequestedAt: now,
        expiresAt: new Date(now.getTime() + 3600000)
      });
    }

    // Call service to send OTP via MSG91 (or sandbox)
    const result = await otpService.sendOTP(normalizedMobile);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: result.message 
    });
  } catch (error: any) {
    console.error('OTP Send Route Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { otpService, normalizePhoneNumber } from '@/lib/otpService';

export async function POST(req: NextRequest) {
  try {
    const { identifier, otp } = await req.json();

    if (!identifier || !otp) {
      return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 });
    }

    const normalizedMobile = normalizePhoneNumber(identifier);
    if (!normalizedMobile) {
      return NextResponse.json({ error: 'Invalid mobile number format' }, { status: 400 });
    }

    // Call service to verify OTP via MSG91 (or sandbox)
    const result = await otpService.verifyOTP(normalizedMobile, otp);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    await dbConnect();

    // Check if the user is already logged in (active session)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (userId) {
      // Check if this mobile number is already linked to another account
      const duplicateUser = await User.findOne({ 
        mobileNumber: normalizedMobile,
        _id: { $ne: userId }
      });

      if (duplicateUser) {
        return NextResponse.json({ 
          error: 'This mobile number is already linked to another account' 
        }, { status: 400 });
      }

      // Link the mobile number to the active user profile
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'Logged-in user not found' }, { status: 404 });
      }

      user.mobileNumber = normalizedMobile;
      user.mobileVerified = true;
      if (!user.phone) {
        user.phone = normalizedMobile;
      }
      await user.save();

      return NextResponse.json({ 
        success: true, 
        message: 'Mobile number verified and linked successfully.',
        linked: true
      });
    }

    // Otherwise, just confirm verification (the client will trigger signIn next)
    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully.' 
    });
  } catch (error: any) {
    console.error('OTP Verify Route Error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}

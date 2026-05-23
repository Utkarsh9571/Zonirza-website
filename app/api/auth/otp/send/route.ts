import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    if (!identifier) {
      return NextResponse.json({ error: 'Email or Mobile number is required' }, { status: 400 });
    }

    // In a real application, we would generate a random 6 digit code
    // and send it via AWS SNS / Twilio / Nodemailer
    // const otp = Math.floor(100000 + Math.random() * 900000);
    
    // For this mock implementation, we log the action and expect '123456' on verification.
    console.log(`[MOCK OTP] Sent mock OTP '123456' to ${identifier}`);

    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully. Please enter 123456 for testing.' 
    });
  } catch (error: any) {
    console.error('OTP Send Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

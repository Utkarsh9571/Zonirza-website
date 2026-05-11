import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import FranchiseLead from '@/models/FranchiseLead';
import { sendZonirazMail, getLuxuryEmailTemplate } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, phone, city, message, investmentRange, businessBackground } = body;

    const franchiseLead = await FranchiseLead.create(body);

    // 1. Send Confirmation to User
    const userHtml = getLuxuryEmailTemplate(`
      <h2 style="font-weight: normal; font-style: italic;">Greetings ${name},</h2>
      <p>Thank you for your interest in joining the <strong>Zoniraz Legacy</strong>. We have received your franchise inquiry and our business development team is currently reviewing your application.</p>
      <p>At Zoniraz, we value partners who share our vision for timeless craftsmanship and luxury. You can expect a response from one of our expansion experts within 3-5 business days.</p>
      <div style="margin-top: 40px; border-top: 1px solid #f2ede4; pt: 20px;">
        <p style="font-size: 14px; font-style: italic;">Warm regards,<br/>The Zoniraz Expansion Team</p>
      </div>
    `);

    await sendZonirazMail({
      to: email,
      subject: "Your Franchise Inquiry with Zoniraz Luxury",
      html: userHtml
    });

    // 2. Send Notification to Business
    const businessHtml = getLuxuryEmailTemplate(`
      <h2 style="font-weight: normal; font-style: italic;">New Franchise Lead Received</h2>
      <table width="100%" cellpadding="10" style="border-collapse: collapse; margin-top: 20px;">
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Email:</strong></td><td>${email}</td></tr>
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Phone:</strong></td><td>${phone}</td></tr>
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Location:</strong></td><td>${city}</td></tr>
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Investment:</strong></td><td>${investmentRange || 'Not Specified'}</td></tr>
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Background:</strong></td><td>${businessBackground || 'Not Specified'}</td></tr>
        <tr><td><strong>Message:</strong></td><td>${message}</td></tr>
      </table>
    `);

    await sendZonirazMail({
      to: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER || "",
      subject: `FRANCHISE INQUIRY: ${name} - ${city}`,
      html: businessHtml
    });

    return NextResponse.json({ success: true, data: franchiseLead }, { status: 201 });
  } catch (error) {
    console.error('Franchise API Error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

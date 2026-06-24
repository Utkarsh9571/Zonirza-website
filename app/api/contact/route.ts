import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { sendZonirazMail, getLuxuryEmailTemplate } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, mobile, message, appointmentDate, appointmentSlot } = body;
    
    const contact = await Contact.create(body);

    // 1. Send Confirmation to User
    const userHtml = getLuxuryEmailTemplate(`
      <h2 style="font-weight: normal; font-style: italic;">Dear ${name},</h2>
      <p>Thank you for reaching out to <strong>Zoniraz Luxury</strong>. We have received your inquiry and our concierge team is already looking into your request.</p>
      ${appointmentDate ? `<p>We have also noted your preferred appointment time on <strong>${appointmentDate}</strong> at <strong>${appointmentSlot || 'Any Time'}</strong>. Our team will contact you shortly to confirm the appointment.</p>` : ''}
      <p>Providing exceptional service is at the heart of what we do. You can expect a personalized response from us within 24-48 hours.</p>
      <div style="margin-top: 40px; border-top: 1px solid #f2ede4; pt: 20px;">
        <p style="font-size: 14px; font-style: italic;">Sincerely,<br/>The Zoniraz Concierge Team</p>
      </div>
    `);

    await sendZonirazMail({
      to: email,
      subject: "We've Received Your Inquiry - Zoniraz Luxury",
      html: userHtml
    });

    // 2. Send Notification to Business
    const businessHtml = getLuxuryEmailTemplate(`
      <h2 style="font-weight: normal; font-style: italic;">New Customer Inquiry</h2>
      <table width="100%" cellpadding="10" style="border-collapse: collapse; margin-top: 20px;">
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Email:</strong></td><td>${email}</td></tr>
        <tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Mobile:</strong></td><td>${mobile}</td></tr>
        ${appointmentDate ? `<tr style="border-bottom: 1px solid #f2ede4;"><td><strong>Appointment Request:</strong></td><td>${appointmentDate} at ${appointmentSlot || 'Any Time'}</td></tr>` : ''}
        <tr><td><strong>Message:</strong></td><td>${message}</td></tr>
      </table>
    `);

    await sendZonirazMail({
      to: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER || "",
      subject: `CONTACT INQUIRY: ${name}`,
      html: businessHtml
    });
    
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

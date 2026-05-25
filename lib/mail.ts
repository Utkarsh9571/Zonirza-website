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
                    <img src="https://zoniraz.com/images/ZONIRAZ%20LOGO.png" alt="Zoniraz Logo" width="200" style="display: block; filter: brightness(0) invert(1);" />
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

/**
 * Sends a detailed order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail(order: any, customerEmail: string) {
  const itemsHtml = order.items.map((item: any) => `
    <div style="padding: 20px 0; border-bottom: 1px solid #f2ede4; display: flex; align-items: center;">
      <div style="flex: 1;">
        <p style="margin: 0; font-weight: bold; font-size: 14px; color: #3A1C16;">${item.name}</p>
        <p style="margin: 5px 0 0 0; font-size: 11px; color: rgba(58, 28, 22, 0.5); text-transform: uppercase;">Qty: ${item.quantity}</p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-weight: bold; font-size: 14px; color: #8B1D2F;">${order.currency} ${item.price.toLocaleString()}</p>
      </div>
    </div>
  `).join('');

  const content = `
    <h2 style="font-size: 28px; font-weight: normal; font-style: italic; margin-bottom: 20px; text-align: center;">A Masterpiece is Reserved</h2>
    <p style="text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(58, 28, 22, 0.4); margin-bottom: 40px;">Order Reference: #${order._id.toString().slice(-8).toUpperCase()}</p>
    
    <p>Dear ${order.shippingAddress.fullName},</p>
    <p>Thank you for choosing Zoniraz. Your selection of our handcrafted masterpieces has been secured and our artisans have been notified to begin their final inspection.</p>
    
    <div style="background-color: #fdfaf5; border: 1px solid #f2ede4; border-radius: 20px; padding: 30px; margin: 40px 0;">
      <h4 style="margin: 0 0 20px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #3A1C16; border-bottom: 1px solid #f2ede4; padding-bottom: 10px;">Order Summary</h4>
      ${itemsHtml}
      <div style="padding-top: 20px; display: flex; justify-content: space-between; align-items: baseline;">
        <p style="margin: 0; font-size: 18px; font-style: italic;">Grand Total</p>
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #3A1C16;">${order.currency} ${order.totalAmount.toLocaleString()}</p>
      </div>
    </div>

    <div style="margin-bottom: 40px;">
      <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #3A1C16;">Shipping To:</h4>
      <p style="margin: 0; font-size: 13px; color: rgba(58, 28, 22, 0.6); line-height: 1.6;">
        ${order.shippingAddress.addressLine1}, ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + ',' : ''}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} — ${order.shippingAddress.pincode}
      </p>
    </div>

    <div style="text-align: center; margin-top: 50px;">
      <a href="https://zoniraz.com/account/orders/${order._id}" style="background-color: #3A1C16; color: #ffffff; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em; font-weight: bold; display: inline-block;">Track Your Journey</a>
    </div>
  `;

  return sendZonirazMail({
    to: customerEmail,
    subject: `Your Zoniraz Masterpiece is Reserved: #${order._id.toString().slice(-8).toUpperCase()}`,
    html: getLuxuryEmailTemplate(content)
  });
}

/**
 * Notifies the admin about a new order
 */
export async function sendAdminNewOrderEmail(order: any) {
  const content = `
    <h2 style="font-size: 24px; margin-bottom: 20px;">New Order Received</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Customer:</strong> ${order.shippingAddress.fullName} (${order.shippingAddress.phone})</p>
    <p><strong>Total Amount:</strong> ${order.currency} ${order.totalAmount.toLocaleString()}</p>
    <p><strong>Items:</strong> ${order.items.length} unique pieces</p>
    <div style="margin-top: 30px;">
      <a href="https://zoniraz.com/admin/orders/${order._id}" style="background-color: #3A1C16; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-block;">View in Dashboard</a>
    </div>
  `;

  return sendZonirazMail({
    to: process.env.BUSINESS_EMAIL || "orders@zoniraz.com",
    subject: `New Order Alert: ${order.shippingAddress.fullName} - ${order.currency} ${order.totalAmount.toLocaleString()}`,
    html: getLuxuryEmailTemplate(content)
  });
}

/**
 * Sends a "Thank you for contacting us" email for Exchange inquiries
 */
export async function sendExchangeInquiryCustomerEmail(inquiry: any) {
  const content = `
    <h2 style="font-size: 24px; font-weight: normal; font-style: italic; margin-bottom: 20px; text-align: center;">Thank You for Your Inquiry</h2>
    
    <p>Dear ${inquiry.fullName},</p>
    <p>Thank you for showing interest in the Zoniraz Gold Exchange Program. We have successfully received your inquiry.</p>
    
    <p>Our luxury jewellery experts are currently reviewing your details and will get in touch with you shortly at <strong>${inquiry.phone}</strong> to guide you through the next steps of your exchange journey.</p>

    <div style="background-color: #fdfaf5; border: 1px solid #f2ede4; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
      <p style="margin: 0; font-size: 14px; font-style: italic; color: #3A1C16;">"Transform your cherished memories into timeless new masterpieces."</p>
    </div>

    <p>We look forward to welcoming you to our Alwar boutique.</p>
    <p>Warm regards,<br>The Zoniraz Team</p>
  `;

  return sendZonirazMail({
    to: inquiry.email,
    subject: "Zoniraz Exchange Program - Inquiry Received",
    html: getLuxuryEmailTemplate(content)
  });
}

/**
 * Notifies the admin about a new Exchange inquiry
 */
export async function sendExchangeInquiryAdminEmail(inquiry: any) {
  const content = `
    <h2 style="font-size: 24px; margin-bottom: 20px;">New Exchange Inquiry Received</h2>
    <div style="background-color: #fdfaf5; border: 1px solid #f2ede4; border-radius: 12px; padding: 20px;">
      <p><strong>Customer Name:</strong> ${inquiry.fullName}</p>
      <p><strong>Phone Number:</strong> ${inquiry.phone}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>City:</strong> ${inquiry.city || 'Not provided'}</p>
      <p><strong>Consultation Type:</strong> ${inquiry.consultationType || 'Phone'}</p>
    </div>
    
    <div style="margin-top: 30px;">
      <a href="https://zoniraz.com/admin/exchange" style="background-color: #3A1C16; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-block;">View in Admin Panel</a>
    </div>
  `;

  return sendZonirazMail({
    to: process.env.BUSINESS_EMAIL || "info@zoniraz.com",
    subject: `New Exchange Lead: ${inquiry.fullName}`,
    html: getLuxuryEmailTemplate(content)
  });
}

/**
 * Sends a "Thank you for contacting us" email for Sell Gold inquiries
 */
export async function sendSellGoldInquiryCustomerEmail(inquiry: any) {
  const content = `
    <h2 style="font-size: 24px; font-weight: normal; font-style: italic; margin-bottom: 20px; text-align: center;">Sell Old Gold - Inquiry Received</h2>
    
    <p>Dear ${inquiry.fullName},</p>
    <p>Thank you for showing interest in selling your old gold to Zoniraz. We have successfully received your inquiry.</p>
    
    <p>Our luxury jewellery experts are currently reviewing your details and will get in touch with you shortly via your preferred contact method (<strong>${inquiry.preferredContactMethod.toUpperCase()}</strong>) at <strong>${inquiry.preferredContactMethod === 'email' ? inquiry.email : inquiry.phone}</strong> to guide you through the next steps.</p>

    <div style="background-color: #fdfaf5; border: 1px solid #f2ede4; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
      <p style="margin: 0; font-size: 14px; font-style: italic; color: #3A1C16;">"Unlock the true value of your gold with our transparent, scientific evaluation process."</p>
      <p style="margin: 15px 0 0 0; font-size: 11px; font-weight: bold; color: #8B1D2F; text-transform: uppercase;">Please note: Physical valuation at our Alwar branch is mandatory for final pricing.</p>
    </div>

    <p>We look forward to welcoming you to our Alwar boutique.</p>
    <p>Warm regards,<br>The Zoniraz Team</p>
  `;

  if (!inquiry.email) return { success: true, skipped: true };

  return sendZonirazMail({
    to: inquiry.email,
    subject: "Zoniraz - Sell Gold Inquiry Received",
    html: getLuxuryEmailTemplate(content)
  });
}

/**
 * Notifies the admin about a new Sell Gold inquiry
 */
export async function sendSellGoldInquiryAdminEmail(inquiry: any) {
  const content = `
    <h2 style="font-size: 24px; margin-bottom: 20px;">New Sell Gold Inquiry Received</h2>
    <div style="background-color: #fdfaf5; border: 1px solid #f2ede4; border-radius: 12px; padding: 20px;">
      <p><strong>Customer Name:</strong> ${inquiry.fullName}</p>
      <p><strong>Phone Number:</strong> ${inquiry.phone}</p>
      <p><strong>Email:</strong> ${inquiry.email || 'Not provided'}</p>
      <p><strong>City:</strong> ${inquiry.city || 'Not provided'}</p>
      <p><strong>Jewellery Type:</strong> ${inquiry.jewelleryType || 'Not specified'}</p>
      <p><strong>Approx. Weight:</strong> ${inquiry.approximateWeight ? inquiry.approximateWeight + 'g' : 'Not specified'}</p>
      <p><strong>Preferred Contact:</strong> ${inquiry.preferredContactMethod.toUpperCase()}</p>
      <p><strong>Branch:</strong> ${inquiry.branch}</p>
    </div>
    
    <div style="margin-top: 30px;">
      <a href="https://zoniraz.com/admin/sell-gold" style="background-color: #3A1C16; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: bold; display: inline-block;">View in Admin Panel</a>
    </div>
  `;

  return sendZonirazMail({
    to: process.env.BUSINESS_EMAIL || "info@zoniraz.com",
    subject: `New Sell Gold Lead: ${inquiry.fullName}`,
    html: getLuxuryEmailTemplate(content)
  });
}

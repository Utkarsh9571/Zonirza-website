import { sendGiftCardEmail } from './mail';

export interface DeliveryResponse {
  success: boolean;
  messageId?: string;
  error?: any;
}

export interface DeliveryOptions {
  giftCard: any;
  senderName: string;
  recipientContact: string; // email address, phone number, etc.
}

export interface DeliveryChannelAdapter {
  send(options: DeliveryOptions): Promise<DeliveryResponse>;
}

/**
 * Adapter for Email delivery via Nodemailer
 */
export class EmailDeliveryAdapter implements DeliveryChannelAdapter {
  async send({ giftCard, senderName, recipientContact }: DeliveryOptions): Promise<DeliveryResponse> {
    try {
      console.log(`[EmailDeliveryAdapter] Sending gift card email to ${recipientContact}`);
      // Ensure the recipient email matches the contact
      const modifiedCard = {
        ...giftCard.toObject ? giftCard.toObject() : giftCard,
        recipientEmail: recipientContact,
      };
      const result = await sendGiftCardEmail(modifiedCard, senderName);
      return {
        success: result?.success || false,
        messageId: result?.messageId,
        error: result?.error,
      };
    } catch (error) {
      console.error('[EmailDeliveryAdapter] Error sending email:', error);
      return { success: false, error };
    }
  }
}

/**
 * Adapter for WhatsApp delivery (Stub prepared for MSG91 or Twilio WhatsApp API)
 */
export class WhatsAppDeliveryAdapter implements DeliveryChannelAdapter {
  async send({ giftCard, senderName, recipientContact }: DeliveryOptions): Promise<DeliveryResponse> {
    console.log(`[WhatsAppDeliveryAdapter] [STUB] Preparing WhatsApp gift voucher dispatch...`);
    console.log(`To: ${recipientContact}`);
    console.log(`Sender: ${senderName}`);
    console.log(`Code: ${giftCard.code}, Amount: ₹${giftCard.initialAmount}`);
    console.log(`Link: https://example.com/gift-cards/redeem?code=${giftCard.code}&pin=${giftCard.pin}`);
    
    // Future integration code snippet for MSG91:
    /*
    const url = 'https://api.msg91.com/api/v5/flow/';
    const payload = {
      template_id: process.env.MSG91_WHATSAPP_TEMPLATE_ID,
      sender: process.env.MSG91_WHATSAPP_SENDER,
      recipients: [{
        mobiles: recipientContact,
        sender_name: senderName,
        card_amount: giftCard.initialAmount,
        redeem_link: `https://example.com/gift-cards/redeem?code=${giftCard.code}&pin=${giftCard.pin}`
      }]
    };
    await fetch(url, {
      method: 'POST',
      headers: { 'authkey': process.env.MSG91_AUTH_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    */
    
    return { success: true, messageId: `wa_stub_${Math.random().toString(36).substr(2, 9)}` };
  }
}

/**
 * Adapter for SMS delivery (Stub prepared for Twilio SMS API)
 */
export class SMSDeliveryAdapter implements DeliveryChannelAdapter {
  async send({ giftCard, senderName, recipientContact }: DeliveryOptions): Promise<DeliveryResponse> {
    console.log(`[SMSDeliveryAdapter] [STUB] Preparing SMS gift voucher dispatch...`);
    console.log(`To: ${recipientContact}`);
    console.log(`Sender: ${senderName}`);
    console.log(`Content: Hello ${giftCard.recipientName}, ${senderName} sent you a ₹${giftCard.initialAmount} Luxury Jewelry Gift Card! Redeem here: https://example.com/gift-cards/redeem?code=${giftCard.code}`);
    
    // Future integration code snippet for Twilio:
    /*
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const msg = await client.messages.create({
       body: `Hello ${giftCard.recipientName}, ${senderName} has sent you a ₹${giftCard.initialAmount} Luxury Jewelry Gift Card. Reveal your gift here: https://example.com/gift-cards/redeem?code=${giftCard.code}&pin=${giftCard.pin}`,
       from: process.env.TWILIO_PHONE_NUMBER,
       to: recipientContact
     });
    */
    
    return { success: true, messageId: `sms_stub_${Math.random().toString(36).substr(2, 9)}` };
  }
}

/**
 * Orchestrator manager for gift card delivery channels
 */
export class DeliveryManager {
  private adapters: Record<string, DeliveryChannelAdapter> = {
    email: new EmailDeliveryAdapter(),
    whatsapp: new WhatsAppDeliveryAdapter(),
    sms: new SMSDeliveryAdapter(),
  };

  async deliver(channel: 'email' | 'whatsapp' | 'sms', options: DeliveryOptions): Promise<DeliveryResponse> {
    const adapter = this.adapters[channel];
    if (!adapter) {
      throw new Error(`Unsupported delivery channel: ${channel}`);
    }
    return adapter.send(options);
  }
}

export const deliveryManager = new DeliveryManager();

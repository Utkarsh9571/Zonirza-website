import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

/**
 * Server-side verification of Razorpay payment signature
 */
export const verifyRazorpaySignature = (
  orderId: string, 
  paymentId: string, 
  signature: string
): boolean => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    const body = `${orderId}|${paymentId}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');
      
    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

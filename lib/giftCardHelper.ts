import crypto from 'crypto';
import dbConnect from './db';
import GiftCard from '@/models/GiftCard';
import GiftCardTransaction from '@/models/GiftCardTransaction';
import Order from '@/models/Order';
import User from '@/models/User';
import { sendGiftCardEmail } from './mail';

/**
 * Generates a cryptographically secure, legible Gift Card code.
 * Format: ZGFT-XXXX-XXXX
 * Excludes confusing characters (0, O, 1, I) to ensure legibility.
 */
export function generateSecureCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let part1 = '';
  let part2 = '';
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 4; i++) {
    part1 += chars[bytes[i] % chars.length];
    part2 += chars[bytes[i + 4] % chars.length];
  }
  return `ZGFT-${part1}-${part2}`;
}

/**
 * Generates a cryptographically secure unique Gift Card code, verifying collisions.
 */
export async function generateUniqueCode(): Promise<string> {
  await dbConnect();
  let code = generateSecureCode();
  let exists = await GiftCard.findOne({ code });
  while (exists) {
    code = generateSecureCode();
    exists = await GiftCard.findOne({ code });
  }
  return code;
}

/**
 * Generates a cryptographically secure 6-digit numeric PIN.
 */
export function generateSecurePin(): string {
  const bytes = crypto.randomBytes(4);
  const val = (bytes.readUInt32BE(0) % 900000) + 100000; // Force 6-digits (100000 to 999999)
  return val.toString();
}

/**
 * Activates a pending gift card associated with a successful payment order.
 * This is triggered upon Razorpay payment capture (verify or webhooks).
 */
export async function activateGiftCardForOrder(orderId: string): Promise<boolean> {
  await dbConnect();
  
  const order = await Order.findById(orderId);
  if (!order) {
    console.error(`[GIFT CARD] Order ${orderId} not found during activation.`);
    return false;
  }

  // Find the associated pending gift card
  const giftCard = await GiftCard.findOne({ purchasedOrderId: order._id, status: 'pending' });
  if (!giftCard) {
    // Gift card might already be active (handled by duplicate hook/verify request)
    console.log(`[GIFT CARD] Pending gift card not found for order ${orderId}. Already processed?`);
    return false;
  }

  // Update GiftCard fields
  const isFutureScheduled = (giftCard.scheduledFor || giftCard.scheduledAt) && new Date(giftCard.scheduledFor || giftCard.scheduledAt) > new Date();
  
  if (isFutureScheduled) {
    giftCard.status = 'pending';
    giftCard.deliveryStatus = 'pending';
  } else {
    giftCard.status = 'active';
    giftCard.issuedAt = new Date();
    giftCard.deliveryStatus = 'delivered';
    giftCard.deliveredAt = new Date();
  }
  
  // Expiration date (default 1 year from now)
  const expDate = new Date();
  expDate.setFullYear(expDate.getFullYear() + 1);
  giftCard.expirationDate = giftCard.expirationDate || expDate;

  await giftCard.save();

  // Log transaction
  if (!isFutureScheduled) {
    await GiftCardTransaction.create({
      giftCardId: giftCard._id,
      type: 'issued',
      amount: giftCard.initialAmount,
      balanceBefore: 0,
      balanceAfter: giftCard.initialAmount,
      relatedOrderId: order._id,
      actorUserId: order.userId,
      metadata: { notes: 'Activated and dispatched immediately' }
    });
  } else {
    await GiftCardTransaction.create({
      giftCardId: giftCard._id,
      type: 'adjusted',
      amount: 0,
      balanceBefore: 0,
      balanceAfter: 0,
      relatedOrderId: order._id,
      actorUserId: order.userId,
      metadata: { notes: `Voucher purchased and queued for scheduled delivery on ${giftCard.scheduledFor || giftCard.scheduledAt}` }
    });
  }

  // Fetch sender name
  let senderName = 'A Generous Friend';
  if (order.userId) {
    const sender = await User.findById(order.userId);
    if (sender && sender.name) {
      senderName = sender.name;
    }
  }

  // Dispatch luxury email only if not scheduled for future
  if (!isFutureScheduled) {
    try {
      const mailResult = await sendGiftCardEmail(giftCard, senderName);
      console.log(`[GIFT CARD] Recipient notified successfully. Message ID: ${mailResult?.messageId}`);
    } catch (err) {
      console.error('[GIFT CARD] Failed to dispatch recipient email:', err);
    }
  } else {
    console.log(`[GIFT CARD] Email dispatch deferred. Delivery scheduled for: ${giftCard.scheduledFor || giftCard.scheduledAt}`);
  }

  return true;
}

/**
 * Refunds a gift card's applied balance if the order payment fails or gets cancelled.
 */
export async function refundGiftCardForOrder(orderId: string): Promise<boolean> {
  await dbConnect();

  const order = await Order.findById(orderId);
  if (!order) return false;

  // Retrieve applied gift card properties from order
  const giftCardCode = (order as any).giftCardCode || (order as any).couponCode; // Check both standard & fallback
  const giftCardAmount = (order as any).giftCardAmountRedeemed || 0;

  if (!giftCardCode || giftCardAmount <= 0) {
    return false;
  }

  // Find the gift card
  const giftCard = await GiftCard.findOne({ code: giftCardCode });
  if (!giftCard) {
    console.error(`[GIFT CARD] Gift card ${giftCardCode} not found for refunding order ${orderId}`);
    return false;
  }

  // Check if a refund has already been processed for this order to prevent duplicate adjustments
  const existingRefundTx = await GiftCardTransaction.findOne({
    giftCardId: giftCard._id,
    type: 'refunded',
    relatedOrderId: order._id
  });

  if (existingRefundTx) {
    console.log(`[GIFT CARD] Refund already processed for gift card ${giftCardCode} and order ${orderId}`);
    return false;
  }

  // Read transaction records to fetch balance before redemption
  const lastRedeemedTx = await GiftCardTransaction.findOne({
    giftCardId: giftCard._id,
    type: 'redeemed',
    relatedOrderId: order._id
  }).sort({ createdAt: -1 });

  if (!lastRedeemedTx) {
    console.error(`[GIFT CARD] No matching redemption transaction found for order ${orderId}`);
    return false;
  }

  const balanceBefore = giftCard.currentBalance;
  const balanceAfter = balanceBefore + giftCardAmount;

  // Update balance atomically
  await GiftCard.findByIdAndUpdate(giftCard._id, {
    $inc: { currentBalance: giftCardAmount },
    $set: {
      status: balanceAfter === giftCard.initialAmount ? 'active' : 'partially_redeemed',
      lastUsedAt: new Date()
    }
  });

  // Log refund transaction
  await GiftCardTransaction.create({
    giftCardId: giftCard._id,
    type: 'refunded',
    amount: giftCardAmount,
    balanceBefore,
    balanceAfter,
    relatedOrderId: order._id,
    actorUserId: order.userId,
    metadata: { notes: `Reverted balance due to failed payment on order ${orderId}` }
  });

  console.log(`[GIFT CARD] Successfully refunded ₹${giftCardAmount} back to card ${giftCardCode}`);
  return true;
}

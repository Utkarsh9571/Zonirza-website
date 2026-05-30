import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { deliveryManager } from '@/lib/deliveryChannels';

export async function GET(req: NextRequest) {
  return handleCron();
}

export async function POST(req: NextRequest) {
  return handleCron();
}

async function handleCron() {
  try {
    await dbConnect();

    // Dynamically import models to prevent circular reference compilation issues
    const GiftCard = (await import('@/models/GiftCard')).default;
    const User = (await import('@/models/User')).default;

    const now = new Date();
    
    // Find pending scheduled gift cards where scheduled time is in the past
    const pendingCards = await GiftCard.find({
      status: 'pending',
      deliveryStatus: 'pending',
      $or: [
        { scheduledFor: { $lte: now } },
        { scheduledAt: { $lte: now } }
      ]
    });

    console.log(`[CRON GIFT CARDS] Found ${pendingCards.length} gift cards pending delivery.`);

    const results = [];
    const GiftCardTransaction = (await import('@/models/GiftCardTransaction')).default;

    for (const giftCard of pendingCards) {
      let senderName = 'A Generous Friend';
      
      try {
        if (giftCard.senderUserId) {
          const sender = await User.findById(giftCard.senderUserId);
          if (sender && sender.name) {
            senderName = sender.name;
          }
        } else if (giftCard.createdByAdmin) {
          senderName = 'Zoniraz Curator';
        }

        // Deliver via the manager
        const deliveryResult = await deliveryManager.deliver('email', {
          giftCard,
          senderName,
          recipientContact: giftCard.recipientEmail
        });

        if (deliveryResult.success) {
          // Activate card
          giftCard.status = 'active';
          giftCard.deliveryStatus = 'delivered';
          giftCard.deliveredAt = new Date();
          giftCard.issuedAt = new Date();
          await giftCard.save();

          // Log transaction ledger
          await GiftCardTransaction.create({
            giftCardId: giftCard._id,
            type: 'issued',
            amount: giftCard.initialAmount,
            balanceBefore: 0,
            balanceAfter: giftCard.initialAmount,
            actorUserId: giftCard.senderUserId || undefined,
            metadata: { notes: `Activated and delivered via cron on scheduled date: ${giftCard.scheduledFor || giftCard.scheduledAt}` }
          });

          console.log(`[CRON GIFT CARDS] Successfully activated and delivered code ${giftCard.code} to ${giftCard.recipientEmail}`);
          results.push({ code: giftCard.code, recipient: giftCard.recipientEmail, success: true });
        } else {
          giftCard.deliveryStatus = 'failed';
          await giftCard.save();
          
          console.error(`[CRON GIFT CARDS] Delivery failed for code ${giftCard.code} to ${giftCard.recipientEmail}`);
          results.push({ code: giftCard.code, recipient: giftCard.recipientEmail, success: false, error: deliveryResult.error });
        }
      } catch (cardErr: any) {
        console.error(`[CRON GIFT CARDS] Error processing card ${giftCard.code}:`, cardErr);
        results.push({ code: giftCard.code, success: false, error: cardErr.message });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: pendingCards.length,
      timestamp: now,
      results
    });
  } catch (error: any) {
    console.error('[CRON GIFT CARDS] Cron Job Execution Failure:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

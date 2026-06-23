import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Missing orderId' }, { status: 400 });
    }

    await dbConnect();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Only allow abandoning pending orders
    if (order.paymentStatus === 'pending') {
      order.paymentStatus = 'abandoned';
      order.orderStatus = 'abandoned';
      order.abandonedAt = new Date();
      order.timeline.push({
        status: 'abandoned',
        date: new Date(),
        notes: 'Order marked as abandoned by customer'
      });

      await order.save();

      // 1. Revert locked Digi Gold balance
      if (order.digiGoldRedeemedAmount && order.digiGoldRedeemedAmount > 0) {
        try {
          const { unlockWalletBalance } = await import('@/lib/digiGoldRedemption');
          await unlockWalletBalance(order.userId.toString(), order._id.toString());
        } catch (e) {
          console.error('Failed to unlock Digi Gold balance for abandoned order:', e);
        }
      }

      // 2. Refund Gift Card balance
      if (order.giftCardCode && order.giftCardAmountRedeemed > 0) {
        try {
          const { refundGiftCardForOrder } = await import('@/lib/giftCardHelper');
          await refundGiftCardForOrder(order._id.toString());
        } catch (e) {
          console.error('Failed to refund Gift Card balance for abandoned order:', e);
        }
      }

      // 3. Revert associated pending GiftCard if it's a giftcard purchase
      try {
        const GiftCard = (await import('@/models/GiftCard')).default;
        const pendingGC = await GiftCard.findOne({ purchasedOrderId: order._id, status: 'pending' });
        if (pendingGC) {
          pendingGC.status = 'cancelled';
          await pendingGC.save();
        }
      } catch (e) {
        console.error('Failed to revert pending gift card purchase:', e);
      }

      return NextResponse.json({ success: true, message: 'Order abandoned successfully and resources reverted.' });
    }

    return NextResponse.json({ success: false, error: 'Order is not in pending status' }, { status: 400 });
  } catch (error: any) {
    console.error('Error abandoning order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

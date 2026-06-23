import Order from '@/models/Order';

export async function cleanupPendingOrders() {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const pendingOrders = await Order.find({
      paymentStatus: 'pending',
      createdAt: { $lt: fifteenMinutesAgo }
    });
    
    console.log(`[ORDER CLEANUP] Found ${pendingOrders.length} expired pending orders.`);
    
    for (const order of pendingOrders) {
      try {
        order.paymentStatus = 'abandoned';
        order.orderStatus = 'abandoned';
        order.abandonedAt = new Date();
        order.timeline.push({
          status: 'abandoned',
          date: new Date(),
          notes: 'Auto-abandoned: payment window expired (15 minutes)'
        });
        await order.save();
        
        // Revert locked Digi Gold
        if (order.digiGoldRedeemedAmount && order.digiGoldRedeemedAmount > 0) {
          try {
            const { unlockWalletBalance } = await import('@/lib/digiGoldRedemption');
            await unlockWalletBalance(order.userId.toString(), order._id.toString());
            console.log(`[ORDER CLEANUP] Unlocked Digi Gold balance for order ${order._id}`);
          } catch (e) {
            console.error(`[ORDER CLEANUP] Failed to unlock Digi Gold for order ${order._id}:`, e);
          }
        }
        
        // Refund Gift Card
        if (order.giftCardCode && order.giftCardAmountRedeemed > 0) {
          try {
            const { refundGiftCardForOrder } = await import('@/lib/giftCardHelper');
            await refundGiftCardForOrder(order._id.toString());
            console.log(`[ORDER CLEANUP] Refunded Gift Card balance for order ${order._id}`);
          } catch (e) {
            console.error(`[ORDER CLEANUP] Failed to refund Gift Card for order ${order._id}:`, e);
          }
        }

        // Revert associated pending GiftCard if it's a giftcard purchase
        try {
          const GiftCard = (await import('@/models/GiftCard')).default;
          const pendingGC = await GiftCard.findOne({ purchasedOrderId: order._id, status: 'pending' });
          if (pendingGC) {
            pendingGC.status = 'cancelled';
            await pendingGC.save();
            console.log(`[ORDER CLEANUP] Cancelled associated pending gift card for order ${order._id}`);
          }
        } catch (e) {
          console.error(`[ORDER CLEANUP] Failed to cancel pending gift card for order ${order._id}:`, e);
        }
      } catch (err) {
        console.error(`[ORDER CLEANUP] Error cleaning up pending order ${order._id}:`, err);
      }
    }
  } catch (err) {
    console.error('[ORDER CLEANUP] Error during cleanupPendingOrders:', err);
  }
}

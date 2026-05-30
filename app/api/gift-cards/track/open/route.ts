import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const code = searchParams.get('code');

    if (id || code) {
      await dbConnect();
      const GiftCard = (await import('@/models/GiftCard')).default;
      
      const filter: any = {};
      if (id) filter._id = id;
      else if (code) filter.code = code;

      const giftCard = await GiftCard.findOne(filter);
      
      if (giftCard && !giftCard.openedAt) {
        giftCard.openedAt = new Date();
        await giftCard.save();
        console.log(`[TRACKING PIXEL] Marked gift card ${giftCard.code} as opened.`);
      }
    }
  } catch (error) {
    console.error('[TRACKING PIXEL] Error recording open tracking:', error);
  }

  // Serve a 1x1 transparent GIF
  const trackingPixelBase64 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const pixelBuffer = Buffer.from(trackingPixelBase64, 'base64');

  return new Response(pixelBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

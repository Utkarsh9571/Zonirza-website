import dbConnect from '@/lib/db';
import GoldRateSnapshot from '@/models/GoldRateSnapshot';

export interface BaseGoldRate {
  buyRate24K: number;
  sellRate24K: number;
  gst: number;
  timestamp: Date;
}

/**
 * Fetches the current live gold rate.
 * Abstracts the source so we can swap to an external API later.
 */
export async function getLiveGoldRate(): Promise<BaseGoldRate | null> {
  await dbConnect();
  
  // Currently fetching from admin-controlled snapshots
  const rate = await GoldRateSnapshot.findOne({ active: true }).sort({ createdAt: -1 });
  
  if (!rate) return null;

  return {
    buyRate24K: rate.buyRate24K,
    sellRate24K: rate.sellRate24K,
    gst: rate.gst,
    timestamp: rate.createdAt || new Date(),
  };
}

/**
 * Fetches historical gold rates for charts and valuation trends.
 * @param days Number of days to look back
 */
export async function getHistoricalGoldRates(days: number = 30): Promise<BaseGoldRate[]> {
  await dbConnect();
  
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  // Fetch all snapshots in the time period
  const rates = await GoldRateSnapshot.find({ 
    createdAt: { $gte: dateLimit } 
  }).sort({ createdAt: 1 });

  return rates.map((r: any) => ({
    buyRate24K: r.buyRate24K,
    sellRate24K: r.sellRate24K,
    gst: r.gst,
    timestamp: r.createdAt,
  }));
}

/**
 * Fetches the rate that was active at a specific timestamp.
 */
export async function getGoldRateAtTimestamp(date: Date): Promise<BaseGoldRate | null> {
  await dbConnect();
  
  // Find the most recent rate that was created ON or BEFORE the target date
  const rate = await GoldRateSnapshot.findOne({
    createdAt: { $lte: date }
  }).sort({ createdAt: -1 });

  if (!rate) return null;

  return {
    buyRate24K: rate.buyRate24K,
    sellRate24K: rate.sellRate24K,
    gst: rate.gst,
    timestamp: rate.createdAt,
  };
}

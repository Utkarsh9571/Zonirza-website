import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import DigitalGoldWallet from '@/models/DigitalGoldWallet';
import DigitalGoldTransaction from '@/models/DigitalGoldTransaction';
import User from '@/models/User'; // Ensure User model is loaded

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const wallets = await DigitalGoldWallet.find().populate('userId', 'name email').sort({ totalGrams: -1 });
    
    // Aggregate stats
    const totalGrams = wallets.reduce((acc, w) => acc + w.totalGrams, 0);
    const totalInvestment = wallets.reduce((acc, w) => acc + w.totalInvestment, 0);

    const recentTransactions = await DigitalGoldTransaction.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({ 
      success: true, 
      data: {
        wallets,
        stats: {
          totalWallets: wallets.length,
          totalGrams,
          totalInvestment
        },
        recentTransactions
      }
    });
  } catch (error: any) {
    console.error('Error fetching admin wallets:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

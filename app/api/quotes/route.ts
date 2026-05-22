import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QuoteRequest from '@/models/QuoteRequest';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Product from '@/models/Product';
import { generateQuoteEstimation } from '@/lib/quoteEstimation';

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const product = await Product.findById(body.product);
    let estimationData = {};

    if (product) {
      try {
        const estimateResult = await generateQuoteEstimation({
          product,
          configuration: body.configuration,
          customizationNotes: body.customizationNotes,
          inspirationImages: body.inspirationImages || [],
          rates: { INR: 1 } // Assuming default INR for estimation base
        });
        estimationData = {
          complexity: estimateResult.complexity,
          estimation: estimateResult.estimation,
          productionInsights: estimateResult.productionInsights
        };
      } catch (err) {
        console.error('Estimation generation failed:', err);
      }
    }

    const newQuote = new QuoteRequest({
      ...body,
      ...estimationData,
      user: (session?.user as any)?.id || undefined,
    });

    await newQuote.save();

    return NextResponse.json({ success: true, quote: newQuote });
  } catch (error: any) {
    console.error('Error creating quote request:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    // Only authenticated users can fetch their quotes
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Admins can fetch all quotes via the admin route, this is for users fetching their own
    const { searchParams } = new URL(req.url);
    const userId = (session.user as any).id;
    
    const quotes = await QuoteRequest.find({ user: userId })
      .populate('product', 'name images slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, quotes });
  } catch (error: any) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

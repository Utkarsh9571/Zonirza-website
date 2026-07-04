'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Coins } from 'lucide-react';
import { Button } from '@/components/new-ui/Button';
import { useAuthModalStore } from '@/store/authModalStore';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function DigiGoldCalculator() {
  const { data: session } = useSession();
  const router = useRouter();
  const { openAuthModal } = useAuthModalStore();
  const { data, error, isLoading } = useSWR('/api/digi-gold/rate', fetcher);
  
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'exchange'>('buy');
  const [inrAmount, setInrAmount] = useState<string>('');
  const [grams, setGrams] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const rate = data?.data;
  
  // Effective buy rate including GST
  const effectiveBuyRate = rate ? rate.buyRate24K * (1 + rate.gst / 100) : 0;

  const handleInrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInrAmount(val);
    if (val && effectiveBuyRate) {
      setGrams((Number(val) / effectiveBuyRate).toFixed(4));
    } else {
      setGrams('');
    }
  };

  const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGrams(val);
    if (val && effectiveBuyRate) {
      setInrAmount(Math.round(Number(val) * effectiveBuyRate).toString());
    } else {
      setInrAmount('');
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    if (!session) {
      openAuthModal();
      return;
    }

    const amount = Number(inrAmount);
    if (amount < 100) {
      alert('Minimum amount is ₹100');
      return;
    }

    setIsProcessing(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error('Razorpay SDK failed to load');

      const res = await fetch('/api/razorpay/digi-gold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      const orderData = await res.json();
      if (!orderData.success) throw new Error(orderData.error || 'Initialization failed');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Digital Gold Savings",
        description: "Secure Digital Gold Savings",
        image: "/images/default-image.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // After payment, verification handled by webhook, but we verify here for fast UI feedback
          try {
            // Note: Since we rely on webhook for actual wallet credit, we can just redirect to success
            router.push(`/account/digi-gold`);
          } catch (err) {
            console.error('Callback error:', err);
            router.push(`/account/digi-gold`);
          }
        },
        prefill: {
          name: session.user?.name || '',
          email: session.user?.email || '',
        },
        theme: {
          color: "#D4AF37",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error(err);
      alert('Purchase failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[40px] p-8 border border-brand-text/5 shadow-soft flex items-center justify-center min-h-100">
        <Loader2 className="animate-spin text-brand-gold h-8 w-8" />
      </div>
    );
  }

  if (error || !rate) {
    return (
      <div className="bg-white rounded-[40px] p-8 border border-brand-text/5 shadow-soft min-h-100 flex items-center justify-center text-red-500">
        Failed to load live rates.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] border border-brand-gold shadow-premium overflow-hidden">
      <div className="flex border-b border-brand-text/10">
        <button 
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-4 text-center font-bold text-[11px] uppercase tracking-widest transition-colors ${activeTab === 'buy' ? 'bg-brand-gold/10 text-brand-gold border-b-2 border-brand-gold' : 'text-brand-text/50 hover:bg-brand-text/5'}`}
        >
          Buy Gold
        </button>
        <button 
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-4 text-center font-bold text-[11px] uppercase tracking-widest transition-colors ${activeTab === 'sell' ? 'bg-brand-gold/10 text-brand-gold border-b-2 border-brand-gold' : 'text-brand-text/50 hover:bg-brand-text/5'}`}
        >
          Sell Gold
        </button>
        <button 
          onClick={() => setActiveTab('exchange')}
          className={`flex-1 py-4 text-center font-bold text-[11px] uppercase tracking-widest transition-colors ${activeTab === 'exchange' ? 'bg-brand-gold/10 text-brand-gold border-b-2 border-brand-gold' : 'text-brand-text/50 hover:bg-brand-text/5'}`}
        >
          Exchange
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'buy' ? (
          <div className="space-y-8 animate-in fade-in">
            <div className="text-center space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-brand-text/50 font-bold">Live Buy Rate (24K, 99.9%)</p>
              <p className="text-3xl font-serif text-brand-text">₹{rate.buyRate24K.toLocaleString()} <span className="text-lg">/ g</span></p>
              <p className="text-[10px] text-brand-gold font-bold">+ {rate.gst}% GST applicable</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-text/60 font-bold">Invest Amount (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-brand-text font-bold">₹</span>
                  </div>
                  <input 
                    type="number"
                    value={inrAmount}
                    onChange={handleInrChange}
                    className="w-full h-14 pl-10 pr-4 bg-brand-bg rounded-xl border border-brand-text/10 focus:border-brand-gold/50 outline-none font-bold text-lg transition-colors"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-text/60 font-bold">Gold Quantity (g)</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={grams}
                    onChange={handleGramsChange}
                    className="w-full h-14 px-4 pr-10 bg-brand-bg rounded-xl border border-brand-text/10 focus:border-brand-gold/50 outline-none font-bold text-lg transition-colors"
                    placeholder="Enter grams"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <span className="text-brand-text/50 font-bold text-sm">g</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handlePurchase} 
              disabled={isProcessing || (session ? (!inrAmount || Number(inrAmount) < 100) : false)}
              className="w-full py-4 text-[12px] uppercase tracking-[0.2em]"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={18} /> : (session ? 'Proceed to Pay' : 'Login to Buy')}
            </Button>
            
            <p className="text-center text-[10px] text-brand-text/80">Minimum purchase amount is ₹100.</p>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-brand-bg flex items-center justify-center text-brand-text/30">
              <Coins size={24} />
            </div>
            <h3 className="text-xl font-serif text-brand-text">Coming Soon</h3>
            <p className="text-xs text-brand-text/50 max-w-50">
              {activeTab === 'sell' ? 'Selling digital gold' : 'Exchanging digital gold for jewellery'} will be available in the next update.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

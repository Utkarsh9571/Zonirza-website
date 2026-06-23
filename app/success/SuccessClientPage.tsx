'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Truck, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/new-ui/Button';
import { Section } from '@/components/new-ui/Section';
import { useCartStore } from '@/store/cartStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [isUpdating, setIsUpdating] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('order_id');
    
    if (id) {
      setTimeout(() => setOrderId(id), 0);
      // In a real app, we'd verify the paymentId with Razorpay here or via webhook
      // For now, we simulate the verification and clear the cart
      clearCart();
      setTimeout(() => setIsUpdating(false), 0);
    } else {
      router.push('/');
    }
  }, [searchParams, clearCart, router]);

  if (isUpdating) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="w-12 h-12 text-brand-gold animate-spin mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text/40">Securing Your Masterpiece...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-32 pb-20 overflow-x-hidden">
      <Section className="max-w-250 mx-auto px-6">
        <div className="bg-white rounded-[60px] p-10 md:p-20 shadow-premium border border-brand-text/5 text-center space-y-12 animate-in fade-in zoom-in duration-1000">
          
          <div className="space-y-6">
            <div className="w-24 h-24 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-8 shadow-soft border border-green-100">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif text-brand-text">A Journey Begins</h1>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-brand-text/40 font-bold max-w-md mx-auto leading-relaxed">
              Your order has been secured. Our artisans are now preparing your selected masterpieces for their final inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-brand-text/5">
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-brand-text/30">Order Reference</p>
              <p className="text-sm font-bold text-brand-text tracking-widest"># {orderId?.slice(-8).toUpperCase()}</p>
            </div>
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-brand-text/30">Estimated Delivery</p>
              <p className="text-sm font-bold text-brand-text tracking-widest italic">12th - 15th May</p>
            </div>
            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-brand-text/30">Shipping Method</p>
              <p className="text-sm font-bold text-brand-text tracking-widest">Insured Express</p>
            </div>
          </div>

          <div className="space-y-8 pt-4">
            <div className="bg-brand-bg/50 rounded-[40px] p-8 md:p-10 border border-brand-text/5 space-y-6">
              <div className="flex items-center justify-center space-x-4 text-brand-gold">
                <Truck size={24} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Live Tracking Initiated</span>
              </div>
              <p className="text-[10px] text-brand-text/50 uppercase tracking-widest leading-relaxed">
                You will receive a confirmation email shortly with your digital invoice and real-time tracking credentials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/account?tab=orders" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto px-12 py-6 border-brand-text/10 text-brand-text hover:bg-brand-text hover:text-white transition-all shadow-soft">
                  View My Orders
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto px-12 py-6 shadow-premium">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          <div className="pt-8">
             <button className="flex items-center space-x-3 mx-auto text-[10px] font-bold uppercase tracking-widest text-brand-text/30 hover:text-brand-text transition-colors">
                <Download size={14} />
                <span>Download Digital Certificate</span>
             </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function SuccessClientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

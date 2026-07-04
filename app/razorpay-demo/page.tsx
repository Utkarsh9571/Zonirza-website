'use client';

import { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, AlertCircle, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RazorpayDemoPage() {
  const [amount, setAmount] = useState<number>(1000); // default 1000 paise (10 INR)
  const [currency, setCurrency] = useState<string>('INR');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    status: 'idle' | 'success' | 'failed';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

  // Load Razorpay checkout script dynamically
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus({ status: 'idle', message: '' });

    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 2. Create order on the backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt: `demo_${Date.now()}` }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create payment order.');
      }

      // 3. Open Razorpay Standard Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Luxury Jewelers',
        description: 'Standard Checkout Integration Demo',
        image: '/images/hero-bg.avif',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          setIsLoading(true);
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaymentStatus({
                status: 'success',
                message: 'Payment verified and captured successfully!',
                details: response,
              });
            } else {
              setPaymentStatus({
                status: 'failed',
                message: verifyData.error || 'Payment signature verification failed.',
                details: response,
              });
            }
          } catch (err: any) {
            setPaymentStatus({
              status: 'failed',
              message: 'Failed to complete signature verification.',
            });
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            setPaymentStatus({
              status: 'failed',
              message: 'Payment flow was cancelled or closed by user.',
            });
          },
        },
        prefill: {
          name: 'Demo User',
          email: 'demo@example.com',
          contact: '9999999999',
        },
        notes: {
          environment: 'Development Demo',
        },
        theme: {
          color: '#D4AF37', // Brand Gold Accent
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        setPaymentStatus({
          status: 'failed',
          message: response.error?.description || 'Payment transaction failed.',
          details: response.error,
        });
      });

      rzp.open();
    } catch (err: any) {
      console.error(err);
      setPaymentStatus({
        status: 'failed',
        message: err.message || 'Something went wrong while initializing payment.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text transition-colors mb-8">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-brand-white rounded-[40px] border border-brand-text/5 shadow-premium p-8 md:p-12 space-y-8 transition-colors duration-500">
          
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-brand-gold/10 text-brand-gold">
              <Sparkles size={28} />
            </div>
            <h1 className="text-3xl font-serif">Razorpay Checkout</h1>
            <p className="text-xs uppercase tracking-widest text-brand-text/40 font-bold">Standard Web Integration sandbox</p>
          </div>

          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/50 block">Amount (in paise)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  placeholder="e.g. 1000 paise"
                  className="w-full h-14 bg-brand-bg dark:bg-white/5 border border-brand-text/5 rounded-2xl px-6 font-mono text-sm focus:outline-none focus:border-brand-gold/30 dark:text-white"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-serif text-brand-gold font-bold">
                  ₹{(amount / 100).toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-brand-text/40 font-bold uppercase tracking-wider">
                Note: Minimum amount is 100 paise (₹1.00)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text/50 block">Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-14 bg-brand-bg dark:bg-white/5 border border-brand-text/5 rounded-2xl px-6 text-sm focus:outline-none focus:border-brand-gold/30 dark:text-white font-bold uppercase tracking-wider"
              >
                <option value="INR">INR (Indian Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-brand-text hover:bg-brand-gold text-white font-bold uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-soft flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  <span>Pay ₹{(amount / 100).toFixed(2)} Now</span>
                </>
              )}
            </button>
          </form>

          {/* Payment Status Messages */}
          {paymentStatus.status === 'success' && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-top duration-500">
              <div className="flex items-center space-x-3">
                <ShieldCheck size={24} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Payment Successful</h3>
              </div>
              <p className="text-xs">{paymentStatus.message}</p>
              {paymentStatus.details && (
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl space-y-1 font-mono text-[10px]">
                  <p><strong>Payment ID:</strong> {paymentStatus.details.razorpay_payment_id}</p>
                  <p><strong>Order ID:</strong> {paymentStatus.details.razorpay_order_id}</p>
                  <p className="truncate"><strong>Signature:</strong> {paymentStatus.details.razorpay_signature}</p>
                </div>
              )}
            </div>
          )}

          {paymentStatus.status === 'failed' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl p-6 space-y-4 animate-in fade-in slide-in-from-top duration-500">
              <div className="flex items-center space-x-3">
                <AlertCircle size={24} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Payment Unsuccessful</h3>
              </div>
              <p className="text-xs">{paymentStatus.message}</p>
              {paymentStatus.details && (
                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl space-y-1 font-mono text-[10px]">
                  <p><strong>Code / Reason:</strong> {paymentStatus.details.description || paymentStatus.details.code || 'User Cancelled'}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, Landmark, Wallet, ShieldCheck, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { Button } from '@/components/new-ui/Button';
import { cn } from '@/lib/utils';

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} />, description: 'Visa, Mastercard, AMEX, RuPay' },
  { id: 'netbanking', label: 'Net Banking', icon: <Landmark size={20} />, description: 'All major Indian banks' },
  { id: 'upi', label: 'UPI / QR', icon: <Wallet size={20} />, description: 'Google Pay, PhonePe, Paytm' }
];

export default function PaymentPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const { items, getTotal, selectedAddressId, savedAddresses } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = getTotal();
  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error('Razorpay SDK failed to load');

      // 1. Create the Pending Order in our DB
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount: total,
          shippingAddress: selectedAddress
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create internal order');

      // 2. Initiate Razorpay Order on Backend
      const razorpayRes = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAmount: total,
          orderId: orderData.orderId
        })
      });

      const razorpayData = await razorpayRes.json();
      if (!razorpayData.success) throw new Error(razorpayData.error || 'Failed to initiate Razorpay');

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: "Zoniraz Jewellery",
        description: "Exquisite Luxury & Timeless Elegance",
        image: "/favicon.ico",
        order_id: razorpayData.id,
        handler: function (response: any) {
          // Success Callback
          router.push(`/success?order_id=${orderData.orderId}&payment_id=${response.razorpay_payment_id}`);
        },
        prefill: {
          name: selectedAddress?.fullName,
          contact: selectedAddress?.phone,
        },
        notes: {
          internal_order_id: orderData.orderId
        },
        theme: {
          color: "#3A1C16",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error('Payment Error:', error);
      alert('Payment initialization failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  if (!selectedAddressId) {
    router.push('/checkout/shipping');
    return null;
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-32">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Step Indicator */}
        <CheckoutSteps currentStep="payment" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Side: Payment Selection */}
          <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.push('/checkout/shipping')}
                className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text transition-colors"
              >
                <ChevronLeft size={16} />
                <span>Return to Shipping</span>
              </button>
              <h2 className="text-2xl font-serif text-brand-text">Payment Method</h2>
            </div>

            {/* Delivery Summary Brief */}
            <div className="bg-white/40 backdrop-blur-sm rounded-[35px] border border-brand-text/5 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/40">Delivering To</p>
                  <p className="text-xs font-bold text-brand-text tracking-wide">{selectedAddress?.fullName}, {selectedAddress?.pincode}</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/checkout/shipping')}
                className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline"
              >
                Change
              </button>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6">
              {PAYMENT_METHODS.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "p-8 rounded-[40px] border transition-all duration-500 cursor-pointer flex items-center justify-between group",
                    selectedMethod === method.id 
                      ? "bg-white border-brand-gold shadow-premium" 
                      : "bg-white/40 border-brand-text/5 hover:border-brand-text/10"
                  )}
                >
                  <div className="flex items-center space-x-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                      selectedMethod === method.id ? "bg-brand-gold text-white" : "bg-brand-bg text-brand-text/30"
                    )}>
                      {method.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text">{method.label}</h3>
                      <p className="text-[10px] text-brand-text/40 uppercase tracking-widest font-medium">{method.description}</p>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedMethod === method.id ? "border-brand-gold bg-brand-gold" : "border-brand-text/10"
                  )}>
                    {selectedMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-gold/5 rounded-[40px] p-10 border border-brand-gold/10 flex flex-col items-center text-center space-y-4">
              <Lock className="text-brand-gold" size={32} />
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">100% Secure Transaction</h4>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                  Your security is our priority. We use industry-standard encryption to protect your payment information.
                </p>
              </div>
            </div>

          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-[480px]">
            <div className="bg-white rounded-[50px] p-10 md:p-12 border border-brand-text/5 shadow-premium sticky top-32 space-y-10 animate-in fade-in slide-in-from-right duration-1000">
              <h2 className="text-2xl font-serif text-brand-text text-center">Order Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Amount Payable</span>
                  <span className="text-3xl font-serif text-brand-text italic">₹ {total.toLocaleString()}</span>
                </div>

                <Button 
                  size="lg" 
                  disabled={isLoading}
                  className="w-full !py-7 shadow-premium text-sm tracking-[0.2em]"
                  onClick={handlePayment}
                >
                  {isLoading ? 'Processing...' : 'Pay Now'}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

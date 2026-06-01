'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CreditCard, Landmark, Wallet, ShieldCheck, Lock, Coins, Gift } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import useSWR from 'swr';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { Button } from '@/components/new-ui/Button';
import { cn } from '@/lib/utils';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';

const fetcher = (url: string) => fetch(url).then(res => res.json());

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
  const { currentCurrency, rates } = useCurrencyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [applyDigiGold, setApplyDigiGold] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardPin, setGiftCardPin] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<{ code: string; pin: string; balance: number } | null>(null);
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [isGiftCardValidating, setIsGiftCardValidating] = useState(false);

  // Fetch user's digi gold wallet if they are logged in
  const { data: digiGoldData } = useSWR('/api/digi-gold/wallet', fetcher);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = getTotal();
  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);

  // Calculate Digi Gold Deductions
  const eligibleDigiGoldValue = digiGoldData?.success && digiGoldData.valuation?.currentValue ? digiGoldData.valuation.currentValue : 0;
  const digiGoldDeduction = applyDigiGold ? Math.min(eligibleDigiGoldValue, total) : 0;

  // Calculate Gift Card Deductions
  const giftCardDeduction = appliedGiftCard ? Math.min(appliedGiftCard.balance, total - digiGoldDeduction) : 0;
  const finalPayable = total - digiGoldDeduction - giftCardDeduction;

  const handleApplyGiftCard = async () => {
    if (!giftCardCode || !giftCardPin) {
      setGiftCardError('Please enter both code and PIN.');
      return;
    }
    setIsGiftCardValidating(true);
    setGiftCardError(null);
    try {
      const res = await fetch('/api/gift-cards/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: giftCardCode, pin: giftCardPin }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.currency !== currentCurrency) {
          setGiftCardError(`Gift Card currency (${data.currency}) does not match cart currency (${currentCurrency}).`);
          setIsGiftCardValidating(false);
          return;
        }
        setAppliedGiftCard({
          code: data.code,
          pin: giftCardPin,
          balance: data.currentBalance
        });
        setGiftCardError(null);
        setGiftCardCode('');
        setGiftCardPin('');
      } else {
        setGiftCardError(data.error || 'Failed to validate gift card.');
      }
    } catch (err) {
      setGiftCardError('Network error. Please try again.');
    } finally {
      setIsGiftCardValidating(false);
    }
  };

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardError(null);
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

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error('Razorpay SDK failed to load');

      // 1. Create the Pending Order in our DB
      // SECURE: Only send minimal data, backend recalculates everything
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            configuration: item.configuration
          })),
          couponCode: undefined, // Add if coupon logic is implemented in store
          currency: currentCurrency,
          exchangeRate: rates[currentCurrency] || 1,
          shippingAddress: {
            fullName: selectedAddress?.fullName,
            phone: selectedAddress?.phone,
            addressLine: selectedAddress?.addressLine || '',
            city: selectedAddress?.city,
            state: selectedAddress?.state,
            pincode: selectedAddress?.pincode,
            country: selectedAddress?.country || 'India'
          },
          applyDigiGold,
          giftCardCode: appliedGiftCard?.code || undefined,
          giftCardPin: appliedGiftCard?.pin || undefined
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to create internal order');

      // If fully redeemed, order is done!
      if (orderData.fullyRedeemed) {
        const redemptionType = giftCardDeduction > 0 ? 'giftcard_redemption' : 'digigold_redemption';
        router.push(`/success?order_id=${orderData.orderId}&payment_id=${redemptionType}`);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, // amount from backend in paise
        currency: currentCurrency || 'INR', // Note: backend defaults to INR
        name: "Zoniraz Jewellery",
        description: "Exquisite Luxury & Timeless Elegance",
        image: "/images/ZONIRAZ LOGO.png",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            setIsLoading(true);
            // Verify payment on backend
            const verifyRes = await fetch('/api/checkout/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              router.push(`/success?order_id=${orderData.orderId}&payment_id=${response.razorpay_payment_id}`);
            } else {
              alert('Payment verification failed: ' + verifyData.error);
              setIsLoading(false);
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Verification process failed.');
            setIsLoading(false);
          }
        },
        prefill: {
          name: selectedAddress?.fullName,
          contact: selectedAddress?.phone,
        },
        notes: {
          internal_order_id: orderData.orderId
        },
        theme: {
          color: "#D4AF37", // Brand Gold
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
    <div className="bg-brand-bg text-brand-text min-h-screen pt-24 pb-32 transition-colors duration-500">
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
            <div className="bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[35px] border border-brand-text/5 dark:border-white/5 p-6 flex items-center justify-between transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center transition-colors">
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
                      ? "bg-white dark:bg-brand-white border-brand-gold shadow-premium" 
                      : "bg-white/40 dark:bg-white/5 border-brand-text/5 dark:border-white/5 hover:border-brand-text/10"
                  )}
                >
                  <div className="flex items-center space-x-6">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                      selectedMethod === method.id ? "bg-brand-gold text-white" : "bg-brand-bg dark:bg-brand-bg text-brand-text/30"
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

            {/* DIGI GOLD REDEMPTION MODULE */}
            {eligibleDigiGoldValue > 0 && false && (
              <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-[40px] p-8 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-gold text-white flex items-center justify-center">
                    <Coins size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Redeem Digi Gold</h3>
                    <p className="text-[10px] text-brand-text/60 uppercase tracking-widest font-medium mt-1">Available Balance: ₹{eligibleDigiGoldValue.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setApplyDigiGold(!applyDigiGold)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    applyDigiGold ? "bg-brand-gold" : "bg-brand-text/10"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                    applyDigiGold ? "left-[26px]" : "left-0.5"
                  )} />
                </button>
              </div>
            )}

            {/* LUXURY GIFT CARD REDEMPTION MODULE */}
            <div className="bg-white/40 dark:bg-white/5 border border-brand-text/5 dark:border-white/5 rounded-[40px] p-8 space-y-6 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                  <Gift size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-text">Apply Gift Card</h3>
                  <p className="text-[10px] text-brand-text/40 dark:text-brand-text/60 uppercase tracking-widest font-medium mt-1">Redeem store-value vouchers</p>
                </div>
              </div>

              {appliedGiftCard ? (
                <div className="bg-brand-gold/5 border border-brand-gold/25 rounded-2xl p-4 flex items-center justify-between animate-in fade-in duration-300">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Active Gift Voucher Applied</p>
                    <p className="text-xs font-bold font-mono tracking-widest text-brand-text">{appliedGiftCard.code}</p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Deductible Balance: ₹{appliedGiftCard.balance.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={handleRemoveGiftCard}
                    className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline px-4 py-2 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text"
                      placeholder="GIFT CARD CODE (e.g. ZGFT-ABCD-EFGH)"
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                      className="w-full h-12 bg-white dark:bg-brand-white border border-brand-text/5 rounded-xl px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 dark:text-brand-text"
                    />
                    <input 
                      type="password"
                      placeholder="6-DIGIT PIN"
                      maxLength={6}
                      value={giftCardPin}
                      onChange={(e) => setGiftCardPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-12 bg-white dark:bg-brand-white border border-brand-text/5 rounded-xl px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 dark:text-brand-text"
                    />
                  </div>
                  {giftCardError && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest px-2">{giftCardError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleApplyGiftCard}
                    disabled={isGiftCardValidating}
                    className="w-full py-3.5 bg-brand-text hover:bg-brand-gold text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all shadow-soft"
                  >
                    {isGiftCardValidating ? 'Validating Voucher...' : 'Apply Voucher'}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-brand-gold/5 dark:bg-brand-gold/10 rounded-[40px] p-10 border border-brand-gold/10 flex flex-col items-center text-center space-y-4 transition-colors">
              <Lock className="text-brand-gold" size={32} />
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">100% Secure Transaction</h4>
                <p className="text-[10px] text-brand-text/40 dark:text-brand-text/60 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                  Your security is our priority. We use industry-standard encryption to protect your payment information.
                </p>
              </div>
            </div>

          </div>

          <div className="w-full lg:w-[480px]">
            <div className="bg-white dark:bg-brand-white rounded-[50px] p-10 md:p-12 border border-brand-text/5 shadow-premium sticky top-32 space-y-10 animate-in fade-in slide-in-from-right duration-1000 transition-colors">
              <div className="absolute top-4 right-8 px-2 py-1 bg-red-100 text-red-700 text-[8px] font-black uppercase tracking-widest rounded-md animate-pulse">Test Mode</div>
              <h2 className="text-2xl font-serif text-brand-text dark:text-brand-text/90 text-center">Order Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end pb-4 border-b border-brand-text/5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text/60">Cart Total</span>
                  <span className="text-lg font-serif text-brand-text">{displayPrice(total, currentCurrency, rates)}</span>
                </div>

                {applyDigiGold && (
                  <div className="flex justify-between items-end pb-4 border-b border-brand-text/5 animate-in fade-in">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold flex items-center"><Coins size={12} className="mr-1" /> Digi Gold Used</span>
                    <span className="text-lg font-serif text-brand-gold">- {displayPrice(digiGoldDeduction, currentCurrency, rates)}</span>
                  </div>
                )}

                {appliedGiftCard && (
                  <div className="flex justify-between items-end pb-4 border-b border-brand-text/5 animate-in fade-in">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold flex items-center"><Gift size={12} className="mr-1" /> Gift Card Applied</span>
                    <span className="text-lg font-serif text-brand-gold">- {displayPrice(giftCardDeduction, currentCurrency, rates)}</span>
                  </div>
                )}

                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text">Amount Payable</span>
                  <span className="text-3xl font-serif text-brand-text italic">{displayPrice(finalPayable, currentCurrency, rates)}</span>
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

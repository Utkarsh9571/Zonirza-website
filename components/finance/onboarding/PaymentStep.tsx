import React, { useState } from 'react';
import { CreditCard, Landmark, CheckCircle2, Loader2, QrCode, ShieldCheck, Download, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { displayPrice } from '@/lib/currency';
import { useCurrencyStore } from '@/store/currencyStore';

interface PaymentStepProps {
  personalDetails: any;
  nomineeDetails: any;
  planType: string;
  monthlyAmount: number;
  onBack: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({ 
  personalDetails, 
  nomineeDetails, 
  planType, 
  monthlyAmount,
  onBack 
}) => {
  const router = useRouter();
  const { currentCurrency, rates } = useCurrencyStore();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    setIsProcessing(true);
    
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error('Razorpay SDK failed to load');

      const response = await fetch('/api/finance/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: planType.toLowerCase().includes('reserve') ? 'gold_reserve' : 'gold_mine',
          monthlyAmount,
          personalDetails,
          nomineeDetails,
          paymentMethod
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Enrollment initiation failed');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: "Jewelry Starter Finance",
        description: `${planType} Enrollment`,
        image: "/images/default-image.png",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch('/api/finance/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                transactionId: data.transactionId,
                enrollmentId: data.enrollmentId
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setIsProcessing(false);
              setIsSuccess(true);
              setTimeout(() => {
                router.push('/account/savings');
              }, 4000);
            } else {
              alert('Payment verification failed: ' + verifyData.error);
              setIsProcessing(false);
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Verification process failed.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: personalDetails?.fullName,
          email: personalDetails?.email,
          contact: personalDetails?.mobile,
        },
        theme: {
          color: "#D4AF37", 
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      // Handle when the Razorpay modal is closed without payment
      paymentObject.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        alert(response.error.description);
      });
      
      // This listener triggers if the user just closes the modal entirely
      // Unfortunately Razorpay's modal close event is a bit tricky, but this handles most errors.

      paymentObject.open();

    } catch (error: any) {
      console.error("Enrollment failed:", error);
      alert('Payment initialization failed: ' + error.message);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] p-12 rounded-xl border border-brand-text/10 dark:border-white/10 shadow-soft text-center animate-in zoom-in-95 duration-500 min-h-100 flex flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-gold/20 rounded-full animate-ping"></div>
          <div className="relative w-20 h-20 bg-[#F9F9F9] dark:bg-[#222] border border-brand-gold/30 rounded-full flex items-center justify-center">
            <ShieldCheck size={32} className="text-brand-gold" />
          </div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white mb-2">Connecting to Secure Gateway</h2>
        <p className="text-brand-text/60 dark:text-white/60 mb-6 max-w-sm mx-auto">
          Simulating secure connection to Razorpay payment gateway...
        </p>
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={24} className="text-[#E55A44] animate-spin" />
          <span className="text-xs font-bold tracking-wider text-brand-text/50 uppercase">Do not refresh</span>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] p-12 rounded-xl border border-brand-text/10 dark:border-white/10 shadow-soft animate-in zoom-in-95 duration-500 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-brand-text/60 dark:text-white/60 max-w-md mx-auto">
            Your {planType} enrollment is complete and securely recorded in our operational database.
          </p>
        </div>

        <div className="bg-[#F9F9F9] dark:bg-[#222] rounded-xl border border-brand-text/5 dark:border-white/5 p-6 max-w-md mx-auto relative z-10 mb-8 shadow-inner">
           <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text/50 border-b border-brand-text/5 dark:border-white/5 pb-3 mb-4">Official Receipt</h3>
           
           <div className="space-y-3 mb-6">
             <div className="flex justify-between text-sm">
               <span className="text-brand-text/70 dark:text-white/70">Plan Type</span>
               <span className="font-bold text-brand-text dark:text-white">{planType}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-brand-text/70 dark:text-white/70">Amount Paid</span>
               <span className="font-bold text-[#E55A44] text-lg">{displayPrice(monthlyAmount, currentCurrency, rates)}</span>
             </div>
             <div className="flex justify-between text-sm">
               <span className="text-brand-text/70 dark:text-white/70">Gateway Ref</span>
               <span className="font-mono text-brand-text dark:text-white font-bold text-xs bg-black/5 dark:bg-white/5 px-2 py-1 rounded">Razorpay Verified</span>
             </div>
           </div>

           <div className="flex items-center gap-3 p-3 bg-brand-gold/10 rounded-lg text-xs text-brand-text dark:text-white">
             <Info size={16} className="text-brand-gold shrink-0" />
             <p>This was a secure test-mode transaction processed via Razorpay.</p>
           </div>
        </div>

        <div className="text-center relative z-10">
          <p className="text-sm font-bold text-brand-gold flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Redirecting to your Savings Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-brand-text/10 dark:border-white/10 shadow-soft animate-in slide-in-from-right-4 fade-in duration-300 overflow-hidden flex flex-col md:flex-row">
      
      {/* Payment Method Selection */}
      <div className="w-full md:w-1/3 border-r border-brand-text/10 dark:border-white/10 bg-[#F9F9F9] dark:bg-[#222] p-6 space-y-2">
        <button 
          onClick={() => setPaymentMethod('upi')}
          className={`w-full flex items-center gap-3 p-4 rounded-lg text-left transition-colors ${paymentMethod === 'upi' ? 'bg-white dark:bg-brand-bg shadow-sm border-l-4 border-[#E55A44] font-bold text-brand-text dark:text-white' : 'text-brand-text/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <QrCode size={18} /> Pay via UPI
        </button>
        <button 
          onClick={() => setPaymentMethod('card')}
          className={`w-full flex items-center gap-3 p-4 rounded-lg text-left transition-colors ${paymentMethod === 'card' ? 'bg-white dark:bg-brand-bg shadow-sm border-l-4 border-[#E55A44] font-bold text-brand-text dark:text-white' : 'text-brand-text/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <CreditCard size={18} /> New Credit or Debit Card
        </button>
        <button 
          onClick={() => setPaymentMethod('netbanking')}
          className={`w-full flex items-center gap-3 p-4 rounded-lg text-left transition-colors ${paymentMethod === 'netbanking' ? 'bg-white dark:bg-brand-bg shadow-sm border-l-4 border-[#E55A44] font-bold text-brand-text dark:text-white' : 'text-brand-text/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5'}`}
        >
          <Landmark size={18} /> Net Banking
        </button>
      </div>

      {/* Payment Details Form */}
      <div className="w-full md:w-2/3 p-8 flex flex-col h-full min-h-100">
        <h2 className="text-xl font-bold text-brand-text dark:text-white mb-6">Payment Details</h2>
        
        <div className="flex-1">
          {paymentMethod === 'upi' && (
             <div className="bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center">
                <QrCode size={48} className="text-brand-text/20 dark:text-white/20 mb-4" />
                <h3 className="font-bold text-brand-text dark:text-white mb-2">Scan QR code</h3>
                <p className="text-sm text-brand-text/60 dark:text-white/60">
                  Scan the QR using any UPI app on your mobile phone like PhonePe, Paytm, GooglePay, BHIM, etc.
                </p>
                <div className="mt-6 text-xs text-brand-gold bg-brand-gold/10 px-4 py-2 rounded-full">
                  Waiting for you to scan...
                </div>
             </div>
          )}
          
          {paymentMethod === 'card' && (
             <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold"
                  />
                  <input 
                    type="text" 
                    placeholder="CVV" 
                    className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Name on Card" 
                  className="w-full bg-[#F9F9F9] dark:bg-[#222] border border-brand-text/10 dark:border-white/10 rounded-md py-3 px-4 text-brand-text dark:text-white outline-none focus:border-brand-gold"
                />
             </div>
          )}

          {paymentMethod === 'netbanking' && (
             <div className="text-center py-12 text-brand-text/50 dark:text-white/50">
               <Landmark size={48} className="mx-auto mb-4 opacity-50" />
               <p>Select your bank on the next secure page.</p>
             </div>
          )}
        </div>

        <div className="pt-8 mt-auto flex items-center justify-between">
          <button 
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-brand-text/20 hover:border-brand-text text-brand-text dark:text-white dark:border-white/20 dark:hover:border-white font-bold tracking-wider rounded-md transition-colors"
            disabled={isProcessing}
          >
            BACK
          </button>
          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className="px-8 py-3 bg-[#E55A44] hover:bg-[#D44A34] text-white font-bold tracking-wider rounded-md transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-48 justify-center"
          >
            {isProcessing ? (
              <><Loader2 size={18} className="animate-spin" /> PAYING...</>
            ) : (
              `PAY ${displayPrice(monthlyAmount, currentCurrency, rates)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

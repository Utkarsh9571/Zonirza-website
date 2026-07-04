'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Gift, ShieldCheck, Mail, User, MessageSquare, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useAuthModalStore } from '@/store/authModalStore';
import { Button } from '@/components/new-ui/Button';
import { Section } from '@/components/new-ui/Section';
import { cn } from '@/lib/utils';

const PRESETS = [1000, 2500, 5000, 10000, 25000];

const THEMES = [
  {
    name: 'Minimal Luxury',
    gradient: 'from-[#3A1C16] via-[#2F1611] to-[#120704]',
    textColor: 'text-[#EAE1D5]',
    accentColor: 'text-[#C5A880]',
    borderColor: 'border-[#C5A880]/30',
    iconColor: 'text-[#C5A880]',
    fontClass: 'font-serif'
  },
  {
    name: 'Wedding Gold',
    gradient: 'from-[#6B1724] via-[#8B1D2F] to-[#3A0A10]',
    textColor: 'text-[#FFF0F2]',
    accentColor: 'text-[#F3C623]',
    borderColor: 'border-[#F3C623]/30',
    iconColor: 'text-[#F3C623]',
    fontClass: 'font-serif'
  },
  {
    name: 'Anniversary Velvet',
    gradient: 'from-[#0A1D37] via-[#102F5A] to-[#040D1A]',
    textColor: 'text-[#F0F5FA]',
    accentColor: 'text-[#E5E5E5]',
    borderColor: 'border-[#E5E5E5]/30',
    iconColor: 'text-[#E5E5E5]',
    fontClass: 'font-serif'
  },
  {
    name: 'Birthday Blush',
    gradient: 'from-[#6F3843] via-[#C98B98] to-[#401C24]',
    textColor: 'text-[#FAF0F2]',
    accentColor: 'text-[#C5A880]',
    borderColor: 'border-[#C5A880]/30',
    iconColor: 'text-[#C5A880]',
    fontClass: 'font-serif'
  },
  {
    name: 'Diwali Spark',
    gradient: 'from-[#7D1D09] via-[#D45B12] to-[#3A0C03]',
    textColor: 'text-[#FFFDF5]',
    accentColor: 'text-[#F3C623]',
    borderColor: 'border-[#F3C623]/30',
    iconColor: 'text-[#F3C623]',
    fontClass: 'font-serif'
  },
  {
    name: 'Festive Gold',
    gradient: 'from-[#1C1917] via-[#443C2E] to-[#0C0B0A]',
    textColor: 'text-[#F6F5F2]',
    accentColor: 'text-[#E2B855]',
    borderColor: 'border-[#E2B855]/30',
    iconColor: 'text-[#E2B855]',
    fontClass: 'font-serif'
  }
];

export default function GiftCardsClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { openAuthModal } = useAuthModalStore();

  const [amount, setAmount] = useState<number>(5000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [personalMessage, setPersonalMessage] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('Minimal Luxury');
  const [sendOption, setSendOption] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const isLoggedIn = status === 'authenticated';
  const [minDateTime, setMinDateTime] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDateTime(new Date(Date.now() + 60000).toISOString().slice(0, 16));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    setPurchaseError(null);

    const finalAmount = isCustom ? parseFloat(customAmount) : amount;
    if (isNaN(finalAmount) || finalAmount < 100) {
      setPurchaseError('Please enter a valid amount of ₹100 or more.');
      return;
    }

    if (!recipientEmail || !recipientName) {
      setPurchaseError('Please enter recipient details.');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      setPurchaseError('Please enter a valid recipient email address.');
      return;
    }

    if (sendOption === 'scheduled' && !scheduledAt) {
      setPurchaseError('Please select a scheduled delivery date and time.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create pending Gift Card and Order
      const res = await fetch('/api/gift-cards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          recipientEmail,
          recipientName,
          personalMessage: personalMessage || undefined,
          currency: 'INR',
          theme: selectedTheme,
          scheduledAt: sendOption === 'scheduled' ? new Date(scheduledAt).toISOString() : null
        }),
      });

      const orderData = await res.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize order');
      }

      // 2. Load Razorpay
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // 3. Open Razorpay Popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: "Luxury Jewelry Gifting",
        description: `Luxury Gift Card for ${recipientName}`,
        image: "/images/hero-bg.avif",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            setIsLoading(true);
            setPurchaseError(null);
            // Verify payment
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
              setPurchaseError('Payment verification failed: ' + verifyData.error);
              setIsLoading(false);
            }
          } catch (err) {
            console.error('Verification error:', err);
            setPurchaseError('Verification process failed.');
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: async function() {
            try {
              await fetch('/api/orders/abandon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: orderData.orderId })
              });
              console.log('Order marked as abandoned client-side');
            } catch (err) {
              console.error('Failed to trigger order abandon:', err);
            }
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

      const paymentObject = new (window as Window & typeof globalThis & { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      const errorObj = err as Error;
      setPurchaseError(errorObj.message || 'Failed to complete order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const activeAmount = isCustom ? parseFloat(customAmount) || 0 : amount;

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-24 pb-32 transition-colors duration-500 overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="relative py-24 bg-linear-to-b from-[#3A1C16] to-[#12100e] text-[#EAE1D5] flex items-center justify-center text-center px-6 rounded-b-[60px] shadow-premium mb-16">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <Image 
            src="/images/luxury_giftcard_mockup.png" 
            alt="luxury background" 
            fill 
            className="object-cover scale-105 filter blur-xs"
            priority
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="text-brand-gold text-[11px] uppercase tracking-[0.4em] font-black">The Art of Giving</span>
          <h1 className="text-4xl text-white md:text-6xl font-serif font-bold italic tracking-wide">
            Luxury Jewelry <span className="not-italic text-white">Gift Cards</span>
          </h1>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-light leading-relaxed max-w-lg mx-auto text-[#EAE1D5]/80">
            Share the gift of choosing from our timeless, handcrafted masterpieces. An elegant expression of affection and luxury.
          </p>
        </div>
      </div>

      <Section className="max-w-350 mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Form Side */}
          <div className="flex-1 w-full space-y-12 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <h2 className="text-3xl font-serif text-brand-text">Configure Gift Voucher</h2>
              <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Select amount and customize recipient details</p>
            </div>

            <form onSubmit={handlePurchase} className="space-y-10">
              
              {/* Presets */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Select Value</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {PRESETS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAmount(val);
                        setIsCustom(false);
                      }}
                      className={cn(
                        "py-4 rounded-2xl border text-xs font-bold transition-all duration-300",
                        !isCustom && amount === val
                          ? "bg-brand-text dark:bg-brand-gold text-white border-transparent shadow-premium scale-105"
                          : "bg-white dark:bg-brand-white text-brand-text/60 border-brand-text/5 hover:border-brand-gold/35"
                      )}
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCustom(true)}
                    className={cn(
                      "py-4 rounded-2xl border text-xs font-bold transition-all duration-300 col-span-3 sm:col-span-5 md:col-span-1",
                      isCustom
                        ? "bg-brand-text dark:bg-brand-gold text-white border-transparent shadow-premium scale-105"
                        : "bg-white dark:bg-brand-white text-brand-text/60 border-brand-text/5 hover:border-brand-gold/35"
                    )}
                  >
                    Custom
                  </button>
                </div>

                {isCustom && (
                  <div className="mt-4 space-y-2 animate-in fade-in duration-500">
                    <input
                      type="number"
                      required
                      min="100"
                      placeholder="Enter amount (Min. ₹100)"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full h-14 bg-white dark:bg-brand-white border border-brand-text/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/40 transition-all dark:text-brand-text"
                    />
                  </div>
                )}
              </div>

              {/* Theme Selection */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Select Gift Theme</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedTheme(theme.name)}
                      className={cn(
                        "py-4 px-4 rounded-2xl border text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center space-y-3 text-center",
                        selectedTheme === theme.name
                          ? "bg-brand-text dark:bg-brand-gold text-white border-transparent shadow-premium scale-105"
                          : "bg-white dark:bg-brand-white text-brand-text/60 border-brand-text/5 hover:border-brand-gold/35"
                      )}
                    >
                      <span className="text-[11px] tracking-wide">{theme.name}</span>
                      <div className={cn("w-12 h-2 rounded-full bg-linear-to-r", theme.gradient)} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="bg-white dark:bg-brand-white rounded-[40px] p-8 md:p-10 border border-brand-text/5 shadow-soft space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Recipient Name</label>
                    <div className="relative flex items-center">
                      <User size={16} className="absolute left-4 text-brand-text/30" />
                      <input
                        type="text"
                        required
                        placeholder="Name of recipient"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 rounded-2xl text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Recipient Email</label>
                    <div className="relative flex items-center">
                      <Mail size={16} className="absolute left-4 text-brand-text/30" />
                      <input
                        type="email"
                        required
                        placeholder="Email of recipient"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 rounded-2xl text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Personal Message (Optional)</label>
                  <div className="relative flex items-start">
                    <MessageSquare size={16} className="absolute left-4 top-4 text-brand-text/30" />
                    <textarea
                      placeholder="Write your wishes..."
                      rows={4}
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 rounded-2xl text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Timing Selection */}
              <div className="bg-white dark:bg-brand-white rounded-[40px] p-8 md:p-10 border border-brand-text/5 shadow-soft space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Delivery Timing</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSendOption('immediate')}
                      className={cn(
                        "py-4 rounded-2xl border text-xs font-bold transition-all duration-300",
                        sendOption === 'immediate'
                          ? "bg-brand-text dark:bg-brand-gold text-white border-transparent shadow-premium"
                          : "bg-brand-bg/50 dark:bg-brand-bg text-brand-text/60 border-brand-text/5 hover:border-brand-gold/35"
                      )}
                    >
                      Send Immediately
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendOption('scheduled')}
                      className={cn(
                        "py-4 rounded-2xl border text-xs font-bold transition-all duration-300",
                        sendOption === 'scheduled'
                          ? "bg-brand-text dark:bg-brand-gold text-white border-transparent shadow-premium"
                          : "bg-brand-bg/50 dark:bg-brand-bg text-brand-text/60 border-brand-text/5 hover:border-brand-gold/35"
                      )}
                    >
                      Schedule for Later
                    </button>
                  </div>
                </div>

                {sendOption === 'scheduled' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                    <label className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold ml-2">Scheduled Delivery Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      min={minDateTime} // min is 1 minute in future, computed in useEffect
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full h-14 px-6 bg-brand-bg/50 dark:bg-brand-bg border border-brand-text/5 rounded-2xl text-xs font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all dark:text-brand-text"
                    />
                    <p className="text-[9px] text-brand-text/40 italic ml-2">
                      The card will activate on successful payment, but the email voucher dispatch will be held in queue until your selected date.
                    </p>
                  </div>
                )}
              </div>

              {/* Security info */}
              <div className="bg-brand-gold/5 dark:bg-brand-gold/10 rounded-[30px] p-6 border border-brand-gold/10 flex items-center space-x-4">
                <ShieldCheck className="text-brand-gold shrink-0" size={24} />
                <p className="text-[9px] uppercase tracking-widest text-brand-text/60 leading-relaxed font-bold">
                  Transactions are secured using cryptographically generated tokens. Recipients receive code and security PIN to redeem at checkout.
                </p>
              </div>

              {/* Submit */}
              {purchaseError && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl animate-in fade-in duration-300">
                  <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest text-center leading-relaxed">{purchaseError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6! shadow-premium uppercase text-xs tracking-[0.25em]"
              >
                {isLoading ? 'Processing...' : isLoggedIn ? `Proceed to Payment — ₹${activeAmount.toLocaleString('en-IN')}` : 'Log In to Buy'}
              </Button>
            </form>
          </div>

          {/* Interactive Card Preview Side */}
          {(() => {
            const currentTheme = THEMES.find(t => t.name === selectedTheme) || THEMES[0];
            return (
              <div className="w-full lg:w-120 sticky top-32 space-y-8 animate-in fade-in slide-in-from-right duration-1000">
                <h3 className="text-md uppercase tracking-[0.2em] font-black text-brand-text/40 text-center lg:text-left">Live Gift Card Preview</h3>
                
                {/* Metallic Card Display styled dynamically */}
                <div className={cn(
                  "relative w-full aspect-[1.6/1] bg-linear-to-br rounded-4xl p-8 shadow-premium border-2 text-white flex flex-col justify-between overflow-hidden group transition-all duration-500",
                  currentTheme.gradient,
                  currentTheme.borderColor
                )}>
                  {/* Overlay sheen */}
                  <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60">Luxury Gift Card</span>
                      <h4 className={cn("text-xl tracking-widest uppercase italic font-bold text-white", currentTheme.fontClass)}>Luxury Jewelry</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <Gift size={20} className={currentTheme.accentColor} />
                    </div>
                  </div>

                  {/* Personal Message Preview */}
                  <div className="my-2 min-h-10 flex items-center justify-center text-center">
                    {personalMessage ? (
                      <p className="text-[10px] italic font-serif leading-relaxed line-clamp-2 px-4 opacity-90">
                        &ldquo;{personalMessage}&rdquo;
                      </p>
                    ) : (
                      <p className="text-[9px] uppercase tracking-widest font-black opacity-30">Your customized message here</p>
                    )}
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-4">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase tracking-[0.2em] opacity-60">Presented To</span>
                      <p className="text-[11px] font-bold tracking-widest uppercase truncate max-w-37.5">
                        {recipientName || 'Name of recipient'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] uppercase tracking-[0.2em] opacity-60">Value</span>
                      <p className="text-xl font-serif font-black italic">
                        ₹{activeAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explanatory visual */}
                <div className="bg-white dark:bg-brand-white border border-brand-text/5 p-8 rounded-[40px] shadow-soft space-y-4">
                  <div className="flex items-center space-x-3 text-brand-gold">
                    <Sparkles size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{selectedTheme} Theme</span>
                  </div>
                  <p className="text-[10px] text-brand-text/50 leading-relaxed uppercase tracking-widest font-medium">
                    {sendOption === 'immediate' 
                      ? "This card is dispatched instantly to the recipient's email upon payment validation."
                      : `This card's email dispatch is scheduled for your selected timing (${scheduledAt ? new Date(scheduledAt).toLocaleString() : 'future date'}).`
                    }
                  </p>
                </div>
              </div>
            );
          })()}

        </div>
      </Section>
    </div>
  );
}

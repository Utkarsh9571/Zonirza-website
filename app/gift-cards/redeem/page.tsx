'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Gift, Sparkles, Mail, ShoppingBag, UserCheck, ArrowRight, Info, Printer, Lock } from 'lucide-react';
import { useAuthModalStore } from '@/store/authModalStore';
import { Button } from '@/components/new-ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const THEME_STYLES: Record<string, {
  gradient: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  glow: string;
  title: string;
}> = {
  'Minimal Luxury': {
    gradient: 'from-[#3A1C16] via-[#2F1611] to-[#120704]',
    borderColor: 'border-[#C5A880]/30',
    textColor: 'text-[#EAE1D5]',
    accentColor: 'text-[#C5A880]',
    glow: 'shadow-[0_0_50px_rgba(197,168,128,0.25)]',
    title: 'A Gift of Timeless Elegance',
  },
  'Wedding Gold': {
    gradient: 'from-[#6B1724] via-[#8B1D2F] to-[#3A0A10]',
    borderColor: 'border-[#F3C623]/30',
    textColor: 'text-[#FFF0F2]',
    accentColor: 'text-[#F3C623]',
    glow: 'shadow-[0_0_50px_rgba(243,198,35,0.25)]',
    title: 'A Royal Blessing For Your Union',
  },
  'Anniversary Velvet': {
    gradient: 'from-[#0A1D37] via-[#102F5A] to-[#040D1A]',
    borderColor: 'border-[#E5E5E5]/30',
    textColor: 'text-[#F0F5FA]',
    accentColor: 'text-[#E5E5E5]',
    glow: 'shadow-[0_0_50px_rgba(229,229,229,0.25)]',
    title: 'Celebrating Your Timeless Love',
  },
  'Birthday Blush': {
    gradient: 'from-[#6F3843] via-[#C98B98] to-[#401C24]',
    borderColor: 'border-[#C5A880]/30',
    textColor: 'text-[#FAF0F2]',
    accentColor: 'text-[#C5A880]',
    glow: 'shadow-[0_0_50px_rgba(201,139,152,0.25)]',
    title: 'Wishing You A Beautiful Year Ahead',
  },
  'Diwali Spark': {
    gradient: 'from-[#7D1D09] via-[#D45B12] to-[#3A0C03]',
    borderColor: 'border-[#F3C623]/30',
    textColor: 'text-[#FFFDF5]',
    accentColor: 'text-[#F3C623]',
    glow: 'shadow-[0_0_50px_rgba(243,198,35,0.3)]',
    title: 'A Bright Gift Of Prosperity',
  },
  'Festive Gold': {
    gradient: 'from-[#1C1917] via-[#443C2E] to-[#0C0B0A]',
    borderColor: 'border-[#E2B855]/30',
    textColor: 'text-[#F6F5F2]',
    accentColor: 'text-[#E2B855]',
    glow: 'shadow-[0_0_50px_rgba(226,184,85,0.3)]',
    title: 'An Imperial Gift Of Gold & Light',
  },
};

function GiftCardRedeemContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthModalStore();

  const code = searchParams.get('code')?.trim();
  const pin = searchParams.get('pin')?.trim();

  const [giftCard, setGiftCard] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);

  useEffect(() => {
    if (!code || !pin) {
      setError('A valid Gift Card Code and Security PIN are required to access this reveal page.');
      setLoading(false);
      return;
    }

    const fetchGiftCard = async () => {
      try {
        const res = await fetch(`/api/gift-cards/reveal?code=${code}&pin=${pin}`);
        const data = await res.json();
        
        if (data.success) {
          setGiftCard(data.data);
        } else {
          setError(data.error || 'Failed to load gift card details');
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred while loading your gift card.');
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCard();
  }, [code, pin]);

  const handleReveal = () => {
    setIsRevealing(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsRevealing(false);
    }, 1500); // match duration of letter slide out
  };

  const isLoggedIn = status === 'authenticated';
  const userMatchesRecipient = isLoggedIn && session?.user?.email?.toLowerCase() === giftCard?.recipientEmail?.toLowerCase();

  if (loading) {
    return (
      <div className="bg-[#12100E] min-h-screen flex items-center justify-center flex-col space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-brand-gold/10 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-gold animate-spin" />
        </div>
        <p className="text-[#EAE1D5]/60 uppercase tracking-[0.25em] text-xs font-bold font-serif animate-pulse">Loading Luxury Voucher...</p>
      </div>
    );
  }

  if (error || !giftCard) {
    return (
      <div className="bg-[#12100E] text-[#EAE1D5] min-h-screen pt-24 pb-32 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20 text-red-400">
            <Info size={28} />
          </div>
          <h2 className="text-2xl font-serif italic text-white">Verification Failed</h2>
          <p className="text-xs text-[#EAE1D5]/70 leading-relaxed uppercase tracking-[0.1em]">
            {error || 'The gift voucher credentials could not be checked.'}
          </p>
          <div className="pt-4">
            <Link href="/gift-cards" className="inline-block bg-[#EAE1D5] text-[#12100E] px-8 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest hover:bg-white transition-all">
              Buy Gift Card
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const themeStyle = THEME_STYLES[giftCard.theme] || THEME_STYLES['Minimal Luxury'];

  return (
    <div className="bg-[#12100e] text-[#EAE1D5] min-h-screen pt-24 pb-32 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl w-full flex flex-col items-center">
        
        {!isRevealed ? (
          /* CINEMATIC ENVELOPE OPENING STAGE */
          <div className="relative w-full max-w-lg aspect-[1.4/1] flex flex-col items-center justify-center perspective-1000 my-8">
            <style>{`
              .perspective-1000 { perspective: 1000px; }
              .transform-style-3d { transform-style: preserve-3d; }
              .flap-open {
                transform: rotateX(180deg);
                z-index: 5 !important;
              }
              .card-emerge {
                transform: translateY(-80%) scale(1.05) rotate(-1.5deg) !important;
                z-index: 25 !important;
              }
              .wax-seal-break {
                animation: wax-break 1s forwards ease-in-out;
              }
              @keyframes wax-break {
                0% { transform: scale(1); opacity: 1; }
                40% { transform: scale(1.1); opacity: 0.9; }
                100% { transform: scale(0.8) translateY(50px); opacity: 0; pointer-events: none; }
              }
            `}</style>

            <div className={cn(
              "w-full h-full relative transition-all duration-[1500ms] transform-style-3d",
              isRevealing ? "scale-95" : "hover:scale-[1.02]"
            )}>
              {/* 1. Envelope Back Body (acts as the back wall inside the envelope) */}
              <div className="absolute inset-0 bg-[#160f0d] border border-white/5 rounded-[24px] shadow-2xl overflow-visible">
                
                {/* 2. The Gift Card inside the pocket */}
                <div className={cn(
                  "absolute left-8 right-8 top-6 bottom-6 rounded-2xl bg-gradient-to-br transition-all duration-[2000ms] ease-in-out p-6 flex flex-col justify-between text-white border border-white/10 shadow-lg",
                  themeStyle.gradient,
                  isRevealing ? "card-emerge" : "translate-y-0 opacity-40 scale-95 z-0"
                )}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[7px] uppercase tracking-[0.2em] opacity-60">Zoniraz Luxury</span>
                      <h5 className="text-sm uppercase tracking-widest font-serif font-black">Zoniraz</h5>
                    </div>
                    <Gift size={16} className={themeStyle.accentColor} />
                  </div>
                  <div className="text-center italic font-serif text-[10px] px-2 opacity-95">
                    "{giftCard.personalMessage || 'A special token for you'}"
                  </div>
                  <div className="flex justify-between items-end border-t border-white/10 pt-2 text-left">
                    <div>
                      <span className="text-[6px] uppercase tracking-widest opacity-60 block">Presented to</span>
                      <span className="text-[9px] uppercase tracking-wider font-bold truncate max-w-[120px] block">{giftCard.recipientName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[6px] uppercase tracking-widest opacity-60 block">Value</span>
                      <span className="text-sm font-serif font-black italic">₹{giftCard.currentBalance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Envelope Left Flap */}
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#2a1f1c] to-[#211816] z-10 rounded-l-[24px]"
                     style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }} />

                {/* 4. Envelope Right Flap */}
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#2d221f] to-[#211816] z-10 rounded-r-[24px]"
                     style={{ clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)' }} />

                {/* 5. Envelope Bottom Flap */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1d1412] to-[#261b19] z-15 rounded-b-[24px]"
                     style={{ clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)' }} />

                {/* 6. Envelope Top Flap (opens upwards) */}
                <div className={cn(
                  "absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[#2e2320] to-[#261b19] origin-top transition-transform duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) z-30 rounded-t-[24px] flex flex-col items-center justify-start pt-6",
                  isRevealing ? "flap-open" : ""
                )}
                style={{ 
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}>
                  <p className="text-[#EAE1D5]/60 font-serif italic text-xs tracking-wider mt-2 select-none">
                    Compliments of Zoniraz
                  </p>
                </div>

                {/* 7. Wax Seal Button - placed absolute center */}
                <div className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-300",
                  isRevealing ? "wax-seal-break" : "hover:scale-105"
                )}>
                  <button 
                    onClick={handleReveal}
                    disabled={isRevealing}
                    className="relative w-24 h-24 flex items-center justify-center cursor-pointer group active:scale-95 transition-transform"
                  >
                    {/* Wax seal outer irregular edge */}
                    <div 
                      className="absolute inset-0 bg-[#6b1724] border border-black/30 shadow-[0_8px_20px_rgba(0,0,0,0.6)] group-hover:rotate-6 transition-transform duration-500"
                      style={{ borderRadius: '43% 57% 45% 55% / 54% 46% 54% 46%' }} 
                    />
                    {/* Wax seal inner ring */}
                    <div className="absolute w-20 h-20 bg-gradient-to-br from-[#801b2a] via-[#6b1724] to-[#440c14] rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.4)] border border-[#C5A880]/10">
                      <span className="text-[#C5A880] text-3xl font-serif italic font-bold select-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">Z</span>
                    </div>
                    
                    {/* Hover guidance */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm border border-[#C5A880]/20 text-[#C5A880] text-[8px] uppercase tracking-widest py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Break Seal
                    </span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* THEMED CARD REVEALED STAGE */
          <div className="w-full space-y-12 animate-in fade-in zoom-in-95 duration-700 text-center">
            
            {/* Theme header greeting */}
            <div className="space-y-4">
              <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">{giftCard.theme} Gift Card</span>
              <h2 className="text-3xl md:text-5xl font-serif italic text-white">{themeStyle.title}</h2>
              <p className="text-xs uppercase tracking-widest text-[#EAE1D5]/60">
                Sent with affection from <span className="text-brand-gold font-bold">{giftCard.senderName}</span>
              </p>
            </div>

            {/* Themed Gift Card Object */}
            <div className={cn(
              "relative w-full max-w-lg aspect-[1.6/1] mx-auto rounded-[32px] p-6 md:p-8 text-white border-2 flex flex-col justify-between overflow-hidden group transition-all duration-700",
              themeStyle.gradient,
              themeStyle.borderColor,
              themeStyle.glow
            )}>
              {/* Golden sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              
              <div className="flex justify-between items-start">
                <div className="space-y-1 text-left">
                  <span className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60">Zoniraz Luxury Gifting</span>
                  <h4 className="text-2xl font-serif font-black tracking-widest uppercase italic">Zoniraz</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Sparkles className={themeStyle.accentColor} size={18} />
                </div>
              </div>

              {/* Card Details Body (Sender, Recipient, Message) */}
              <div className="my-2 space-y-3 text-left">
                <div className="flex justify-between text-[9px] uppercase tracking-widest opacity-85 border-b border-white/10 pb-1.5">
                  <div>
                    <span className="opacity-60 block">Presented To</span>
                    <span className="font-bold">{giftCard.recipientName}</span>
                  </div>
                  <div className="text-right">
                    <span className="opacity-60 block">From</span>
                    <span className="font-bold">{giftCard.senderName}</span>
                  </div>
                </div>

                {giftCard.personalMessage && (
                  <p className="text-[10px] italic font-serif leading-relaxed text-center px-4 opacity-90 line-clamp-2">
                    "{giftCard.personalMessage}"
                  </p>
                )}
              </div>

              {/* Code, PIN, and Balance info on the card itself */}
              <div className="border-t border-white/10 pt-4 flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[7px] uppercase tracking-[0.2em] opacity-60 block">Voucher Code & PIN</span>
                    <span className="font-mono text-xs md:text-sm font-bold tracking-widest select-all">{code}</span>
                    <span className="font-mono text-xs opacity-60 ml-2">PIN: {pin}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[7px] uppercase tracking-[0.2em] opacity-60 block">Available Balance</span>
                    <p className="text-xl font-serif font-black italic">
                      ₹{giftCard.currentBalance.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code and PIN details */}
            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-[#EAE1D5]/40 font-bold">Your Security Credentials</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Code</span>
                  <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-white selection:bg-[#C5A880] select-all">{code}</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                  <span className="text-[8px] uppercase tracking-widest opacity-40 block mb-1">Security PIN</span>
                  <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-white selection:bg-[#C5A880] select-all">{pin}</span>
                </div>
              </div>

              <div className="text-[9px] uppercase tracking-wider text-brand-gold flex items-center justify-center gap-2">
                <Lock size={12} />
                <span>Keep these secure. Copy them to apply at checkout.</span>
              </div>
            </div>

            {/* Claims and action triggers */}
            <div className="max-w-md mx-auto space-y-4 pt-4">
              
              {isLoggedIn ? (
                /* Authenticated */
                <div className="space-y-4">
                  {userMatchesRecipient ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center space-x-3 text-emerald-400">
                      <UserCheck size={20} className="shrink-0" />
                      <p className="text-left text-[10px] uppercase tracking-widest leading-relaxed">
                        Excellent! This voucher is now linked to your logged-in email <strong>{session.user?.email}</strong>. It will show up in your account.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center space-x-3 text-amber-400">
                      <Info size={20} className="shrink-0" />
                      <p className="text-left text-[10px] uppercase tracking-widest leading-relaxed">
                        Logged in as <strong>{session.user?.email}</strong>. Note: This card was sent to <strong>{giftCard.recipientEmail}</strong>. You can still apply the code at checkout!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated */
                <div className="bg-brand-gold/5 border border-brand-gold/15 p-6 rounded-[30px] space-y-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest leading-relaxed text-[#EAE1D5]/80">
                    Don't have a Zoniraz account? Sign up or Log In with OTP using the recipient email <strong>{giftCard.recipientEmail}</strong> to link this card and check transaction history.
                  </p>
                  <button 
                    onClick={openAuthModal}
                    className="w-full bg-[#EAE1D5] hover:bg-white text-black font-bold text-[10px] uppercase tracking-[0.25em] py-3.5 rounded-xl shadow transition-all"
                  >
                    Log In / Sign Up
                  </button>
                </div>
              )}

              {/* Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/" className="w-full">
                  <Button variant="secondary" className="w-full py-4 uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/5">
                    Browse Jewellery
                  </Button>
                </Link>
                <Link href={`/gift-cards/print?code=${code}&pin=${pin}`} target="_blank" className="w-full">
                  <button className="w-full bg-[#3A1C16] text-[#EAE1D5] font-bold text-[10px] uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center space-x-2 border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-all">
                    <Printer size={14} />
                    <span>Print Card</span>
                  </button>
                </Link>
              </div>

              <div className="pt-2">
                <p className="text-[9px] uppercase tracking-widest text-[#EAE1D5]/40">
                  Valid Until: {new Date(giftCard.expirationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function GiftCardRedeemPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#12100E] min-h-screen flex items-center justify-center flex-col space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-brand-gold/10 animate-ping" />
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-gold animate-spin" />
        </div>
        <p className="text-[#EAE1D5]/60 uppercase tracking-[0.25em] text-xs font-bold font-serif animate-pulse">Loading Luxury Voucher...</p>
      </div>
    }>
      <GiftCardRedeemContent />
    </Suspense>
  );
}

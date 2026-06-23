'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gift, Printer, Info, Shield } from 'lucide-react';
import Image from 'next/image';

const THEME_STYLES: Record<string, {
  bgColor: string;
  textColor: string;
  accentColor: string;
  accentBg: string;
  gradient: string;
  borderColor: string;
  rawTextColor: string;
  rawAccentColor: string;
}> = {
  'Minimal Luxury': {
    bgColor: 'bg-[#f9f5f0]',
    textColor: 'text-[#3A1C16]',
    accentColor: 'text-[#C5A880]',
    accentBg: 'bg-[#C5A880]/10',
    gradient: 'from-[#3A1C16] to-[#2F1611]',
    borderColor: 'border-[#3A1C16]',
    rawTextColor: '#3A1C16',
    rawAccentColor: '#C5A880',
  },
  'Wedding Gold': {
    bgColor: 'bg-[#FDF7F7]',
    textColor: 'text-[#6B1724]',
    accentColor: 'text-[#D4AF37]',
    accentBg: 'bg-[#D4AF37]/10',
    gradient: 'from-[#6B1724] to-[#8B1D2F]',
    borderColor: 'border-[#6B1724]',
    rawTextColor: '#6B1724',
    rawAccentColor: '#D4AF37',
  },
  'Anniversary Velvet': {
    bgColor: 'bg-[#F4F7F9]',
    textColor: 'text-[#0A1D37]',
    accentColor: 'text-[#7A8B9E]',
    accentBg: 'bg-[#0A1D37]/5',
    gradient: 'from-[#0A1D37] to-[#102F5A]',
    borderColor: 'border-[#0A1D37]',
    rawTextColor: '#0A1D37',
    rawAccentColor: '#7A8B9E',
  },
  'Birthday Blush': {
    bgColor: 'bg-[#FDF8F9]',
    textColor: 'text-[#6F3843]',
    accentColor: 'text-[#C5A880]',
    accentBg: 'bg-[#C5A880]/10',
    gradient: 'from-[#6F3843] to-[#401C24]',
    borderColor: 'border-[#6F3843]',
    rawTextColor: '#6F3843',
    rawAccentColor: '#C5A880',
  },
  'Diwali Spark': {
    bgColor: 'bg-[#FFFBF0]',
    textColor: 'text-[#7D1D09]',
    accentColor: 'text-[#F3C623]',
    accentBg: 'bg-[#F3C623]/10',
    gradient: 'from-[#7D1D09] to-[#D45B12]',
    borderColor: 'border-[#7D1D09]',
    rawTextColor: '#7D1D09',
    rawAccentColor: '#F3C623',
  },
  'Festive Gold': {
    bgColor: 'bg-[#FAF9F6]',
    textColor: 'text-[#1C1917]',
    accentColor: 'text-[#E2B855]',
    accentBg: 'bg-[#E2B855]/10',
    gradient: 'from-[#1C1917] to-[#443C2E]',
    borderColor: 'border-[#1C1917]',
    rawTextColor: '#1C1917',
    rawAccentColor: '#E2B855',
  },
};

interface IGiftCard {
  theme: string;
  personalMessage?: string;
  recipientName: string;
  senderName: string;
  currentBalance: number;
  expirationDate: string;
}

function GiftCardPrintContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code')?.trim();
  const pin = searchParams.get('pin')?.trim();

  const [giftCard, setGiftCard] = useState<IGiftCard | null>(null);
  const [loading, setLoading] = useState<boolean>(!!(code && pin));
  const [error, setError] = useState<string | null>(
    (!code || !pin) ? 'Missing Gift Card Code or PIN.' : null
  );

  useEffect(() => {
    if (!code || !pin) {
      return;
    }

    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/gift-cards/reveal?code=${code}&pin=${pin}`);
        const data = await res.json();
        if (data.success) {
          setGiftCard(data.data);
        } else {
          setError(data.error || 'Failed to load details');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to database.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [code, pin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Preparing print layout...</p>
      </div>
    );
  }

  if (error || !giftCard) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full border border-gray-200 rounded-3xl p-8 space-y-4">
          <Info className="text-red-500 mx-auto" size={32} />
          <h2 className="text-xl font-bold">Print Initiation Failed</h2>
          <p className="text-xs text-gray-500">{error || 'Invalid credentials'}</p>
        </div>
      </div>
    );
  }

  const themeStyle = THEME_STYLES[giftCard.theme] || THEME_STYLES['Minimal Luxury'];
  const redeemUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://zoniraz.in'}/gift-cards/redeem?code=${code}&pin=${pin}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(redeemUrl)}&color=${themeStyle.rawTextColor.replace('#', '')}`;

  return (
    <div className="min-h-screen bg-[#FDFCF9] py-12 px-6 flex flex-col items-center justify-center font-serif" style={{ color: themeStyle.rawTextColor }}>
      
      {/* Printable CSS Helper Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: 2px solid ${themeStyle.rawTextColor} !important;
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Control bar / print instructions */}
      <div className="no-print max-w-2xl w-full bg-white border rounded-[30px] p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm" style={{ borderColor: `${themeStyle.rawTextColor}20` }}>
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg font-bold uppercase tracking-wider">Luxury Print Preparation</h3>
          <p className="text-[10px] uppercase font-bold text-gray-400 leading-relaxed tracking-wider">
            Tip: For a luxurious presentation, print on high-gsm cardstock and cut along the outer boundary lines.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="text-[#EAE1D5] hover:opacity-90 px-8 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center space-x-2 shrink-0 shadow-sm transition-all"
          style={{ backgroundColor: themeStyle.rawTextColor }}
        >
          <Printer size={14} />
          <span>Print Voucher</span>
        </button>
      </div>

      {/* Actual Gift Card Layout */}
      <div className="print-card w-full max-w-3xl bg-white border-4 border-dashed rounded-4xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-between aspect-[1.41/1] mx-auto"
           style={{ borderColor: themeStyle.rawTextColor }}>
        
        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch h-full">
          
          {/* Left Side: Visual Digital Card (approx 40% width) */}
          <div className="md:col-span-2 flex flex-col justify-between rounded-2xl p-6 text-white bg-linear-to-br min-h-55"
               style={{ 
                 backgroundImage: giftCard.theme === 'Minimal Luxury' ? 'linear-gradient(to bottom right, #3A1C16, #120704)' :
                                   giftCard.theme === 'Wedding Gold' ? 'linear-gradient(to bottom right, #6B1724, #3A0A10)' :
                                   giftCard.theme === 'Anniversary Velvet' ? 'linear-gradient(to bottom right, #0A1D37, #040D1A)' :
                                   giftCard.theme === 'Birthday Blush' ? 'linear-gradient(to bottom right, #6F3843, #401C24)' :
                                   giftCard.theme === 'Diwali Spark' ? 'linear-gradient(to bottom right, #7D1D09, #3A0C03)' :
                                   'linear-gradient(to bottom right, #1C1917, #0C0B0A)'
               }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[6px] uppercase tracking-[0.3em] opacity-60">Zoniraz Gifting</span>
                <h3 className="text-md font-serif italic tracking-wider font-bold">Zoniraz</h3>
              </div>
              <Gift size={16} className={themeStyle.accentColor} />
            </div>

            <div className="text-center italic font-serif text-[10px] my-4 opacity-90 line-clamp-3">
              &ldquo;{giftCard.personalMessage || 'Compliments of Zoniraz'}&rdquo;
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-3">
              <div>
                <span className="text-[5px] uppercase tracking-widest opacity-60 block">Prepared For</span>
                <span className="text-[9px] font-bold truncate max-w-25 block">{giftCard.recipientName}</span>
              </div>
              <div className="text-right">
                <span className="text-[5px] uppercase tracking-widest opacity-60 block">Voucher Value</span>
                <span className="text-md font-serif font-black italic">₹{giftCard.currentBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Print Presentation & Credentials */}
          <div className="md:col-span-3 flex flex-col justify-between space-y-6">
            
            {/* Header */}
            <div className="border-b pb-4" style={{ borderColor: `${themeStyle.rawTextColor}20` }}>
              <span className="text-[8px] uppercase tracking-[0.25em] font-bold text-gray-400">Official Luxury Voucher</span>
              <h2 className="text-xl font-bold tracking-widest uppercase italic mt-0.5" style={{ color: themeStyle.rawTextColor }}>Zoniraz Jewel House</h2>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-0.5">{giftCard.theme} Theme</p>
            </div>

            {/* Letter info */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-gray-400 block">Recipient</span>
                  <p className="font-bold uppercase tracking-wide">{giftCard.recipientName}</p>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-widest text-gray-400 block">Sender</span>
                  <p className="font-bold uppercase tracking-wide">{giftCard.senderName}</p>
                </div>
              </div>

              <div>
                <span className="text-[8px] uppercase tracking-widest text-gray-400 block">Security Credentials</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="bg-gray-50 border p-2 rounded-lg" style={{ borderColor: `${themeStyle.rawTextColor}15` }}>
                    <span className="text-[6px] uppercase tracking-widest text-gray-400 block">Code</span>
                    <span className="font-mono text-[11px] font-bold tracking-wider">{code}</span>
                  </div>
                  <div className="bg-gray-50 border p-2 rounded-lg" style={{ borderColor: `${themeStyle.rawTextColor}15` }}>
                    <span className="text-[6px] uppercase tracking-widest text-gray-400 block">PIN</span>
                    <span className="font-mono text-[11px] font-bold tracking-wider">{pin}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom/QR Code details */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: `${themeStyle.rawTextColor}20` }}>
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-widest text-gray-400 block">Validity</span>
                <p className="text-[9px] font-bold uppercase tracking-wider">
                  Until: {new Date(giftCard.expirationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-[8px] text-gray-400 leading-relaxed max-w-45">
                  Redeem online by applying the Code & PIN during checkout.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-1 text-center shrink-0">
                <Image
                  src={qrCodeUrl}
                  alt="Scan to Redeem"
                  width={75}
                  height={75}
                  className="border border-gray-200 p-0.5 bg-white"
                />
                <span className="text-[6px] uppercase tracking-widest font-black text-gray-400">Scan to Reveal</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Safe print fold guide instructions */}
      <div className="no-print max-w-2xl w-full text-center mt-12 space-y-2 opacity-50">
        <div className="flex items-center justify-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-bold">
          <Shield size={12} style={{ color: themeStyle.rawTextColor }} />
          <span>Secured Zoniraz Gifting System</span>
        </div>
        <p className="text-[9px] uppercase font-bold tracking-wider leading-relaxed">
          Zoniraz Gift Cards are non-transferable and subject to the Terms of Use.
        </p>
      </div>

    </div>
  );
}

export default function GiftCardPrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center flex-col space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
        <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Preparing print layout...</p>
      </div>
    }>
      <GiftCardPrintContent />
    </Suspense>
  );
}

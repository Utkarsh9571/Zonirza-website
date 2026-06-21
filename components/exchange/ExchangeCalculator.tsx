'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { calculateEstimatedExchangeValue, formatCurrencyINR } from '@/lib/exchangeCalculator';

interface ExchangeCalculatorProps {
  purpose: 'exchange' | 'sell';
  onPurposeChange: (purpose: 'exchange' | 'sell') => void;
}

export default function ExchangeCalculator({ purpose, onPurposeChange }: ExchangeCalculatorProps) {
  const [purity, setPurity] = useState('');
  const [weight, setWeight] = useState('');
  const [unknownPurity, setUnknownPurity] = useState(false);
  const [unknownWeight, setUnknownWeight] = useState(false);

  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  useEffect(() => {
    if (unknownPurity || unknownWeight || !purity || !weight) {
      setEstimatedValue(null);
      return;
    }

    const weightNum = parseFloat(weight);
    if (!isNaN(weightNum) && weightNum > 0) {
      const val = calculateEstimatedExchangeValue(weightNum, purity);
      setEstimatedValue(val);
    } else {
      setEstimatedValue(null);
    }
  }, [purity, weight, unknownPurity, unknownWeight]);

  const scrollToConsultation = () => {
    const sectionId = purpose === 'sell' ? 'sell-consultation-section' : 'consultation-section';
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isUnknown = unknownPurity || unknownWeight;

  return (
    <section id="calculator-section" className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 lg:px-12">

        <div className="text-center mb-12 space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.2em] font-bold">Value Calculator</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-text dark:text-white">
            Calculate Your Old Gold Value
          </h2>
          <p className="text-brand-text/60 dark:text-white/60 italic font-serif">
            Find out what your old gold is worth — instantly
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-[32px] overflow-hidden border border-brand-text/10 dark:border-white/10 shadow-lg flex flex-col xl:flex-row bg-white dark:bg-[#12100e]">

          {/* Left: Image Card */}
          <div className="xl:w-1/2 relative min-h-[400px] bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-10 flex flex-col justify-between">
              <div className="inline-flex items-center space-x-2 border border-brand-gold/30 rounded-full px-4 py-1.5 w-fit bg-black/20 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">A Zoniraz Promise</span>
              </div>

              <div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
                  Trusted by <span className="italic text-brand-gold">millions</span>,<br /> backed by legacy.
                </h3>
                <p className="text-white/80 italic text-sm">
                  Join thousands of families who chose Zoniraz.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="xl:w-1/2 p-10 xl:p-14 space-y-8">

            {/* Purpose Selector */}
            <div className="space-y-4">
              <label className="text-lg font-serif font-bold text-[#6d3d3d] dark:text-[#e08686]">Purpose</label>
              <div className="flex bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-xl overflow-hidden p-1">
                <button
                  onClick={() => onPurposeChange('exchange')}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${purpose === 'exchange'
                      ? 'bg-brand-gold text-white shadow-sm'
                      : 'text-brand-text/60 dark:text-white/60 hover:text-brand-text dark:hover:text-white hover:bg-black/5'
                    }`}
                >
                  Exchange
                </button>
                <button
                  onClick={() => onPurposeChange('sell')}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${purpose === 'sell'
                      ? 'bg-brand-gold text-white shadow-sm'
                      : 'text-brand-text/60 dark:text-white/60 hover:text-brand-text dark:hover:text-white hover:bg-black/5'
                    }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Purity */}
            <div className="space-y-4">
              <label className="text-lg font-serif font-bold text-[#6d3d3d] dark:text-[#e08686]">Karatage</label>

              <div className="flex flex-wrap gap-3">
                {['24K', '22K', '18K', '14K', '9K'].map(k => (
                  <button
                    key={k}
                    disabled={unknownPurity}
                    onClick={() => setPurity(k)}
                    className={`py-2 px-6 rounded-lg text-sm font-bold transition-all border ${purity === k && !unknownPurity
                        ? 'bg-brand-gold text-white border-brand-gold'
                        : 'bg-white dark:bg-white/5 text-brand-text/60 dark:text-white/60 border-[#d2b48c] dark:border-[#5a4836] hover:border-brand-gold/50 disabled:opacity-50'
                      }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              <label className="flex items-center space-x-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={unknownPurity}
                  onChange={(e) => setUnknownPurity(e.target.checked)}
                  className="accent-brand-gold w-4 h-4 rounded border-[#d2b48c]"
                />
                <span className="text-sm text-brand-text/70 dark:text-white/70">I don't know my karatage</span>
              </label>
            </div>

            {/* Weight */}
            <div className="space-y-4">
              <label className="text-lg font-serif font-bold text-[#6d3d3d] dark:text-[#e08686]">Weight</label>

              <div className="relative">
                <input
                  type="number"
                  disabled={unknownWeight}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 11.5"
                  className="w-full bg-white dark:bg-white/5 border border-[#d2b48c] dark:border-[#5a4836] rounded-xl py-3 px-4 focus:ring-1 focus:ring-brand-gold outline-none disabled:opacity-50 text-brand-text dark:text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold font-bold text-sm">g</span>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={unknownWeight}
                  onChange={(e) => setUnknownWeight(e.target.checked)}
                  className="accent-brand-gold w-4 h-4 rounded border-[#d2b48c]"
                />
                <span className="text-sm text-brand-text/70 dark:text-white/70">I don't know the exact weight</span>
              </label>
            </div>

            {/* Action / Result */}
            <div className="pt-4">
              {isUnknown ? (
                <button
                  onClick={scrollToConsultation}
                  className="w-full bg-[#8c5a5a] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#6d3d3d] transition-colors flex items-center justify-between px-6"
                >
                  <span>Talk to an Expert for Valuation</span>
                  <ChevronRight size={18} />
                </button>
              ) : estimatedValue ? (
                <div className="space-y-4">
                  <div className="bg-[#FAF9F6] dark:bg-white/5 border border-brand-gold/30 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <span className="text-sm font-bold text-brand-text/70 dark:text-white/70">
                      {purpose === 'exchange' ? 'Estimated Exchange Value:' : 'Estimated In-Store Sell Value:'}
                    </span>
                    <span className="text-3xl font-serif font-bold text-[#8c5a5a] dark:text-[#e08686]">{formatCurrencyINR(estimatedValue)}</span>
                    {purpose === 'exchange' ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-black mt-2 flex items-center bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                        ✓ 0% Deduction & 100% Value Retention Guaranteed
                      </span>
                    ) : (
                      <span className="text-[10px] text-brand-text/50 uppercase tracking-widest font-bold mt-2">
                        * Subject to physical verification at Alwar Branch
                      </span>
                    )}
                  </div>
                  <button
                    onClick={scrollToConsultation}
                    className="w-full bg-[#8c5a5a] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#6d3d3d] transition-colors flex items-center justify-between px-6"
                  >
                    <span>{purpose === 'exchange' ? 'Proceed to Exchange' : 'Book Valuation Visit'}</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full bg-[#bd9a9a] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-between px-6 cursor-not-allowed"
                >
                  <span>{purpose === 'exchange' ? 'Calculate Exchange Value' : 'Calculate Sell Value'}</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

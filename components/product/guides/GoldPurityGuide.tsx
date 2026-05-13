'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export function GoldPurityGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const purities = [
    { karat: '22K', gold: '91.6%', use: 'Traditional Jewelry, Investment', strength: 'Softer' },
    { karat: '18K', gold: '75.0%', use: 'Diamond Jewelry, Daily Wear', strength: 'Stronger' },
    { karat: '14K', gold: '58.5%', use: 'Casual Wear, Budget Friendly', strength: 'Very Strong' },
  ];

  return (
    <div className="border border-brand-text/5 dark:border-white/5 rounded-2xl overflow-hidden bg-white/50 dark:bg-brand-white/10 backdrop-blur-sm transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text hover:bg-brand-bg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Sparkles size={14} className="text-brand-gold" />
          <span>Gold Purity Guide</span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="p-6 pt-0 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-brand-text/60 leading-relaxed">
            Gold purity is measured in Karats (K). 24K is pure gold, but it's often too soft for jewelry. Alloys are added to increase durability and create different colors like Rose or White Gold.
          </p>
          
          <div className="space-y-3">
            {purities.map((p, i) => (
              <div key={i} className="p-4 rounded-xl border border-brand-text/5 dark:border-white/5 bg-white dark:bg-brand-accent transition-all hover:shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg dark:bg-brand-bg/50 text-brand-text text-[11px] font-bold border border-brand-text/5 dark:border-white/5">
                      {p.karat}
                    </span>
                    <div>
                      <h5 className="text-[10px] font-bold text-brand-text uppercase tracking-widest">{p.gold} Pure Gold</h5>
                      <p className="text-[9px] text-brand-text/40 dark:text-brand-text/50">{p.strength}</p>
                    </div>
                  </div>
                </div>
                <div className="h-[1px] bg-brand-text/5 dark:bg-white/5 my-2"></div>
                <p className="text-[9px] text-brand-text/60 italic">Best for: {p.use}</p>
              </div>
            ))}
          </div>

          <div className="bg-brand-bg dark:bg-brand-bg/50 p-4 rounded-xl border border-brand-text/5 dark:border-white/5">
            <h4 className="text-[9px] font-bold uppercase tracking-widest text-brand-text/40 dark:text-brand-text/50 mb-2">Color Alchemy</h4>
            <div className="flex justify-between">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 rounded-full bg-[#FFD700] border border-black/10"></div>
                <span className="text-[8px] uppercase tracking-tighter text-brand-text/60">Yellow</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 rounded-full bg-[#E5E4E2] border border-black/10"></div>
                <span className="text-[8px] uppercase tracking-tighter text-brand-text/60">White</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 rounded-full bg-[#B76E79] border border-black/10"></div>
                <span className="text-[8px] uppercase tracking-tighter text-brand-text/60">Rose</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DiamondGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const clarityLevels = [
    { grade: 'FL/IF', label: 'Flawless', desc: 'No inclusions or blemishes visible under 10x magnification.' },
    { grade: 'VVS1/2', label: 'Very Very Slightly Included', desc: 'Inclusions so slight they are difficult for a skilled grader to see.' },
    { grade: 'VS1/2', label: 'Very Slightly Included', desc: 'Minor inclusions that range from difficult to somewhat easy to see.' },
    { grade: 'SI1/2', label: 'Slightly Included', desc: 'Inclusions are noticeable to a skilled grader.' },
  ];

  return (
    <div className="border border-brand-text/5 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text hover:bg-brand-bg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Gem size={14} className="text-brand-gold" />
          <span>Diamond Clarity Guide</span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="p-6 pt-0 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-brand-text/60 leading-relaxed">
            Diamond clarity is a measure of the purity and rarity of the stone, graded by the visibility of characteristics under 10-power magnification.
          </p>
          
          <div className="space-y-3">
            {clarityLevels.map((level, i) => (
              <div key={i} className="p-3 rounded-xl border border-brand-text/5 bg-white transition-all hover:shadow-soft">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-brand-gold">{level.grade}</span>
                  <span className="text-[9px] uppercase tracking-widest text-brand-text/40">{level.label}</span>
                </div>
                <p className="text-[10px] text-brand-text/60 leading-tight">{level.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-square rounded-xl bg-brand-bg flex flex-col items-center justify-center p-4 text-center border border-brand-text/5">
              <span className="text-[9px] uppercase tracking-widest text-brand-text/40 mb-2">Colorless</span>
              <span className="text-lg font-serif italic text-brand-text font-bold">D-F</span>
            </div>
            <div className="aspect-square rounded-xl bg-brand-bg flex flex-col items-center justify-center p-4 text-center border border-brand-text/5">
              <span className="text-[9px] uppercase tracking-widest text-brand-text/40 mb-2">Near Colorless</span>
              <span className="text-lg font-serif italic text-brand-text font-bold">G-J</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

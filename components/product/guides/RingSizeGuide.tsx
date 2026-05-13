'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Ruler } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RingSizeGuide() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ring-guide', handleOpen);
    return () => window.removeEventListener('open-ring-guide', handleOpen);
  }, []);

  const sizes = [
    { in: '1.81 cm', size: '8' },
    { in: '1.85 cm', size: '8.5' },
    { in: '1.89 cm', size: '9' },
    { in: '1.93 cm', size: '9.5' },
    { in: '1.97 cm', size: '10' },
    { in: '2.01 cm', size: '10.5' },
    { in: '2.06 cm', size: '11' },
  ];

  return (
    <div className="border border-brand-text/5 dark:border-white/5 rounded-2xl overflow-hidden bg-white/50 dark:bg-brand-white/10 backdrop-blur-sm transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text hover:bg-brand-bg transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Ruler size={14} className="text-brand-gold" />
          <span>Ring Size Guide</span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="p-6 pt-0 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs text-brand-text/60 leading-relaxed">
            Measuring your ring size is easy. You can use a piece of string or a strip of paper. Wrap it around the base of the finger you want to measure. Mark the point where the ends meet. Measure the length with a ruler in millimeters.
          </p>
          
          <div className="overflow-hidden rounded-xl border border-brand-text/5 dark:border-white/5">
            <table className="w-full text-[10px]">
              <thead className="bg-brand-bg dark:bg-brand-bg/50 text-brand-text/40 dark:text-brand-text/50">
                <tr>
                  <th className="p-3 text-left font-bold uppercase tracking-widest">Diameter (Inner)</th>
                  <th className="p-3 text-left font-bold uppercase tracking-widest">Indian/US Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {sizes.map((s, i) => (
                  <tr key={i} className="hover:bg-brand-bg/30 transition-colors">
                    <td className="p-3 text-brand-text font-medium">{s.in}</td>
                    <td className="p-3 text-brand-text font-bold">{s.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-2">Pro Tip</h4>
            <p className="text-[10px] text-brand-text/70 leading-relaxed">
              Measure your finger at the end of the day when it's at its largest. Ensure the ring fits snugly over the knuckle.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

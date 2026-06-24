'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 'step1', title: '1. Submit an inquiry online.' },
  { id: 'step2', title: '2. Speak with our luxury gold expert.' },
  { id: 'step3', title: '3. Visit our Alwar branch with your gold.' },
  { id: 'step4', title: '4. Non-destructive purity verification.' },
  { id: 'step5', title: '5. Accurate weight assessment.' },
  { id: 'step6', title: '6. Final transparent price offer.' },
  { id: 'step7', title: '7. Instant in-store settlement.' },
];

export default function SellGoldHowItWorks() {
  const [expandedId, setExpandedId] = useState<string | null>('step1');

  return (
    <section id="how-sell-works-section" className="py-24 bg-[#FAF9F6] dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black mb-4">The Process</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-text dark:text-white leading-tight">
            How Selling Your Gold Works
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Store Locator / Alwar Focus */}
          <div className="space-y-6 h-full flex flex-col justify-center">
            <div className="bg-white dark:bg-[#12100e] rounded-3xl p-10 border border-brand-text/10 dark:border-white/10 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-[#8c3a3a]/10 text-[#8c3a3a] dark:text-[#e08686] text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  Exclusive Service
                </span>
              </div>
              
              <span className="text-6xl mb-6 block mt-4">🏛️</span>
              <h4 className="text-3xl font-serif font-bold text-brand-text dark:text-white mb-4">Zoniraz Alwar</h4>
              <p className="text-brand-text/60 dark:text-white/60 text-sm mb-8 leading-relaxed">
                For the highest level of security and transparency, our gold buying service is conducted exclusively in person at our flagship Alwar boutique.
              </p>
              
              <div className="bg-[#FAF9F6] dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl p-6 w-full max-w-sm mx-auto shadow-sm">
                <p className="text-sm font-medium text-brand-text/80 dark:text-white/80">
                  SHOP NO. 7, HANUMAN BURJ,<br />
                  Alwar, Rajasthan, 301001
                </p>
              </div>

              <div className="mt-8 text-[11px] text-[#8c3a3a] dark:text-[#e08686] font-bold uppercase tracking-widest">
                No online buying &middot; No courier service
              </div>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#12100e] border border-brand-text/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              {steps.map((step, index) => {
                const isExpanded = expandedId === step.id;
                
                return (
                  <div key={step.id} className="border-b border-brand-text/10 dark:border-white/10 last:border-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : step.id)}
                      className={cn(
                        "w-full py-5 px-6 flex items-center justify-between text-left transition-colors",
                        isExpanded ? "bg-linear-to-r from-brand-gold/10 to-transparent" : "hover:bg-brand-gold/5"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          isExpanded ? "bg-brand-gold" : "bg-brand-gold/50"
                        )} />
                        <h4 className={cn(
                          "text-sm font-bold transition-colors",
                          isExpanded ? "text-brand-gold" : "text-brand-text dark:text-white"
                        )}>
                          {step.title}
                        </h4>
                      </div>
                      <div className="text-brand-text/40 dark:text-white/40 font-bold ml-4">
                        {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden bg-white dark:bg-[#12100e]"
                        >
                          <div className="py-4 px-10 text-brand-text/70 dark:text-white/70 text-sm">
                            {index === 0 && "Fill out the consultation form below with details about the gold you wish to sell."}
                            {index === 1 && "One of our specialists will contact you to discuss your requirements and schedule your visit."}
                            {index === 2 && "Bring your gold to our Alwar branch for a secure, private evaluation."}
                            {index === 3 && "We use advanced Karatmeter technology to determine exact purity without damaging your items."}
                            {index === 4 && "If purity is confirmed, items are melted and weighed in front of you for 100% transparency."}
                            {index === 5 && "You receive our best market offer based on live gold rates and verified purity."}
                            {index === 6 && "Once accepted, payment is settled immediately in-store via secure bank transfer or valid channels."}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

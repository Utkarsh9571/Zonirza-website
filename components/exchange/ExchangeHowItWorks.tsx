'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const steps = [
  { id: 'step1', title: 'Bring your old gold purchased from any jeweller.' },
  { id: 'step2', title: 'Have it purity checked in front of you.' },
  { id: 'step3', title: 'Your gold is melted before your eyes.' },
  { id: 'step4', title: 'Final weight assessed for maximum value.' },
  { id: 'step5', title: 'Get the best value.' },
  { id: 'step6', title: 'Upgrade to new Gold or Diamond jewellery.' },
  { id: 'step7', title: 'Exchange Terms & Conditions.' },
];


export default function ExchangeHowItWorks() {
  const [expandedId, setExpandedId] = useState<string | null>('step1');

  return (
    <section id="how-it-works-section" className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-text dark:text-white leading-tight">
            Watch How Easily You Can Exchange Your <br /> Jewellery at Zoniraz
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left: Store Locator */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white text-center">
              1. Select Your Preferred Store for Exchange
            </h3>
            
            <div className="bg-[#FAF9F6] dark:bg-[#12100e] rounded-3xl border border-brand-text/10 dark:border-white/10 shadow-sm h-full flex flex-col justify-center items-center text-center">
              <h4 className="text-2xl font-serif font-bold text-brand-text dark:text-white mb-2">Visit Our Alwar Branch</h4>
              <p className="text-brand-text/60 dark:text-white/60 text-sm mb-8 max-w-sm">Experience our premium exchange service in person at our flagship store.</p>
              
              <div className="bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl w-full max-w-sm hover:border-brand-gold transition-colors shadow-sm">
                <span className="text-5xl mb-4 block">🏛️</span>
                <h5 className="text-xl font-bold text-[#8c3a3a] dark:text-[#e08686] mb-2">Zoniraz Alwar</h5>
                <p className="text-sm text-brand-text/70 dark:text-white/70 mb-6">
                  SHOP NO. 7, HANUMAN BURJ,<br />
                  ALWAR, Alwar, Rajasthan, 301001
                </p>
                
                <button 
                  onClick={() => document.getElementById('consultation-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full bg-[#8c5a5a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#6d3d3d] transition-colors"
                >
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white text-center">
              2. How It Works: Zoniraz Jewellery Exchange Explained
            </h3>
            
            <div className="bg-white dark:bg-[#12100e] border border-brand-text/10 dark:border-white/10 rounded-lg overflow-hidden">
              {steps.map((step, index) => {
                const isExpanded = expandedId === step.id;
                
                return (
                  <div key={step.id} className="border-b border-brand-text/10 dark:border-white/10 last:border-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : step.id)}
                      className={cn(
                        "w-full py-4 px-6 flex items-center justify-between text-left transition-colors",
                        isExpanded ? "bg-gradient-to-r from-brand-gold/10 to-transparent" : "hover:bg-brand-gold/5"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
                        <h4 className="text-sm font-bold text-brand-text dark:text-white">
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
                            {index === 0 && "We accept gold from 9KT to 22KT, even in the smallest quantities."}
                            {index === 1 && "Our experts use non-destructive technology to accurately determine the purity."}
                            {index === 2 && "For transparency, the gold is melted and weighed right in front of your eyes."}
                            {index === 3 && "We offer competitive market rates based on real-time live gold prices."}
                            {index === 4 && "No hidden deductions or confusing calculations."}
                            {index === 5 && "Use your exchange value to purchase any stunning new piece from our collections."}
                            {index === 6 && "Exchange value must be fully redeemed against new jewellery purchases."}
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

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, Scale, RefreshCw, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

const pillars = [
  {
    id: 'acceptance',
    title: 'Acceptance',
    icon: RefreshCw,
    imageClass: "bg-[url('https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1974&auto=format&fit=crop')]",
    subtitle: 'Bring in any gold.',
    description: 'From 9 to 22 karats, from any jeweller, even the small and the broken.',
    points: [
      { title: 'Exchange 9K to 22K old gold', desc: 'No matter the purity, bring in your old gold, and we\'ll help you upgrade.' },
      { title: 'Exchange all year round', desc: 'No waiting for offers — come in whenever you\'re ready to upgrade.' },
      { title: 'Exchange small or broken jewellery', desc: 'We accept even small or broken pieces because every gram counts.' }
    ]
  },
  {
    id: 'value',
    title: 'Value',
    icon: Scale,
    imageClass: "bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop')]",
    subtitle: 'The best price, guaranteed.',
    description: 'Guaranteed 100% value retention with 0% deduction on your old gold exchange — every visit, all year round.',
    points: [
      { title: 'Guaranteed 0% Deduction', desc: 'Get 100% value on your gold exchange. Buying rate = Selling rate with zero melting or handling deductions.' },
      { title: 'We accept old gold from any jeweller', desc: 'No bills required.' },
      { title: 'Exchange gold for diamonds', desc: 'Upgrade your old gold for stunning diamond jewellery.' }
    ]
  },
  {
    id: 'process',
    title: 'Process',
    icon: ShieldCheck,
    imageClass: "bg-[url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop')]",
    subtitle: 'Watched. Weighed. Witnessed.',
    description: 'Karatmeter purity, melted in front of you. A scientific, transparent ritual.',
    points: [
      { title: 'Complete transparency, start to finish', desc: 'Watch the melting and valuation of your old gold happen right in front of your eyes.' },
      { title: 'Dedicated craftsman at every store', desc: 'Skilled karigars handle your old gold with precision and care.' },
      { title: 'A scientific and accurate evaluation', desc: 'State of the art equipment to assess the purity and weight of your old gold.' }
    ]
  },
  {
    id: 'legacy',
    title: 'Legacy',
    icon: Gem,
    imageClass: "bg-[url('https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2126&auto=format&fit=crop')]",
    subtitle: 'A name you can trust.',
    description: 'Built on years of integrity, craftsmanship, and unyielding quality.',
    points: [
      { title: 'Uncompromising Quality', desc: 'Every new piece you exchange for meets our rigorous global standards.' },
      { title: 'Ethical Sourcing', desc: 'We ensure all materials are responsibly and ethically sourced.' },
      { title: 'Lifetime Assurance', desc: 'A relationship that extends far beyond a single transaction.' }
    ]
  }
];

export default function ExchangeTrustPillars() {
  const [activePillar, setActivePillar] = useState(pillars[0].id);

  return (
    <section className="bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 lg:px-12 py-24 border-t border-brand-text/10 dark:border-white/10">
        
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Why Exchange With Us</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-text dark:text-white leading-[1.2]">
            The Gold Exchange <span className="italic text-brand-gold">Advantage</span>
          </h2>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-px bg-brand-text/20 dark:bg-white/20" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-text/60 dark:text-white/60">Four Pillars of Trust</span>
            <div className="w-12 h-px bg-brand-text/20 dark:bg-white/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 border border-brand-text/10 dark:border-white/10 rounded-[40px] overflow-hidden bg-[#FAF9F6] dark:bg-[#12100e]">
          
          {/* Left: Dynamic Image Display */}
          <div className="relative h-100 lg:h-auto overflow-hidden">
            <AnimatePresence mode="wait">
              {pillars.map((pillar) => (
                activePillar === pillar.id && (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8 }}
                    className={cn("absolute inset-0 bg-cover bg-center", pillar.imageClass)}
                  >
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-10 lg:p-16">
                      <p className="text-brand-gold font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                        Pillar 0{pillars.findIndex(p => p.id === pillar.id) + 1} &middot; {pillar.title}
                      </p>
                      <h3 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4">
                        {pillar.subtitle.split(' ').map((word, i) => 
                          i === pillar.subtitle.split(' ').length - 1 ? <span key={i} className="italic">{word}</span> : <span key={i}>{word} </span>
                        )}
                      </h3>
                      <p className="text-white/80 text-lg max-w-md italic">
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Right: Accordion List */}
          <div className="p-8 lg:p-16 space-y-2">
            {pillars.map((pillar) => {
              const isActive = activePillar === pillar.id;

              return (
                <div key={pillar.id} className="border-b border-brand-text/10 dark:border-white/10 last:border-0 pb-2">
                  <button
                    onClick={() => setActivePillar(pillar.id)}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center space-x-6">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                        isActive ? "bg-brand-gold text-white" : "border border-brand-text/20 dark:border-white/20 text-brand-gold group-hover:border-brand-gold"
                      )}>
                        <pillar.icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-serif font-bold text-brand-text dark:text-white">
                          {pillar.title}
                        </h4>
                      </div>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={cn(
                        "text-brand-gold transition-transform duration-500",
                        isActive ? "rotate-180" : "opacity-50 group-hover:opacity-100"
                      )} 
                    />
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pl-16 space-y-6">
                          {pillar.points.map((point, i) => (
                            <div key={i} className="space-y-1">
                              <h5 className="font-bold text-brand-text dark:text-white text-sm">
                                {point.title}
                              </h5>
                              <p className="text-brand-text/60 dark:text-white/60 text-sm leading-relaxed">
                                {point.desc}
                              </p>
                            </div>
                          ))}
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
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function ExchangeStats() {
  const scrollToCalculator = () => {
    const el = document.getElementById('calculator-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-32 bg-[#4a1c1c] dark:bg-[#2c1010] relative overflow-hidden flex items-center justify-center min-h-150">
      {/* Subtle radial gradient to match design */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#5e2323] via-[#4a1c1c] to-[#361313] dark:from-[#3a1515] dark:via-[#2c1010] dark:to-[#1a0808]" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Removed exact numbers per request */}
          
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-white italic">
            Happy exchangers, and counting.
          </h3>
          
          <p className="text-[#f4e0c4]/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed pt-2">
            Every hour, customers join our Exchange community to upgrade their old gold at a better value.
          </p>

          <div className="pt-8">
            <button 
              onClick={scrollToCalculator}
              className="bg-[#c2964a] text-[#361313] py-4 px-8 rounded-full font-bold text-sm hover:bg-[#d4a85c] transition-colors inline-flex items-center space-x-2"
            >
              <span>Know Exchange Value</span>
              <div className="w-6 h-6 rounded-full bg-[#361313] flex items-center justify-center text-[#c2964a] ml-2">
                 <ChevronRight size={14} />
              </div>
            </button>
          </div>
          
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full text-center">
         <p className="text-brand-gold/50 text-[10px] font-bold tracking-[0.2em] uppercase">Exchange Value</p>
      </div>
    </section>
  );
}

// Keeping Final CTA here in case it's still needed by the page layout, 
// though we can adjust it or leave it as it was if not specified differently.
export function ExchangeFinalCTA() {
  const scrollToConsultation = () => {
    const el = document.getElementById('consultation-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a] relative text-center border-t border-brand-text/10 dark:border-white/10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#6d3d3d] dark:text-[#e08686] mb-6">
              Ready to upgrade your old gold?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={scrollToConsultation}
                className="w-full sm:w-auto bg-[#8c5a5a] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-[#6d3d3d] transition-all"
              >
                Talk to an Expert
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

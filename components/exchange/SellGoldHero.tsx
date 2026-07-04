'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function SellGoldHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-[90vh] min-h-150 flex items-center overflow-hidden bg-[#1f1512] pt-40 md:pt-48 border-b border-brand-gold/10">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-r from-[#1f1512] via-[#1f1512]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589674781759-c21c37956a44?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-20">
        <div className="max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 border border-brand-gold/30 rounded-full px-4 py-1.5 backdrop-blur-sm bg-black/20"
          >
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">Sell Old Gold Program</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.1]"
          >
            Turn your <span className="italic text-brand-gold">unused gold</span> into instant value.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-base md:text-lg text-white/80 max-w-xl font-light leading-relaxed">
              A trusted, secure, and fully transparent process. We assess your old gold's purity right in front of you for the highest market value.
            </p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#e08686]">
              * Currently available ONLY at our Flagship branch
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2 pb-4"   
          >
            <button
              onClick={() => scrollToSection('sell-consultation-section')}
              className="w-full sm:w-auto bg-brand-gold text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#B38B36] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              <span>Get Valuation Consultation</span>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => scrollToSection('how-sell-works-section')}
              className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
            >
              <span>How it works</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

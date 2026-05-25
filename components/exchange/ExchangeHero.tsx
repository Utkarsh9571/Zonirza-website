'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ExchangeHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-[#1f1512] pt-24 md:pt-32">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 z-0">
        {/* We would use a real image here, but for now we use a gradient to simulate a cinematic background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1f1512] via-[#1f1512]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-20">
        <div className="max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 border border-brand-gold/30 rounded-full px-4 py-1.5 backdrop-blur-sm bg-black/10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">The Zoniraz Exchange Program</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1]"
          >
            Upgrade your <span className="italic text-brand-gold">old gold</span> into timeless jewellery.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 max-w-xl font-light leading-relaxed"
          >
            Experience the most transparent, rewarding, and luxurious exchange process. We accept gold of any purity, transforming your memories into magnificent new masterpieces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 pb-8"   
          >
            <button
              onClick={() => scrollToSection('calculator-section')}
              className="w-full sm:w-auto bg-brand-gold text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#B38B36] transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              <span>Calculate Value</span>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => scrollToSection('consultation-section')}
              className="w-full sm:w-auto bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
            >
              <span>Talk to an Expert</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className=" bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent z-10" />
    </section>
  );
}

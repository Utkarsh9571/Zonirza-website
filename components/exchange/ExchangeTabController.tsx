'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Exchange Components
import ExchangeHero from '@/components/exchange/ExchangeHero';
import ExchangeServiceCards from '@/components/exchange/ExchangeServiceCards';
import ExchangeHowItWorks from '@/components/exchange/ExchangeHowItWorks';
import ExchangeConsultation from '@/components/exchange/ExchangeConsultation';
import ExchangeTrustPillars from '@/components/exchange/ExchangeTrustPillars';
import { ExchangeStats, ExchangeFinalCTA } from '@/components/exchange/ExchangeShared';

// Sell Gold Components
import SellGoldHero from '@/components/exchange/SellGoldHero';
import SellGoldHowItWorks from '@/components/exchange/SellGoldHowItWorks';
import SellGoldConsultation from '@/components/exchange/SellGoldConsultation';

// Shared Components
import ExchangeCalculator from '@/components/exchange/ExchangeCalculator';

export default function ExchangeTabController({ initialTab = 'exchange' }: { initialTab?: 'exchange' | 'sell' }) {
  const [activeTab, setActiveTab] = useState<'exchange' | 'sell'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tab: 'exchange' | 'sell') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] relative">
      
      {/* Floating Segmented Toggle */}
      <div className="fixed top-32 lg:top-40 left-1/2 -translate-x-1/2 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md p-1.5 rounded-full border border-brand-gold/20 shadow-premium w-[90%] max-w-sm">
        <div className="relative flex">
          <button
            onClick={() => handleTabChange('exchange')}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors z-10 ${
              activeTab === 'exchange' ? 'text-white' : 'text-brand-text dark:text-white hover:text-brand-gold'
            }`}
          >
            Exchange Old Gold
          </button>
          <button
            onClick={() => handleTabChange('sell')}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-bold uppercase tracking-widest transition-colors z-10 ${
              activeTab === 'sell' ? 'text-white' : 'text-brand-text dark:text-white hover:text-brand-gold'
            }`}
          >
            Sell Old Gold
          </button>
          
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-brand-gold rounded-full z-0"
            initial={false}
            animate={{ 
              x: activeTab === 'exchange' ? '0%' : '100%',
              width: '50%'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'exchange' ? (
          <motion.div
            key="exchange-flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ExchangeHero />
            <ExchangeTrustPillars />
            <ExchangeStats />
            <ExchangeCalculator purpose="exchange" onPurposeChange={setActiveTab} />
            <ExchangeConsultation />
            <ExchangeHowItWorks />
            <ExchangeServiceCards />
            <ExchangeFinalCTA />
          </motion.div>
        ) : (
          <motion.div
            key="sell-flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SellGoldHero />
            <SellGoldHowItWorks />
            <ExchangeCalculator purpose="sell" onPurposeChange={setActiveTab} />
            <SellGoldConsultation />
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}

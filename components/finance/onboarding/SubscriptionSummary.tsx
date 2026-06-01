import React from 'react';
import { displayPrice } from '@/lib/currency';
import { useCurrencyStore } from '@/store/currencyStore';

interface SubscriptionSummaryProps {
  planType: string;
  monthlyAmount: number;
}

export const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({ planType, monthlyAmount }) => {
  const { currentCurrency, rates } = useCurrencyStore();

  return (
    <div className="bg-[#FAF7F5] dark:bg-[#1A1A1A] p-6 rounded-xl border border-brand-text/10 dark:border-white/10 shadow-sm">
      <div className="mb-6 border-b border-brand-text/10 dark:border-white/10 pb-4">
        <h3 className="text-lg font-bold text-brand-text dark:text-white mb-2">Subscription Summary</h3>
        <p className="text-xs text-brand-text/60 dark:text-white/60">Kindly check your monthly subscription amount.</p>
      </div>

      <div className="bg-[#FDE1E6]/30 dark:bg-brand-gold/10 border border-[#FDE1E6] dark:border-brand-gold/20 p-6 rounded-xl space-y-4">
        <div className="text-sm font-bold text-brand-text dark:text-brand-gold mb-2 pb-2 border-b border-brand-text/5 dark:border-white/5">
          {planType}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-brand-text/80 dark:text-white/80">Subscription Amount (Monthly)</span>
          <span className="font-bold text-brand-text dark:text-white">{displayPrice(monthlyAmount, currentCurrency, rates)}</span>
        </div>
        
        <div className="flex justify-between items-center text-base pt-2">
          <span className="font-bold text-brand-text dark:text-white">You Pay</span>
          <span className="font-bold text-brand-text dark:text-white">{displayPrice(monthlyAmount, currentCurrency, rates)}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-brand-text/10 dark:border-white/10 text-center">
        <p className="text-xs text-brand-text/60 dark:text-white/60">
          Any Questions? Please call us at <a href="tel:+919784836060" className="text-brand-gold font-bold hover:underline">97848 36060</a>
        </p>
      </div>
    </div>
  );
};

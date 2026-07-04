import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Wallet, Tag, ShoppingBag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IProduct } from '@/models/Product';
import { ProductConfiguration } from '@/lib/pricing';
import { calculateMonthlyPlan } from '@/lib/monthlyPlan';
import { displayPrice } from '@/lib/currency';
import { useCurrencyStore } from '@/store/currencyStore';

interface MonthlyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct;
  config: ProductConfiguration;
}

export const MonthlyPlanModal: React.FC<MonthlyPlanModalProps> = ({
  isOpen,
  onClose,
  product,
  config,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const { currentCurrency, rates } = useCurrencyStore();
  const router = useRouter();

  if (!isMounted || !isOpen) return null;

  const planDetails = calculateMonthlyPlan(product, config);

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className={cn(
          "bg-white dark:bg-[#1A1A1A] w-full sm:max-w-4xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative transform transition-transform duration-300",
          "rounded-t-3xl sm:rounded-b-2xl h-[90vh] sm:h-auto"
        )}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="relative pt-6 pb-4 px-6 border-b border-brand-text/10 dark:border-white/10 shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-brand-text/50 hover:text-brand-text dark:text-white/50 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl sm:text-3xl font-serif text-brand-text dark:text-brand-gold text-center">
            Smart Gold 10+1 Plan
          </h2>
        </div>

        {/* Sub-header strip */}
        <div className="bg-brand-gold/10 dark:bg-brand-gold/5 py-3 px-6 flex flex-col sm:flex-row justify-between items-center text-sm font-medium border-b border-brand-gold/20 shrink-0 gap-2 sm:gap-0">
          <div className="flex gap-2">
            <span className="text-brand-text/60 dark:text-white/60">Selected Product:</span>
            <span className="text-brand-text dark:text-white line-clamp-1 max-w-50">{product.name}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-brand-gold/30"></div>
          <div className="flex gap-2">
            <span className="text-brand-text/60 dark:text-white/60">Product Value:</span>
            <span className="text-brand-text dark:text-white">{displayPrice(planDetails.totalPrice, currentCurrency, rates)}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-brand-gold/30"></div>
          <div className="flex gap-2">
            <span className="text-brand-text/60 dark:text-white/60">Recommended Monthly Amount:</span>
            <span className="text-brand-gold font-bold">{displayPrice(planDetails.monthlyAmount, currentCurrency, rates)}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col sm:flex-row gap-8">
          
          {/* Left Column: Timeline */}
          <div className="flex-1 space-y-8 relative">
            <div className="absolute left-4.75 top-4 bottom-4 w-0.5 bg-brand-gold/20 z-0"></div>
            
            <div className="relative z-10 flex gap-6">
              <div className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center shrink-0 shadow-lg">
                <Wallet size={20} />
              </div>
              <div>
                <h3 className="font-bold text-brand-text dark:text-white text-lg mb-1">Pay Monthly</h3>
                <p className="text-sm text-brand-text/70 dark:text-white/70">10 month installments with easy payment options</p>
              </div>
            </div>

            <div className="relative z-10 flex gap-6">
              <div className="w-10 h-10 rounded-full bg-brand-text dark:bg-brand-gold/20 text-white dark:text-brand-gold flex items-center justify-center shrink-0 shadow-lg">
                <Tag size={20} />
              </div>
              <div>
                <h3 className="font-bold text-brand-text dark:text-white text-lg mb-1">Get Special Discount</h3>
                <p className="text-sm text-brand-text/70 dark:text-white/70">Get 1 monthly installment for FREE in the 11th month</p>
              </div>
            </div>

            <div className="relative z-10 flex gap-6">
              <div className="w-10 h-10 rounded-full bg-brand-text dark:bg-brand-gold/20 text-white dark:text-brand-gold flex items-center justify-center shrink-0 shadow-lg">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-bold text-brand-text dark:text-white text-lg mb-1">Redeem & Purchase</h3>
                <p className="text-sm text-brand-text/70 dark:text-white/70">Redeem final amount after 11 months to purchase the jewellery of your choice</p>
              </div>
            </div>
          </div>

          {/* Right Column: Calculation Summary */}
          <div className="flex-1">
            <div className="bg-[#FAFAFA] dark:bg-[#222222] border border-brand-text/10 dark:border-white/10 rounded-xl p-6 shadow-soft">
              
              <div className="flex justify-between items-center py-3 border-b border-brand-text/5 dark:border-white/5">
                <span className="text-sm text-brand-text/80 dark:text-white/80">Recommended Monthly Amount</span>
                <span className="font-semibold text-brand-text dark:text-white">{displayPrice(planDetails.monthlyAmount, currentCurrency, rates)}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-brand-text/5 dark:border-white/5">
                <div>
                  <div className="text-sm text-brand-text/80 dark:text-white/80">Your total payment</div>
                  <div className="text-[11px] text-brand-text/50 dark:text-white/50">Period of 10 months</div>
                </div>
                <span className="font-semibold text-brand-text dark:text-white">{displayPrice(planDetails.monthlyAmount * 10, currentCurrency, rates)}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-brand-text/5 dark:border-white/5">
                <div>
                  <div className="text-sm text-brand-gold font-bold">100% Discount on 11th installment</div>
                  <div className="text-[11px] text-brand-gold/70">100% of 1 month installment value</div>
                </div>
                <span className="font-bold text-brand-gold">{displayPrice(planDetails.bonusAmount, currentCurrency, rates)}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-brand-text/5 dark:border-white/5">
                <div>
                  <div className="text-sm text-brand-text/80 dark:text-white/80">Buy any jewellery worth</div>
                  <div className="text-[11px] text-brand-text/50 dark:text-white/50">After 11th month</div>
                </div>
                <span className="font-bold text-brand-text dark:text-white">{displayPrice(planDetails.totalAccumulated, currentCurrency, rates)}</span>
              </div>

              <div className="flex justify-between items-center py-4 mt-2">
                <span className="text-sm text-brand-text/80 dark:text-white/80">You effectively pay</span>
                <div className="bg-green-600/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1 border border-green-600/20">
                  <Check size={14} />
                  {planDetails.effectiveSavingsPercent}% discount!
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#F8F8F8] dark:bg-[#151515] p-6 border-t border-brand-text/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <p className="text-xs text-brand-text/60 dark:text-white/60 text-center sm:text-left flex-1">
            <span className="text-brand-gold font-semibold">Please Note:</span> You can purchase any jewellery using the accumulated amount after 11 months* <a href="/terms" className="text-brand-text dark:text-white underline">T&C</a>
          </p>
          <button 
            className="w-full sm:w-auto px-10 py-4 bg-brand-gold text-white font-bold tracking-wider rounded-md hover:bg-brand-gold/90 transition-colors shadow-premium whitespace-nowrap"
            onClick={() => {
              onClose();
              router.push('/plans/onboarding/gold_mine');
            }}
          >
            SUBSCRIBE NOW
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

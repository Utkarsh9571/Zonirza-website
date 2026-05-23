'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { displayPrice } from '@/lib/currency';
import { useCurrencyStore } from '@/store/currencyStore';
import { Check } from 'lucide-react';

export const GoldMineCalculator = () => {
  const { currentCurrency, rates } = useCurrencyStore();
  const [monthlyAmount, setMonthlyAmount] = useState<number>(2000);

  // Calculation logic based on 10+1 plan
  const durationMonths = 10;
  const totalPayment = monthlyAmount * durationMonths;
  const bonusAmount = monthlyAmount; // 100% of 1 month installment
  const maturityValue = totalPayment + bonusAmount;
  const effectiveDiscountPercent = ((bonusAmount / totalPayment) * 100).toFixed(2);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyAmount(Number(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto my-16 p-8 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-brand-text/5 dark:border-white/5">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-brand-text dark:text-brand-gold mb-2">Gold Mine Calculator</h2>
        <p className="text-sm text-brand-text/60 dark:text-white/60">Calculate your savings and maturity value instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Input & Visualization */}
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-brand-text dark:text-white mb-4">
              Slide or enter monthly installment amount
            </label>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 border border-brand-gold/30 rounded-lg p-3 bg-brand-gold/5 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold transition-all">
                <span className="text-xs text-brand-text/50 dark:text-white/50 block">Monthly Amount</span>
                <input 
                  type="number"
                  min={2000}
                  step={500}
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="w-full bg-transparent border-none outline-none font-bold text-lg text-brand-text dark:text-white mt-1 p-0"
                />
              </div>
            </div>

            <input 
              type="range"
              min={2000}
              max={100000}
              step={500}
              value={monthlyAmount}
              onChange={handleSliderChange}
              className="w-full h-2 bg-brand-gold/20 rounded-lg appearance-none cursor-pointer accent-brand-gold"
            />
            <div className="flex justify-between mt-2 text-xs text-brand-text/50 dark:text-white/50">
              <span>{displayPrice(2000, currentCurrency, rates)}</span>
              <span>{displayPrice(100000, currentCurrency, rates)}</span>
            </div>
          </div>

          {/* Simple Visual Pie (CSS based) */}
          <div className="flex justify-center pt-4">
            <div className="relative w-48 h-48 rounded-full shadow-inner border-[8px] border-[#FDE1E6] flex items-center justify-center">
               <div 
                 className="absolute inset-0 rounded-full border-[8px] border-[#38B259] transition-all duration-500" 
                 style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 10%, 50% 10%)' }} // Approx 1/11th chunk for visualization
               ></div>
               <div className="text-center z-10 bg-white dark:bg-[#1A1A1A] w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-md">
                 <span className="text-[10px] text-brand-text/60 dark:text-white/60">You Pay</span>
                 <span className="font-bold text-brand-text dark:text-white">{displayPrice(totalPayment, currentCurrency, rates)}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Output Summary */}
        <div className="flex flex-col justify-center">
          <div className="bg-[#FAFAFA] dark:bg-[#222222] border border-brand-text/10 dark:border-white/10 rounded-xl p-8 shadow-soft h-full flex flex-col justify-between">
            
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-brand-text/5 dark:border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm bg-[#FDE1E6]"></div>
                    <span className="text-sm font-bold text-brand-text dark:text-white">Your total payment</span>
                  </div>
                  <p className="text-[11px] text-brand-text/50 dark:text-white/50 ml-4">(Period of {durationMonths} months)</p>
                </div>
                <span className="font-bold text-brand-text dark:text-white">{displayPrice(totalPayment, currentCurrency, rates)}</span>
              </div>

              <div className="flex justify-between items-end border-b border-brand-text/5 dark:border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm bg-[#38B259]"></div>
                    <span className="text-sm font-bold text-[#38B259]">100% Discount on 11th installment</span>
                  </div>
                  <p className="text-[11px] text-[#38B259]/70 ml-4">(100% of 1 month installment value)</p>
                </div>
                <span className="font-bold text-[#38B259]">{displayPrice(bonusAmount, currentCurrency, rates)}</span>
              </div>

              <div className="flex justify-between items-end pt-2">
                <div>
                  <span className="text-base font-bold text-brand-text dark:text-brand-gold">Buy any jewellery worth:</span>
                  <p className="text-[11px] text-brand-text/50 dark:text-white/50">(After 11th month)</p>
                </div>
                <span className="text-xl font-bold text-brand-text dark:text-brand-gold">{displayPrice(maturityValue, currentCurrency, rates)}</span>
              </div>

              <div className="flex justify-between items-center py-4 mt-2">
                <span className="text-sm font-medium text-brand-text dark:text-white">You effectively pay</span>
                <div className="bg-green-600/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1 border border-green-600/20">
                  <Check size={14} />
                  {effectiveDiscountPercent}% discount!
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

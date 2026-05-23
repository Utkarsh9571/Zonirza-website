'use client';

import React, { useState } from 'react';
import { displayPrice } from '@/lib/currency';
import { useCurrencyStore } from '@/store/currencyStore';

export const GoldReserveCalculator = () => {
  const { currentCurrency, rates } = useCurrencyStore();
  const [monthlyAmount, setMonthlyAmount] = useState<number>(2000);

  // Simulated live gold rate for calculation (In production, this comes from PlanConfig or live API)
  const currentGoldRatePerGram = 6800; // INR

  const durationMonths = 10;
  const totalPayment = monthlyAmount * durationMonths;
  
  // Calculate how many grams this installment buys today
  const reservedGoldGramsPerInstallment = monthlyAmount / currentGoldRatePerGram;
  
  // Projected total accumulated gold (assuming constant rate for simplicity of display)
  const projectedTotalGold = reservedGoldGramsPerInstallment * durationMonths;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyAmount(Number(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto my-16 p-8 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-brand-text/5 dark:border-white/5 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-brand-text dark:text-brand-gold mb-2">Gold Reserve Calculator</h2>
        <p className="text-sm text-brand-text/60 dark:text-white/60">
          Today's Gold Rate (24KT) - <span className="font-bold text-brand-gold">{displayPrice(currentGoldRatePerGram, currentCurrency, rates)}/g</span>
        </p>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div>
          <label className="block text-sm font-bold text-brand-text dark:text-white mb-4 text-center">
            Slide or enter monthly installment amount
          </label>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border border-brand-gold/30 rounded-lg p-3 bg-brand-gold/5 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold transition-all text-center">
              <span className="text-xs text-brand-text/50 dark:text-white/50 block">Monthly Amount</span>
              <input 
                type="number"
                min={2000}
                step={500}
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full bg-transparent border-none outline-none font-bold text-lg text-brand-text dark:text-white mt-1 p-0 text-center"
              />
            </div>
            <button className="px-6 py-4 bg-brand-gold text-white font-bold tracking-wider rounded-lg hover:bg-brand-gold/90 transition-colors">
              CHECK
            </button>
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
        </div>

        <div className="bg-[#FAFAFA] dark:bg-[#222222] border border-brand-text/10 dark:border-white/10 rounded-xl p-6 shadow-soft space-y-6">
          <div className="flex justify-between items-center border-b border-brand-text/5 dark:border-white/5 pb-4">
            <div>
              <span className="text-sm font-bold text-brand-text dark:text-white block">Your Payment</span>
              <span className="text-[11px] text-brand-text/50 dark:text-white/50">(1 installment)</span>
            </div>
            <span className="font-bold text-brand-text dark:text-white">{displayPrice(monthlyAmount, currentCurrency, rates)}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <span className="text-base font-bold text-brand-gold block">Your Reserved Gold</span>
              <span className="text-[11px] text-brand-gold/70">(Approx)</span>
            </div>
            <span className="text-xl font-bold text-brand-gold">{reservedGoldGramsPerInstallment.toFixed(4)}g</span>
          </div>
        </div>
        
        <p className="text-[10px] text-center text-brand-text/40 dark:text-white/40 italic">
          *Pay all installments without delay to unlock the 11th installment benefit voucher.<br/>
          *Gold unit accumulation is indicative and based on live market rates at the exact time of payment.
        </p>

      </div>
    </div>
  );
};

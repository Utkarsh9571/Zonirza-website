'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
}

const STEPS: Step[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' }
];

export function CheckoutSteps({ currentStep }: { currentStep: 'cart' | 'shipping' | 'payment' }) {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full py-12 flex items-center justify-center">
      <div className="flex items-center space-x-4 md:space-x-12">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isActive = idx === currentIdx;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center space-y-3">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border",
                    isCompleted ? "bg-brand-gold border-brand-gold text-white" : 
                    isActive ? "bg-brand-text dark:bg-brand-gold border-brand-text dark:border-brand-gold text-white shadow-premium scale-110" : 
                    "bg-white dark:bg-white/5 border-brand-text/10 dark:border-white/10 text-brand-text/30 dark:text-brand-text/50"
                  )}
                >
                  {isCompleted ? <Check size={20} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                </div>
                <span className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-500",
                  isActive ? "text-brand-text dark:text-brand-text" : "text-brand-text/30 dark:text-brand-text/50"
                )}>
                  {step.label}
                </span>
              </div>
              
              {idx < STEPS.length - 1 && (
                <div className="w-12 md:w-24 h-[1px] bg-brand-text/10 dark:bg-white/10 mx-4 mt-[-20px] transition-colors" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

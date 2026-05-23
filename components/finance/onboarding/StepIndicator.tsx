import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Personal Details' },
    { id: 2, label: 'Nominee Details' },
    { id: 3, label: 'Payment Details' }
  ];

  return (
    <div className="flex items-center justify-between relative">
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-text/10 dark:bg-white/10 z-0"></div>
      
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        
        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <span className={cn(
              "text-xs font-bold uppercase tracking-wider mb-2 transition-colors duration-300",
              isActive ? "text-brand-text dark:text-brand-gold" : 
              isCompleted ? "text-green-600 dark:text-green-500" : "text-brand-text/40 dark:text-white/40"
            )}>
              {step.label}
            </span>
            
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white dark:bg-[#1A1A1A]",
              isActive ? "border-brand-text dark:border-brand-gold" :
              isCompleted ? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white" : "border-brand-text/20 dark:border-white/20"
            )}>
              {isCompleted && <Check size={12} className="text-white" strokeWidth={4} />}
              {isActive && <div className="w-2 h-2 rounded-full bg-brand-text dark:bg-brand-gold"></div>}
            </div>
            
            {/* Active connecting line fill */}
            {idx > 0 && (
              <div 
                className="absolute right-[50%] top-[calc(100%-10px)] h-0.5 bg-green-600 dark:bg-green-500 z-[-1] transition-all duration-500"
                style={{
                  width: isCompleted || isActive ? '100%' : '0%',
                  right: '50%'
                }}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

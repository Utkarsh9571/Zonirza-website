import React from 'react';
import { cn } from '@/lib/utils';

interface MonthlyPlanButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export const MonthlyPlanButton: React.FC<MonthlyPlanButtonProps> = ({
  onClick,
  disabled = false,
  label = '10+1 Monthly Plan',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center px-8 py-4 rounded-full border border-brand-text dark:border-brand-gold/40 bg-brand-text/5 dark:bg-brand-gold/5 text-brand-text dark:text-brand-gold font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-brand-text hover:text-white dark:hover:bg-brand-gold dark:hover:text-[#12100e] hover:border-brand-text dark:hover:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-premium',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      )}
    >
      {label}
    </button>
  );
};

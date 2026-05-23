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
        'inline-flex items-center justify-center px-8 py-4 rounded-full border border-brand-gold/30 text-brand-gold font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-brand-gold/10 hover:border-brand-gold hover:text-white disabled:opacity-50 disabled:cursor-not-allowed',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      )}
    >
      {label}
    </button>
  );
};

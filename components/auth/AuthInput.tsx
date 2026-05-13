import React from 'react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 group">
        <label className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-text/70 group-focus-within:text-brand-gold transition-colors duration-300">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-brand-text/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-brand-text dark:text-brand-text/90 placeholder:text-brand-text/40 dark:placeholder:text-brand-text/30 outline-none transition-all duration-500",
              "focus:border-brand-gold/40 dark:focus:border-brand-gold/60 focus:bg-white dark:focus:bg-brand-accent focus:shadow-premium focus:ring-4 focus:ring-brand-gold/5",
              error ? "border-red-400" : "hover:border-brand-text/20 dark:hover:border-white/20",
              className
            )}
            {...props}
          />
          {error && (
            <p className="mt-1 text-[10px] text-red-500 font-medium tracking-wider uppercase">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

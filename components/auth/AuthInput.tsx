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
              "w-full bg-white/60 backdrop-blur-sm border border-brand-text/10 rounded-2xl px-6 py-4 text-sm text-brand-text placeholder:text-brand-text/40 outline-none transition-all duration-500",
              "focus:border-brand-gold/40 focus:bg-white focus:shadow-premium focus:ring-4 focus:ring-brand-gold/5",
              error ? "border-red-400" : "hover:border-brand-text/20",
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

'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full space-y-2 group">
        <label className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-text/70 group-focus-within:text-brand-gold transition-colors duration-300">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              "w-full bg-white/60 backdrop-blur-sm border border-brand-text/10 rounded-2xl px-6 py-4 text-sm text-brand-text placeholder:text-brand-text/40 outline-none transition-all duration-500 pr-14",
              "focus:border-brand-gold/40 focus:bg-white focus:shadow-premium focus:ring-4 focus:ring-brand-gold/5",
              error ? "border-red-400" : "hover:border-brand-text/20",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-text/30 hover:text-brand-gold transition-colors duration-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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

PasswordField.displayName = 'PasswordField';

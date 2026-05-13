import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-gold text-white hover:bg-brand-text shadow-soft transition-all duration-300',
      secondary: 'bg-brand-text text-brand-bg hover:bg-brand-gold hover:text-white shadow-soft transition-all duration-300',
      outline: 'border border-brand-text/10 dark:border-white/20 text-brand-text hover:border-brand-gold hover:text-brand-gold transition-colors',
      ghost: 'text-brand-text/60 dark:text-brand-text/80 hover:text-brand-gold transition-colors',
    };

    const sizes = {
      sm: 'px-6 py-2 text-[10px]',
      md: 'px-10 py-4 text-[11px]',
      lg: 'px-14 py-5 text-[12px]',
      full: 'w-full py-5 text-[11px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full uppercase tracking-[0.25em] font-bold transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

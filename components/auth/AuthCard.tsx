import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export const AuthCard = ({ children, title, subtitle, className }: AuthCardProps) => {
  return (
    <div className={cn(
      "w-full max-w-md bg-white/70 backdrop-blur-3xl border border-white rounded-[40px] p-8 md:p-12 shadow-premium animate-in fade-in zoom-in duration-1000 relative overflow-hidden",
      "before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-brand-gold/40 before:via-transparent before:to-brand-gold/20 before:rounded-[40px] before:-z-10",
      className
    )}>
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl font-serif text-brand-text leading-tight font-medium italic">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[11px] uppercase tracking-[0.35em] font-bold text-brand-text/70">
            {subtitle}
          </p>
        )}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

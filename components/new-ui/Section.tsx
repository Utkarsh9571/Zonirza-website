import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  dark?: boolean;
}

export const Section = ({ children, className, containerClassName, dark = false }: SectionProps) => {
  return (
    <section className={cn(
      'py-24 md:py-32 lg:py-40 overflow-hidden',
      dark ? 'bg-brand-text text-brand-bg' : 'bg-transparent text-brand-text',
      className
    )}>
      <div className={cn('max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  dark?: boolean;
  id?: string;
}

export const Section = ({ children, className, containerClassName, dark = false, id }: SectionProps) => {
  return (
    <section id={id} className={cn(
      'overflow-hidden', 
      dark ? 'bg-brand-text text-brand-bg' : 'bg-transparent text-brand-text',
      className
    )}>
      <div className={cn('max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20', containerClassName)}>
        {children}
      </div>
    </section>
  );
};

import Link from 'next/link';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn('group flex items-center space-x-2', className)}>
      <span className="text-2xl md:text-3xl font-serif font-bold tracking-[0.15em] text-brand-text group-hover:text-brand-gold transition-colors duration-500">
        LUXURY STARTER
      </span>
    </Link>
  );
};

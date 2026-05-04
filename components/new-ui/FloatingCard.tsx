import Image from 'next/image';
import { cn } from '@/lib/utils';

interface FloatingCardProps {
  image: string;
  title: string;
  value: string;
  className?: string;
}

export const FloatingCard = ({ image, title, value, className }: FloatingCardProps) => {
  return (
    <div className={cn(
      'bg-white/80 backdrop-blur-2xl p-6 rounded-[35px] shadow-premium border border-white/50 flex items-center space-x-5',
      className
    )}>
      <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-soft">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div>
        <p className="text-brand-text/30 text-[9px] uppercase tracking-widest font-bold mb-1">{title}</p>
        <p className="text-brand-text text-lg font-serif font-bold italic">{value}</p>
      </div>
    </div>
  );
};

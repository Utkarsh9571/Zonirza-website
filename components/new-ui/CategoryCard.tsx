import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  image: string;
  slug: string;
  className?: string;
}

export const CategoryCard = ({ name, image, slug, className }: CategoryCardProps) => {
  return (
    <Link 
      href={`/category/${slug}`} 
      className={cn('group flex flex-col items-center space-y-6', className)}
    >
      <div className="w-32 h-32 md:w-56 md:h-56 relative rounded-full overflow-hidden border border-brand-gold/10 p-4 bg-white dark:bg-zinc-900 shadow-soft transition-all duration-1000 group-hover:shadow-premium group-hover:border-brand-gold">
        <div className="w-full h-full relative rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-110">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      </div>
      <div className="text-center">
        <span className="text-[11px] uppercase tracking-[0.5em] font-bold text-brand-text/30 group-hover:text-brand-gold transition-colors block">
          {name}
        </span>
        <div className="w-0 h-[1px] bg-brand-gold mx-auto mt-2 transition-all duration-500 group-hover:w-full"></div>
      </div>
    </Link>
  );
};

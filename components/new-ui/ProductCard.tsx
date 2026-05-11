import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PLACEHOLDER_IMAGE, getValidImageUrl } from '@/lib/constants';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  slug: string;
  oldPrice?: number;
  className?: string;
}

export const ProductCard = ({ name, price, image, slug, oldPrice, className }: ProductCardProps) => {
  const { currentCurrency, rates } = useCurrencyStore();
  
  return (
    <Link 
      href={`/product/${slug}`} 
      className={cn('group block w-full touch-safe-hit', className)}
    >
      <div className="relative aspect-[4/5] w-full rounded-[40px] overflow-hidden bg-white border border-brand-text/5 shadow-soft transition-all duration-1000 group-hover:shadow-premium lg:group-hover:-translate-y-3">
        <Image
          src={getValidImageUrl(image)}
          alt={name}
          fill
          className="object-cover p-10 transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Interaction Overlay - Optimized for Touch */}
        <div className="absolute top-6 right-6 opacity-0 lg:group-hover:opacity-100 translate-x-4 lg:group-hover:translate-x-0 transition-all duration-500 hidden lg:flex">
          <div className="w-10 h-10 rounded-full bg-brand-bg/80 backdrop-blur-md flex items-center justify-center border border-white/50 text-brand-gold">
            <span className="text-xl font-light">+</span>
          </div>
        </div>

        {/* Mobile-only visible indicator to show it's clickable */}
        <div className="absolute bottom-6 right-6 lg:hidden">
          <div className="w-8 h-8 rounded-full bg-brand-text/10 backdrop-blur-sm flex items-center justify-center border border-white/20 text-brand-gold">
            <span className="text-lg font-light">+</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center space-y-2 pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold italic lg:opacity-0 lg:-translate-y-2 transition-all duration-500 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
          Essential Luxury
        </p>
        <h3 className="text-[14px] md:text-[16px] font-serif font-medium text-brand-text/90 group-hover:text-brand-gold transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-center space-x-3">
          <span className="text-brand-gold text-[13px] font-bold tracking-widest">
            {displayPrice(price, currentCurrency, rates)}
          </span>
          {oldPrice && (
            <span className="text-brand-text/20 text-[11px] line-through font-medium">
              {displayPrice(oldPrice, currentCurrency, rates)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

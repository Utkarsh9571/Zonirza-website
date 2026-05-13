import Image from 'next/image';
import Link from 'next/link';
import { resolveProductImage } from '@/lib/imageResolver';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSession } from 'next-auth/react';
import { useAuthModalStore } from '@/store/authModalStore';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  slug: string;
  oldPrice?: number;
}

const ProductCard = ({ name, price, image, slug, oldPrice }: ProductCardProps) => {
  const imageUrl = resolveProductImage(image);
  const { currentCurrency, rates } = useCurrencyStore();
  const { status } = useSession();
  const openAuthModal = useAuthModalStore(state => state.openAuthModal);
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const isWishlisted = isInWishlist(slug);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status !== 'authenticated') {
      openAuthModal();
      return;
    }
    toggleItem(slug);
  };

  return (
    <Link href={`/product/${slug}`} className="group block h-full">
      <div className="bg-white dark:bg-[#1a1614] rounded-[40px] overflow-hidden aspect-square relative mb-4 border border-brand-gold/90 shadow-soft transition-all duration-700 group-hover:shadow-premium group-hover:-translate-y-2 group-hover:border-brand-gold/100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover p-6 sm:p-8 transition-transform duration-700 group-hover:scale-110 rounded-[50px]"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistClick}
          className={cn(
            "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 z-10 shadow-soft active:scale-90",
            isWishlisted 
              ? "bg-brand-gold text-white" 
              : "bg-white/80 dark:bg-black/40 backdrop-blur-sm text-brand-text/40 dark:text-brand-text/80 hover:text-brand-gold"
          )}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={cn(isWishlisted && "animate-pulse")} />
        </button>

        {/* Mobile: Always visible, Desktop: Hover visible */}
        <button 
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center opacity-100 md:opacity-0 translate-y-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 active:bg-brand-gold z-10 shadow-soft active:scale-95 touch-safe-hit"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <span className="text-xl font-light">+</span>
        </button>
      </div>
      <div className="space-y-1 text-center px-2">
        <h3 className="text-[12px] sm:text-[13px] font-medium text-brand-muted group-hover:text-brand-text transition-colors duration-300 line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <p className="text-brand-gold text-[11px] sm:text-[12px] font-bold tracking-wider">
            {displayPrice(price, currentCurrency, rates)}
          </p>
          {oldPrice && (
            <p className="text-brand-muted/40 dark:text-brand-muted/60 text-[9px] sm:text-[10px] line-through font-medium italic transition-colors">
              {displayPrice(oldPrice, currentCurrency, rates)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

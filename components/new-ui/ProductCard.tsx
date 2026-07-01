import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';
import { getProductThumbnail } from '@/lib/productImage';
import { resolveProductImage } from '@/lib/imageResolver';
import { resolveDefaultMetal } from '@/lib/ecommerce';
import { calculatePricing } from '@/lib/pricing';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  slug: string;
  oldPrice?: number;
  className?: string;
  variantImages?: Record<string, string>;
  images?: string[];
  context?: { search?: string; metal?: string };
  product?: {
    basePrice?: number;
    price?: number;
    baseWeight?: number;
    makingCharges?: number;
    category?: string;
    jewelryType?: string;
    stoneType?: string;
    specs?: Record<string, unknown>;
    pricingOverrides?: Record<string, unknown>;
    categoryConfig?: Record<string, unknown>;
    categoryOverrides?: Record<string, unknown>;
    variantImages?: Record<string, string>;
    images?: string[];
    goldPurityOptions?: string[];
    configurableOptions?: {
      stones?: string[];
    };
  };
}

export const ProductCard = ({ name, price, image, slug, oldPrice, className, variantImages, images, context, product }: ProductCardProps) => {
  let displayMetal = context?.metal;
  if (!displayMetal && product) {
    displayMetal = resolveDefaultMetal(product, context);
  }
  
  let selectedImage: string | undefined = image;
  if (product && product.variantImages) {
    const vImages = product.variantImages;
    const normalizedVariantImages: Record<string, string> = {};
    Object.keys(vImages).forEach(k => {
      normalizedVariantImages[k.toLowerCase().replace(/\s+/g, '-')] = vImages[k];
    });
    selectedImage = (displayMetal && normalizedVariantImages[displayMetal]) || undefined;
    if (!selectedImage && displayMetal && product.images?.length) {
      const metalStr = displayMetal.toLowerCase().replace(/\s+/g, '-');
      selectedImage = product.images.find((img: string) => img.toLowerCase().includes(metalStr));
    }
    if (!selectedImage) {
      selectedImage = product.images?.[0] || image;
    }
  } else {
    // Fallback for cards without product object
    const computedContext = displayMetal ? { ...context, metal: displayMetal } : context;
    selectedImage = getProductThumbnail({ images, variantImages }, computedContext) || image;
  }

  const imageUrl = resolveProductImage(selectedImage);
  const { currentCurrency, rates } = useCurrencyStore();

  let displayPriceValue = price;
  if (product) {
    const config = {
      metal: displayMetal || 'yellow-gold',
      purity: product.goldPurityOptions?.[0] || '18K',
      stone: product.configurableOptions?.stones?.[0] || 'None',
    };
    try {
      // Cast the minimal typed product to the expected type of calculatePricing
      const pricing = calculatePricing(product as Parameters<typeof calculatePricing>[0], config, rates);
      displayPriceValue = pricing.totalPrice;
    } catch {
      // fallback
    }
  }
  
  return (
    <Link 
      href={`/product/${slug}`} 
      className={cn('group block w-full touch-safe-hit', className)}
    >
      <div className="relative aspect-4/5 w-full rounded-4xl overflow-hidden bg-white border border-brand-gold shadow-soft transition-all duration-1000 group-hover:shadow-premium lg:group-hover:-translate-y-3">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
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
        <div className="flex items-center justify-center gap-3">
          <p className="text-[16px] md:text-[18px] font-semibold text-brand-text tracking-wide group-hover:text-brand-gold transition-colors">
            {displayPrice(displayPriceValue, currentCurrency, rates)}
          </p>
          {oldPrice && oldPrice > displayPriceValue && (
            <span className="text-brand-text/20 text-[11px] line-through font-medium">
              {displayPrice(oldPrice, currentCurrency, rates)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

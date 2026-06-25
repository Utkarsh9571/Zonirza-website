'use client';

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
import { getProductThumbnail } from '@/lib/productImage';
import { useRef, useEffect, useState } from 'react';
import { resolveDefaultMetal } from '@/lib/ecommerce';
import { calculatePricing } from '@/lib/pricing';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  slug: string;
  oldPrice?: number;
  variantImages?: Record<string, string>;
  images?: string[];
  context?: { search?: string; metal?: string };
  enableCardVideoPreview?: boolean;
  cardPreviewVideo?: string;
  cardPreviewThumbnail?: string;
  product?: any;
}

const ProductCard = ({
  name,
  price,
  image,
  slug,
  oldPrice,
  variantImages,
  images,
  context,
  enableCardVideoPreview,
  cardPreviewVideo,
  cardPreviewThumbnail,
  product
}: ProductCardProps) => {
  const selectedMetal = product ? resolveDefaultMetal(product, context) : null;
  const computedContext = selectedMetal ? { ...context, metal: selectedMetal } : context;
  const selectedImage = getProductThumbnail({ images, variantImages }, computedContext) || image;
  const imageUrl = resolveProductImage(selectedImage);
  const { currentCurrency, rates } = useCurrencyStore();
  const { status } = useSession();
  const openAuthModal = useAuthModalStore(state => state.openAuthModal);
  const { toggleItem, isInWishlist } = useWishlistStore();

  let displayPriceValue = price;
  if (product) {
    const config = {
      metal: selectedMetal || 'yellow-gold',
      purity: product.goldPurityOptions?.[0] || '18K',
      stone: product.configurableOptions?.stones?.[0] || 'None',
    };
    try {
      const pricing = calculatePricing(product, config, rates);
      displayPriceValue = pricing.totalPrice;
    } catch (e) {
      // fallback
    }
  }

  const isWishlisted = isInWishlist(slug);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasLoadedVideo, setHasLoadedVideo] = useState(false);

  useEffect(() => {
    if (isVisible || isHovered) {
      setHasLoadedVideo(true);
    }
  }, [isVisible, isHovered]);

  useEffect(() => {
    if (!enableCardVideoPreview || !cardPreviewVideo) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsVisible(entry.isIntersecting);
      });
    }, { threshold: 0.5 }); // 50% visible

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [enableCardVideoPreview, cardPreviewVideo]);

  useEffect(() => {
    if (!videoRef.current) return;

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const shouldPlay = isDesktop ? (isVisible || isHovered) : isVisible;

    if (shouldPlay) {
      videoRef.current.play().catch(() => { });
    } else {
      videoRef.current.pause();
    }
  }, [isVisible, isHovered]);

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
    <Link
      href={`/product/${slug}`}
      className="product-card-wrapper group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={cardRef} className="product-card-inner bg-white dark:bg-[#1a1614] rounded-[40px] overflow-hidden aspect-square relative mb-4 border border-brand-gold/90 shadow-soft transition-all duration-700">

        {/* Main Image or Fallback Thumbnail */}
        <Image
          src={enableCardVideoPreview && cardPreviewThumbnail ? cardPreviewThumbnail : imageUrl}
          alt={name}
          fill
          className={cn(
            "product-card-img object-cover p-4 sm:p-4 transition-transform transition-opacity duration-700 rounded-[50px]",
            (enableCardVideoPreview && cardPreviewVideo && (isVisible || isHovered)) ? "opacity-0" : "opacity-100"
          )}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Cinematic Video Layer */}
        {enableCardVideoPreview && cardPreviewVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={cardPreviewThumbnail}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
              (isVisible || isHovered) ? "opacity-100" : "opacity-0"
            )}
          >
            {hasLoadedVideo && <source src={cardPreviewVideo} type="video/mp4" />}
          </video>
        )}

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
          className="product-card-btn absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center opacity-100 md:opacity-0 translate-y-0 md:translate-y-4 transition-all duration-500 active:bg-brand-gold z-10 shadow-soft touch-safe-hit"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <span className="text-xl font-light">+</span>
        </button>
      </div>
      <div className="space-y-1 text-center px-2 pt-2">
        <h3 className="product-card-title text-[12px] sm:text-[13px] font-medium text-brand-muted transition-colors duration-300 line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <p className="text-brand-gold text-[11px] sm:text-[12px] font-bold tracking-wider">
            {displayPrice(displayPriceValue, currentCurrency, rates)}
          </p>
          {oldPrice && oldPrice > displayPriceValue && (
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

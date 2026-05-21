'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAuthModalStore } from '@/store/authModalStore';
import { ShieldCheck, Truck, RotateCcw, Heart, Share2, Info, Check, Minus, Plus, Scale, Sparkles, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from './Button';
import { Section } from './Section';
import { cn } from '@/lib/utils';
import { resolveProductImage } from '@/lib/imageResolver';
import { calculatePricing, formatCurrency, ProductConfiguration } from '@/lib/pricing';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';
import { useWishlistStore } from '@/store/wishlistStore';
import { validateProductConfiguration, isFieldMissing } from '@/lib/ecommerce';
import { RingSizeGuide } from '../product/guides/RingSizeGuide';
import { DiamondGuide } from '../product/guides/DiamondGuide';
import { GoldPurityGuide } from '../product/guides/GoldPurityGuide';

// --- PREMIUM ZOOM COMPONENT ---
function ProductImageZoom({ image, name }: { image: string, name: string }) {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      className="relative w-full h-full cursor-zoom-in group/zoom touch-none overflow-hidden rounded-[48px] border-2 border-brand-gold/90" 
      onMouseEnter={() => !isTouch && setIsZooming(true)}
      onMouseLeave={() => !isTouch && setIsZooming(false)}
      onMouseMove={handleMouseMove}
      onClick={() => isTouch && setIsZooming(!isZooming)}
    >
      {/* Main Image */}
      <Image
        src={image}
        alt={name}
        fill
        className={cn(
          "object-cover p-2 sm:p-2 transition-opacity duration-300 rounded-[48px]",
          isZooming && !isTouch ? "opacity-0" : "opacity-100"
        )}
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />

      {/* Magnified Layer (Desktop Hover or Mobile Tap-to-Zoom) */}
      <div 
        className={cn(
          "absolute inset-0 z-10 overflow-hidden pointer-events-none transition-all duration-500 bg-white",
          isZooming ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div 
          className="absolute inset-0 bg-no-repeat bg-cover transition-transform duration-300"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: isTouch ? 'center' : `${position.x}% ${position.y}%`,
            backgroundSize: isTouch ? '180%' : '250%',
            transform: isZooming ? 'scale(1.1)' : 'scale(1)',
          }}
        />
      </div>

      {/* Luxury Lens Overlay */}
      {isZooming && (
        <div className="absolute inset-0 border-2 border-brand-gold/20 z-20 pointer-events-none rounded-[24px] overflow-hidden">
          <div className="absolute top-4 left-4 bg-brand-text/80 backdrop-blur-md px-3 py-1.5 rounded-full">
            <p className="text-[8px] text-white uppercase tracking-[0.2em] font-black flex items-center">
              <Sparkles size={10} className="mr-2 text-brand-gold" />
              {isTouch ? 'Tap to Close' : 'Inspecting Details'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductInteractiveUI({ product }: { product: any }) {
  // 1. Initial State Calculation Logic
  const configOptions = product.configurableOptions || {};

  // HELPER: Generate sensible defaults for every required option group
  const getInitialConfiguration = () => {
    const initialConfig: ProductConfiguration = {
      metal: 'Yellow Gold', // Standard default
      purity: '18K',        // Most popular choice
      size: '',
      stone: configOptions.stones?.length > 0 ? 'VS1' : 'None',
    };

    // Default Size for Rings/Bangles
    const category = product.category?.toLowerCase() || '';
    if (category.includes('ring')) {
      initialConfig.size = '7'; // Standard base size
    } else if (category.includes('bangle') || category.includes('bracelet')) {
      initialConfig.size = '2.4'; // Standard bangle size
    }

    // Override with available options if defaults are not in list
    // (In a real app, we'd check against actual product.configurableOptions if they existed)
    
    return initialConfig;
  };
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'breakup'>('details');

  // Configuration State - Always initialized with valid defaults
  const [config, setConfig] = useState<ProductConfiguration>(getInitialConfiguration());

  // Derive current images based on selected metal
  const currentImages = useMemo(() => {
    const metalSlug = config.metal.toLowerCase().replace(/\s+/g, '-');
    const filtered = product.images.filter((img: string) => img.toLowerCase().includes(metalSlug));
    return filtered.length > 0 ? filtered : product.images;
  }, [product.images, config.metal]);

  // Reset selected image when metal changes
  useEffect(() => {
    setSelectedImage(0);
  }, [config.metal]);

  // 2. Dynamic Pricing Calculation
  const pricing = useMemo(() => {
    return calculatePricing({
      basePrice: product.basePrice || product.price || 0,
      baseWeight: product.baseWeight || 5.0,
      makingCharges: product.makingCharges || 0
    }, config);
  }, [product.basePrice, product.price, product.baseWeight, product.makingCharges, config]);

  const validation = useMemo(() => {
    return validateProductConfiguration(product, config as any);
  }, [product, config]);

  const cartAddItem = useCartStore((state) => state.addItem);
  const { currentCurrency, rates } = useCurrencyStore();
  const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;
  
  const { status } = useSession();
  const openAuthModal = useAuthModalStore(state => state.openAuthModal);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.slug);

  const handleWishlistToggle = () => {
    if (status !== 'authenticated') {
      openAuthModal();
      return;
    }
    toggleItem(product.slug);
  };

  const handleAddToCart = () => {
    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }

    // Generate a unique ID based on productId and current configuration
    const cartItemId = `${product._id}-${config.purity}-${config.metal}-${config.size}-${config.stone}`.replace(/\s+/g, '-').toLowerCase();

    const resolvedImage = resolveProductImage(currentImages[selectedImage] || currentImages[0]);

    cartAddItem({
      cartItemId,
      productId: product._id as string,
      slug: product.slug,
      name: product.name,
      price: pricing.totalPrice,
      image: resolvedImage,
      quantity,
      estimatedWeight: pricing.estimatedWeight,
      lastUpdated: Date.now(),
      configuration: { ...config },
      pricingBreakdown: pricing
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name} | Zoniraz`,
      text: `Check out this ${product.name} on Zoniraz.`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pb-24 transition-colors duration-500">
      {/* Main Single-Column Layout */}
      <Section className="!pt-36 !pb-12 w-full max-w-[1920px] mx-auto flex flex-col items-center px-4 md:px-8 lg:px-12">
        
        {/* 1. HEADER: Breadcrumbs, Title, Price */}
        <div className="w-full flex flex-col items-center text-center space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold">
            Home &gt; Product &gt; {product.name}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-text leading-[1.1] tracking-tight">
            {product.name}
          </h1>
          <div className="flex flex-col items-center">
            <p className="text-3xl text-brand-text font-serif flex items-center space-x-2">
              <span>{displayPrice(pricing.totalPrice, currentCurrency, rates)}</span>
              <button 
                onClick={() => {
                  setActiveTab('breakup');
                  document.getElementById('jewellery-details')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-brand-gold transition-colors focus:outline-none flex items-center justify-center p-1"
                aria-label="View Price Breakup"
              >
                <ChevronDown size={20} className="text-brand-text/50 hover:text-brand-gold hover:translate-y-0.5 transition-transform" />
              </button>
            </p>
            <span className="text-[10px] uppercase tracking-widest text-brand-text/40 mt-1">Incl. taxes and charges</span>
          </div>

          {/* 2. ACTION BUTTONS: Try It On (Hidden), Wishlist, Share */}
          <div className="flex items-center justify-center space-x-4 pt-2">
            {/* <button className="px-6 py-2.5 rounded-full border border-brand-border dark:border-white/10 text-[10px] uppercase tracking-widest font-bold flex items-center space-x-2 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all text-brand-text shadow-sm">
              <Sparkles size={14} />
              <span>Try It On</span>
            </button> */}
            <button onClick={handleWishlistToggle} className="w-10 h-10 rounded-full flex items-center justify-center border border-brand-border dark:border-white/10 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all text-brand-text shadow-sm active:scale-90">
              <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={cn(isWishlisted && "text-brand-gold")} />
            </button>
            <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center border border-brand-border dark:border-white/10 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all text-brand-text shadow-sm active:scale-90">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* 3. MASSIVE FULL-WIDTH DUAL IMAGE GALLERY */}
        <div className="w-full relative bg-white dark:bg-[#1a1614] rounded-[40px] overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="flex w-full aspect-[4/5] lg:aspect-[2.5/1] gap-4">
             {/* Image 1 */}
             <div className="w-full lg:w-1/2 relative h-full">
                <ProductImageZoom 
                  image={resolveProductImage(currentImages[selectedImage] || currentImages[0])} 
                  name={product.name} 
                />
             </div>
             
             {/* Image 2 (Hidden on mobile, visible on desktop) */}
             <div className="hidden lg:block w-1/2 relative h-full">
               {currentImages.length > 1 ? (
                  <ProductImageZoom 
                    image={resolveProductImage(currentImages[(selectedImage + 1) % currentImages.length])} 
                    name={product.name} 
                  />
               ) : (
                  <div className="w-full h-full bg-brand-bg/50 flex items-center justify-center">
                    <span className="text-brand-text/30 font-serif">No more images</span>
                  </div>
               )}
             </div>
          </div>

          {/* Navigation Arrows */}
          {currentImages.length > 1 && (
            <>
              <button 
                onClick={() => setSelectedImage((prev) => (prev - 1 + currentImages.length) % currentImages.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md shadow-premium border border-brand-gold/10 rounded-full flex items-center justify-center z-10 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all text-brand-text"
              >
                 <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setSelectedImage((prev) => (prev + 1) % currentImages.length)}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md shadow-premium border border-brand-gold/10 rounded-full flex items-center justify-center z-10 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all text-brand-text"
              >
                 <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* 4. PRODUCT OPTIONS & DETAILS CONTAINER */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {/* Left Column: Configurable Selectors */}
            <div className="space-y-8 pr-0 lg:pr-8 lg:border-r lg:border-brand-text/10">
              
              {/* Metal Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">Select Metal / Color</span>
                  {showValidation && isFieldMissing('metal', validation.missingFields) && (
                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" /> Incomplete
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {['White Gold', 'Rose Gold', 'Yellow Gold'].map((metalOption) => {
                     return (
                      <button
                        key={metalOption}
                        onClick={() => {
                          setConfig({ 
                            ...config, 
                            metal: metalOption,
                            isCustomColor: false 
                          });
                          if (showValidation) setShowValidation(false);
                        }}
                        className={cn(
                          "px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest font-bold border transition-all duration-300 touch-safe-hit",
                          !config.isCustomColor && config.metal === metalOption
                            ? "bg-brand-gold text-white border-brand-gold shadow-premium" 
                            : "bg-white dark:bg-[#1a1614] text-brand-muted border-brand-gold/10 dark:border-white/5 active:border-brand-gold",
                          showValidation && isFieldMissing('metal', validation.missingFields) && "border-red-200 bg-red-50/30"
                        )}
                      >
                        {metalOption}
                      </button>
                     );
                  })}
                  
                  {/* Custom Request Button */}
                  <button
                    onClick={() => {
                      setConfig({ ...config, isCustomColor: true });
                      if (showValidation) setShowValidation(false);
                    }}
                    className={cn(
                      "px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest font-bold border transition-all duration-300 touch-safe-hit",
                      config.isCustomColor
                        ? "bg-brand-gold text-white border-brand-gold shadow-premium" 
                        : "bg-white dark:bg-[#1a1614] text-brand-muted border-brand-gold/10 dark:border-white/5 active:border-brand-gold"
                    )}
                  >
                    Custom Request
                  </button>
                </div>
                
                {/* Custom Request Expandable Section */}
                {config.isCustomColor && (
                  <div className="mt-4 p-4 bg-brand-gold/5 border border-brand-gold/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-brand-text mb-2">
                      Describe your preferred color/finish:
                    </label>
                    <textarea 
                      className={cn(
                        "w-full bg-white dark:bg-[#1a1614] border border-brand-border dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors",
                        showValidation && isFieldMissing('customColorNotes', validation.missingFields) && "border-red-500 bg-red-50/30"
                      )}
                      rows={2}
                      placeholder="Examples: Champagne Gold, Matte Black, Dual Tone, Antique Finish..."
                      value={config.customColorNotes || ''}
                      onChange={(e) => {
                        setConfig({ ...config, customColorNotes: e.target.value });
                        if (showValidation) setShowValidation(false);
                      }}
                    />
                    {showValidation && isFieldMissing('customColorNotes', validation.missingFields) && (
                      <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-widest flex items-center animate-pulse">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" /> Please provide your custom request details
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Purity Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">Select Purity</span>
                  {showValidation && isFieldMissing('purity', validation.missingFields) && (
                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" /> Incomplete
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {['22K', '18K', '14K', '9K'].map((purityOption) => {
                     const isDiamondProduct = product.tags?.some((t: string) => t.toLowerCase().includes('diamond')) || 
                                              product.category?.toLowerCase().includes('diamond') || 
                                              (configOptions.stones && configOptions.stones.length > 0 && configOptions.stones[0] !== 'None') ||
                                              product.specs?.stone;
                     
                     if (isDiamondProduct && purityOption === '22K') return null;

                     return (
                      <button
                        key={purityOption}
                        onClick={() => {
                          setConfig({ ...config, purity: purityOption });
                          if (showValidation) setShowValidation(false);
                        }}
                        className={cn(
                          "px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest font-bold border transition-all duration-300 touch-safe-hit",
                          config.purity === purityOption
                            ? "bg-brand-gold text-white border-brand-gold shadow-premium" 
                            : "bg-white dark:bg-[#1a1614] text-brand-muted border-brand-gold/10 dark:border-white/5 active:border-brand-gold",
                          showValidation && isFieldMissing('purity', validation.missingFields) && "border-red-200 bg-red-50/30"
                        )}
                      >
                        {purityOption}
                      </button>
                     );
                  })}
                </div>
              </div>

              {/* Ring Size Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <div className="flex items-center space-x-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">Size (India/US)</span>
                    {showValidation && isFieldMissing('size', validation.missingFields) && (
                      <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center animate-pulse">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" /> Incomplete
                      </span>
                    )}
                   </div>
                   <button 
                     onClick={() => {
                       document.getElementById('size-guide')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                       window.dispatchEvent(new CustomEvent('open-ring-guide'));
                     }}
                     className="text-[9px] text-brand-gold underline tracking-widest"
                   >
                     Not sure?
                   </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['7', '8', '9', '10', '11'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setConfig({ ...config, size });
                        if (showValidation) setShowValidation(false);
                      }}
                      className={cn(
                        "w-14 h-14 flex items-center justify-center rounded-2xl text-[11px] font-bold border transition-all duration-300 touch-safe-hit",
                        config.size === size 
                          ? "bg-brand-gold text-white border-brand-gold shadow-premium" 
                          : "bg-white dark:bg-[#1a1614] text-brand-muted border-brand-gold/10 dark:border-white/5 active:border-brand-gold",
                        showValidation && isFieldMissing('size', validation.missingFields) && "border-red-200 bg-red-50/30"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diamond Quality Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">Diamond Clarity</span>
                  {showValidation && isFieldMissing('stone', validation.missingFields) && (
                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" /> Incomplete
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['VVS1', 'VS1', 'SI1', 'Diamond-Standard'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setConfig({ ...config, stone: q });
                        if (showValidation) setShowValidation(false);
                      }}
                        className={cn(
                          "px-4 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-bold border transition-all duration-300",
                          config.stone === q
                            ? "bg-brand-gold text-white border-brand-gold shadow-premium" 
                            : "bg-white dark:bg-[#1a1614] text-brand-muted border-brand-gold/10 dark:border-white/5 hover:border-brand-gold",
                          showValidation && isFieldMissing('stone', validation.missingFields) && "border-red-200"
                        )}
                    >
                      {q.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Config Summary, Cart, Guides */}
            <div className="space-y-8 pl-0 lg:pl-4 flex flex-col justify-start">
              {/* Live Config Summary */}
              <div className="p-6 rounded-[40px] bg-brand-bg dark:bg-[#1a1614] border border-brand-gold/10 space-y-3 transition-colors">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Configuration Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Metal & Purity</p>
                   <p className="text-[11px] font-bold text-brand-text">{config.isCustomColor ? `${config.purity} Custom Color Request` : `${config.purity} ${config.metal}`}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Stone Quality</p>
                   <p className="text-[11px] font-bold text-brand-text">{config.stone?.replace('-', ' ')}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Estimated Weight</p>
                   <p className="text-[11px] font-bold text-brand-text">{pricing.estimatedWeight}g</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Selected Size</p>
                   <p className="text-[11px] font-bold text-brand-text">{config.size}</p>
                 </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4 pt-4">
              <Button 
                size="lg" 
                className={cn(
                  "w-full !py-5 shadow-premium transition-all duration-300", 
                  isAdded ? "bg-green-600 hover:bg-green-700" : "",
                  !validation.isValid && showValidation ? "bg-brand-text/40 opacity-70" : ""
                )} 
                onClick={handleAddToCart}
              >
                {isAdded ? <><Check size={18} className="mr-2 inline" /> Added to Cart</> : 
                 (!validation.isValid && showValidation) ? 'Complete Selection' : 'Add to Cart'}
              </Button>
              <Button size="lg" variant="outline" className="w-full !py-5 shadow-soft border-brand-text dark:border-brand-gold text-brand-text dark:text-brand-gold hover:bg-brand-text dark:hover:bg-brand-gold hover:text-white" onClick={() => window.location.href = '/cart'}>
                Buy It Now
              </Button>
            </div>

            {/* Educational Guides */}
            <div className="space-y-3 pt-6 border-t border-brand-text/5">
              <div id="size-guide">
                <RingSizeGuide />
              </div>
              <DiamondGuide />
              <GoldPurityGuide />
            </div>
            
            </div> {/* End Right Column */}

          </div>
      </Section>

      {/* Jewellery Details Section (Tanishq Inspired) */}
      <Section id="jewellery-details" className="!py-20 bg-white dark:bg-brand-bg transition-colors">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-text">Jewellery Details</h2>
            <div className="w-16 h-px bg-brand-gold mx-auto"></div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('details')}
              className={cn(
                "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-soft touch-safe-hit",
                activeTab === 'details' 
                  ? "bg-brand-text dark:bg-brand-gold text-white border border-transparent shadow-premium" 
                  : "bg-white dark:bg-[#1a1614] text-brand-text/60 border border-brand-text/10 dark:border-white/5 hover:border-brand-gold hover:text-brand-text"
              )}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('breakup')}
              className={cn(
                "px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-soft touch-safe-hit",
                activeTab === 'breakup' 
                  ? "bg-brand-text dark:bg-brand-gold text-white border border-transparent shadow-premium" 
                  : "bg-white dark:bg-[#1a1614] text-brand-text/60 border border-brand-text/10 dark:border-white/5 hover:border-brand-gold hover:text-brand-text"
              )}
            >
              Price Breakup
            </button>
          </div>

          <div className="bg-white dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-[40px] p-8 md:p-12 shadow-premium min-h-[300px] transition-colors relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl rounded-full pointer-events-none" />

            {activeTab === 'details' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                  {/* Default Info */}
                  <div className="space-y-2 border-b border-brand-text/5 dark:border-white/5 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 dark:text-brand-text/60">Selected Metal</p>
                    <p className="text-sm font-bold text-brand-text">{config.isCustomColor ? `${config.purity} Custom Color` : `${config.purity} ${config.metal}`}</p>
                  </div>
                  <div className="space-y-2 border-b border-brand-text/5 dark:border-white/5 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 dark:text-brand-text/60">Estimated Weight</p>
                    <p className="text-sm font-bold text-brand-text">{pricing.estimatedWeight}g</p>
                  </div>
                  {config.stone && config.stone !== 'None' && (
                    <div className="space-y-2 border-b border-brand-text/5 dark:border-white/5 pb-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 dark:text-brand-text/60">Diamond/Stone Quality</p>
                      <p className="text-sm font-bold text-brand-text">{config.stone.replace('-', ' ')}</p>
                    </div>
                  )}
                  {/* Dynamic Specs */}
                  {Object.entries(specs || {}).map(([key, value]) => (
                    key !== 'price' && (
                      <div key={key} className="space-y-2 border-b border-brand-text/5 dark:border-white/5 pb-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 dark:text-brand-text/60">{key}</p>
                        <p className="text-sm font-bold text-brand-text">{value as string}</p>
                      </div>
                    )
                  ))}
                </div>
                <div className="pt-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 dark:text-brand-text/60 mb-2">Description</p>
                  <p className="text-brand-text/80 text-sm leading-relaxed">{product.description}</p>
                </div>
              </div>
            )}

            {activeTab === 'breakup' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto relative z-10">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="grid grid-cols-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 dark:text-brand-text/60 pb-4 border-b border-brand-text/10 dark:border-white/10">
                    <div>Component</div>
                    <div className="text-right">Value</div>
                  </div>
                  
                  {/* Rows */}
                  <div className="grid grid-cols-2 items-center text-sm py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      </div>
                      <span className="font-bold text-brand-text">Gold Value ({config.purity})</span>
                    </div>
                    <span className="text-right font-medium text-brand-text">{displayPrice(pricing.metalPrice, currentCurrency, rates)}</span>
                  </div>

                  {pricing.stonePrice > 0 && (
                    <div className="grid grid-cols-2 items-center text-sm py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Sparkles size={12} className="text-blue-500" />
                        </div>
                        <span className="font-bold text-brand-text">Diamond/Stone Value</span>
                      </div>
                      <span className="text-right font-medium text-brand-text">{displayPrice(pricing.stonePrice, currentCurrency, rates)}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 items-center text-sm py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                        <RotateCcw size={12} />
                      </div>
                      <span className="font-bold text-brand-text">Making Charges</span>
                    </div>
                    <span className="text-right font-medium text-brand-text">{displayPrice(pricing.makingCharges, currentCurrency, rates)}</span>
                  </div>

                  <div className="grid grid-cols-2 items-center text-sm py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-brand-text/5 dark:bg-white/5 flex items-center justify-center text-brand-text">
                        <Scale size={12} />
                      </div>
                      <span className="font-bold text-brand-text">GST (3%)</span>
                    </div>
                    <span className="text-right font-medium text-brand-text">{displayPrice(pricing.gst, currentCurrency, rates)}</span>
                  </div>

                  {/* Total */}
                  <div className="pt-6 mt-4 border-t-2 border-brand-text/10 dark:border-white/10">
                    <div className="grid grid-cols-2 items-center">
                      <span className="text-sm font-bold uppercase tracking-widest text-brand-text">Grand Total</span>
                      <span className="text-right text-2xl font-serif font-bold text-brand-gold italic">
                        {displayPrice(pricing.totalPrice, currentCurrency, rates)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Floating Sticky Purchase Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-auto max-w-lg bg-white/95 dark:bg-[#1a1614]/95 backdrop-blur-xl border border-brand-gold/20 p-2.5 rounded-[100px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex items-center justify-between transition-all duration-500">
        <div className="flex items-center pl-4 pr-6 space-x-6">
          <div className="flex flex-col">
            <span className="text-2xl font-bold font-serif text-brand-gold italic leading-none">{displayPrice(pricing.totalPrice, currentCurrency, rates)}</span>
            <span className="text-[9px] uppercase tracking-widest text-brand-text/60 mt-1">Total Price</span>
          </div>
          <div className="hidden md:block w-px h-8 bg-brand-text/10 dark:bg-white/10"></div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-bold text-brand-text leading-none">{pricing.estimatedWeight}g</span>
            <span className="text-[9px] uppercase tracking-widest text-brand-text/60 mt-1">Weight</span>
          </div>
        </div>
        <Button 
          size="lg"
          className={cn(
            "!rounded-[100px] !py-4 px-8 shadow-premium transition-all duration-300 min-w-[140px]", 
            isAdded ? "bg-green-600 hover:bg-green-700" : "",
            !validation.isValid && showValidation ? "bg-brand-text/40 opacity-70" : ""
          )} 
          onClick={handleAddToCart}
        >
          {isAdded ? <><Check size={16} className="mr-2 inline" /> Added</> : 
           (!validation.isValid && showValidation) ? 'Select Options' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}

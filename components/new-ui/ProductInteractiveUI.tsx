'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import { useAuthModalStore } from '@/store/authModalStore';
import { RotateCcw, Heart, Share2, Check, Scale, Sparkles, ChevronDown, ChevronLeft, ChevronRight, Coins } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from './Button';
import { Section } from './Section';
import { cn } from '@/lib/utils';
import { resolveProductImage } from '@/lib/imageResolver';
import { calculatePricing, ProductConfiguration } from '@/lib/pricing';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';
import { useWishlistStore } from '@/store/wishlistStore';
import { validateProductConfiguration, isFieldMissing } from '@/lib/ecommerce';
import { ProductKnowledgeGuide } from '@/components/product/guides/ProductKnowledgeGuide';
import { useRulesEngine } from '@/hooks/useRulesEngine';
import { MonthlyPlanButton } from '@/components/finance/MonthlyPlanButton';
import { MonthlyPlanModal } from '@/components/finance/MonthlyPlanModal';
import type { IProduct } from '@/models/Product';
// --- PREMIUM ZOOM COMPONENT ---
function ProductImageZoom({ image, name }: { image: string, name: string }) {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });

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
        <div className="absolute inset-0 border-2 border-brand-gold/20 z-20 pointer-events-none rounded-3xl overflow-hidden">
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

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ProductInteractiveUI({ product }: { product: IProduct & { price?: number } }) {
  // 1. Initial State Calculation Logic
  const configOptions = product.configurableOptions || {};
  
  // Safe fallback arrays mapped dynamically
  const metals = configOptions.metals?.length ? configOptions.metals : ['White Gold', 'Rose Gold', 'Yellow Gold'];
  const purities = product.goldPurityOptions?.length ? product.goldPurityOptions : (configOptions.purities?.length ? configOptions.purities : ['18K', '14K', '9K']);
  const sizes = configOptions.sizes?.length ? configOptions.sizes : ['7', '8', '9', '10', '11'];
  const stones = configOptions.stones?.length ? configOptions.stones : ['VVS1', 'VS1', 'SI1', 'Diamond-Standard'];

  // HELPER: Generate sensible defaults for every required option group
  const getInitialConfiguration = () => {
    const initialConfig: ProductConfiguration = {
      metal: product.defaultColor || metals[0] || 'Yellow Gold', 
      purity: purities.includes('18K') ? '18K' : (purities[0] || '18K'),
      size: product.defaultSize || '',
      stone: (product.jewelryType === 'gold' || stones.length === 0) ? 'None' : stones[0],
    };

    // Default Size for Rings/Bangles/Chains/Bracelets if not specified
    if (!initialConfig.size) {
      const category = product.category?.toLowerCase() || '';
      if (category.includes('ring')) {
        initialConfig.size = sizes.includes('12') ? '12' : (sizes.includes('7') ? '7' : sizes[0]); 
      } else if (category.includes('chain') || category.includes('necklace') || category.includes('mangalsutra')) {
        initialConfig.size = sizes.includes('20') ? '20' : sizes[0];
      } else if (category.includes('bracelet') || category.includes('anklet')) {
        initialConfig.size = sizes.includes('M') ? 'M' : (sizes.includes('Medium') ? 'Medium' : sizes[0]);
      } else if (category.includes('bangle')) {
        initialConfig.size = sizes.includes('2.4') ? '2.4' : sizes[0]; 
      }
    }

    return initialConfig;
  };
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'breakup'>('details');

  // Configuration State - Always initialized with valid defaults
  const [config, setConfig] = useState<ProductConfiguration>(getInitialConfiguration());

  // Fetch Public Settings for Live Rates & Offsets
  const { data: settingsResponse } = useSWR('/api/settings/public', fetcher);
  const pricingFactors = settingsResponse?.data?.pricingFactors;

  // Derive current media (images + videos) based on selected metal
  const currentMedia = useMemo(() => {
    const metalSlug = config.metal.toLowerCase().replace(/\s+/g, '-');
    const filteredImages = product.images.filter((img: string) => img.toLowerCase().includes(metalSlug));
    const baseImages = filteredImages.length > 0 ? filteredImages : product.images;
    const videos = product.productVideos || [];
    return [...baseImages, ...videos];
  }, [product.images, product.productVideos, config.metal]);

  const isVideo = (url: string) => url.match(/\.(mp4|webm|mov)$/i);



  const { currentCurrency, rates } = useCurrencyStore();

  const rulesEvaluation = useRulesEngine(product, config);

  // 2. Dynamic Pricing Calculation
  const pricing = useMemo(() => {
    const basePricing = calculatePricing({
      basePrice: product.basePrice || product.price || 0,
      baseWeight: product.baseWeight || 5.0,
      makingCharges: product.makingCharges || 0,
      category: product.category,
      jewelryType: product.jewelryType,
      stoneType: product.stoneType,
      specs: product.specs,
      pricingOverrides: product.pricingOverrides || {}
    }, config, pricingFactors);
    
    // Inject rule-based surcharges
    basePricing.totalPrice += (rulesEvaluation?.surcharges || 0) * (rates[currentCurrency] || 1);
    
    return basePricing;
  }, [product, config, pricingFactors, rates, currentCurrency, rulesEvaluation]);

  const validation = useMemo(() => {
    return validateProductConfiguration(product, config as unknown as Record<string, string>);
  }, [product, config]);

  const cartAddItem = useCartStore((state) => state.addItem);
  const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;

  const specGroups = useMemo(() => {
    const metalGroup: { label: string; value: string }[] = [];
    const stoneGroup: { label: string; value: string }[] = [];
    const craftGroup: { label: string; value: string }[] = [];
    const generalGroup: { label: string; value: string }[] = [];

    // Helper to format values
    const formatVal = (k: string, v: string) => {
      if (!v) return '';
      // Map raw values
      const mapping: Record<string, string> = {
        'white-gold': 'White Gold',
        'yellow-gold': 'Yellow Gold',
        'rose-gold': 'Rose Gold',
        'gold': 'Gold',
        'silver': 'Silver',
        'platinum': 'Platinum',
        'women': 'Women',
        'men': 'Men',
        'kids': 'Kids',
        'unisex': 'Unisex',
        'in-stock': 'In Stock',
        'out-of-stock': 'Out of Stock',
        'high polish': 'High Polish',
        'high-polish': 'High Polish',
        'yes': 'Yes',
        'no': 'No'
      };

      const parts = v.split(',').map(part => {
        const trimmed = part.trim().toLowerCase();
        if (mapping[trimmed]) return mapping[trimmed];
        // Capitalize words
        return part.trim()
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      });

      return parts.join(', ');
    };

    // 1. Metal & Composition
    metalGroup.push({ label: 'Metal Purity', value: config.purity });
    metalGroup.push({ label: 'Metal Color', value: config.metal });
    if (pricing.estimatedGoldWeight) {
      metalGroup.push({ label: 'Approx. Metal Weight', value: `${pricing.estimatedGoldWeight} g` });
    }

    // 2. Diamond & Gemstones
    if (product.jewelryType === 'diamond') {
      if (config.stone && config.stone !== 'None') {
        stoneGroup.push({ label: 'Diamond Quality', value: config.stone.replace('-', ' ') });
      }
      const dWeight = specs?.diamondWeight || specs?.stoneWeight || specs?.diamondweight || specs?.stoneweight;
      if (dWeight) {
        stoneGroup.push({ label: 'Total Diamond Weight', value: formatVal('diamondWeight', dWeight) });
      }
      const dCount = specs?.diamondCount || specs?.diamondcount;
      if (dCount) {
        stoneGroup.push({ label: 'Number of Diamonds', value: formatVal('diamondCount', dCount) });
      }
    } else if (product.jewelryType === 'stone') {
      const sName = specs?.stoneName || specs?.stonename || product.stoneType;
      if (sName) {
        stoneGroup.push({ label: 'Gemstone Type', value: formatVal('stoneName', sName) });
      }
      const sWeight = specs?.stoneWeight || specs?.stoneweight;
      if (sWeight) {
        stoneGroup.push({ label: 'Total Stone Weight', value: formatVal('stoneWeight', sWeight) });
      }
      const sCount = specs?.stoneCount || specs?.stonecount;
      if (sCount) {
        stoneGroup.push({ label: 'Number of Gemstones', value: formatVal('stoneCount', sCount) });
      }
    }

    // 3. Dynamic Custom Specs categorization
    const excludedKeys = [
      'metal', 'metals', 'purity', 'purities', 'karat', 'size', 'sizes', 
      'stone', 'stones', 'customization', 'customizations', 'price', 
      'slug', 'category', 'gold_weight', 'diamond_weight', 'stone_weight', 
      'diamond_quality', 'gold_purity_options', 'jewelry_type', 'diamond_count', 'stone_count',
      'stone_name'
    ];

    Object.entries(specs || {}).forEach(([key, value]) => {
      const k = key.toLowerCase();
      if (excludedKeys.some(ex => k === ex || ex.includes(k) || k.includes(ex))) {
        return; // skip duplicate/configurable
      }
      if (key === 'price' || typeof value !== 'string') return;

      const formattedLabel = key
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(w => w.toLowerCase() === 'sku' ? 'SKU' : w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const formattedValue = formatVal(key, value);

      // Categorize dynamic spec based on key keywords
      if (k.includes('craft') || k.includes('finish') || k.includes('setting') || k.includes('occasion') || k.includes('style')) {
        craftGroup.push({ label: formattedLabel, value: formattedValue });
      } else if (k.includes('sku') || k.includes('gender') || k.includes('recipient') || k.includes('brand') || k.includes('collection')) {
        generalGroup.push({ label: formattedLabel, value: formattedValue });
      } else if (k.includes('weight') || k.includes('composition') || k.includes('dimension')) {
        metalGroup.push({ label: formattedLabel, value: formattedValue });
      } else {
        // Fallback group
        craftGroup.push({ label: formattedLabel, value: formattedValue });
      }
    });

    // Add selected size to General or Metal
    if (config.size) {
      generalGroup.push({ label: 'Selected Size / Length', value: config.size });
    }

    return {
      metalGroup,
      stoneGroup,
      craftGroup,
      generalGroup
    };
  }, [config, specs, product, pricing]);
  
  const { status } = useSession();
  const openAuthModal = useAuthModalStore(state => state.openAuthModal);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.slug);

  // Fetch Digi Gold Wallet
  const { data: digiGoldData } = useSWR(status === 'authenticated' ? '/api/digi-gold/wallet' : null, fetcher);
  const digiGoldValue = digiGoldData?.success && digiGoldData.valuation?.currentValue ? digiGoldData.valuation.currentValue : 0;

  const handleWishlistToggle = () => {
    if (status !== 'authenticated') {
      openAuthModal();
      return;
    }
    toggleItem(product.slug);
  };

  const handleAddToCart = async () => {
    if (rulesEvaluation.isRestricted) {
      alert(rulesEvaluation.restrictionMessage);
      return;
    }

    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }

    const requiresQuote = config.isCustomColor || rulesEvaluation.requiresConsultation;

    if (requiresQuote) {
      try {
        const res = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: product._id,
            customerInfo: {
              name: status === 'authenticated' ? 'Authenticated User' : 'Guest Customer',
              email: 'guest@example.com', // In a real app, collect this via a modal if guest
              phone: 'Not provided'
            },
            configuration: {
              metal: config.metal,
              purity: config.purity,
              size: config.size,
              stone: config.stone
            },
            customizationNotes: config.customColorNotes || 'No notes provided',
            inspirationImages: config.inspirationImages || []
          })
        });

        if (res.ok) {
          setIsAdded(true);
          setTimeout(() => setIsAdded(false), 2000);
        } else {
          alert('Failed to submit quote request. Please try again or sign in.');
        }
      } catch (err) {
        console.error('Quote submission error:', err);
      }
      return;
    }

    // Generate a unique ID based on productId and current configuration
    const cartItemId = `${product._id?.toString()}-${config.purity}-${config.metal}-${config.size}-${config.stone}`.replace(/\s+/g, '-').toLowerCase();

    const resolvedImage = resolveProductImage(currentMedia[selectedImage] || currentMedia[0]);

    cartAddItem({
      cartItemId,
      productId: product._id?.toString() || '',
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
      <Section className="pt-36! pb-12! w-full max-w-480 mx-auto flex flex-col items-center px-4 md:px-8 lg:px-12">
        
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

          {/* Digi Gold Eligibility Banner */}
          {digiGoldValue > 0 && false && (
            <div className="flex items-center space-x-2 bg-brand-gold/10 px-4 py-2 rounded-full border border-brand-gold/20 animate-in fade-in zoom-in duration-500 delay-200">
              <Coins size={14} className="text-brand-gold" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                Eligible for Digi Gold Redemption (₹{digiGoldValue.toLocaleString()})
              </span>
            </div>
          )}

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
          <div className="flex w-full aspect-4/5 lg:aspect-2.5/1 gap-4">
             {/* Media 1 */}
             <div className="w-full lg:w-1/2 relative h-full">
                {isVideo(currentMedia[selectedImage] || '') ? (
                  <video 
                    src={currentMedia[selectedImage]} 
                    autoPlay loop muted playsInline 
                    className="w-full h-full object-cover rounded-[48px] border-2 border-brand-gold/90" 
                  />
                ) : (
                  <ProductImageZoom 
                    image={resolveProductImage(currentMedia[selectedImage] || currentMedia[0])} 
                    name={product.name} 
                  />
                )}
             </div>
             
             {/* Media 2 (Hidden on mobile, visible on desktop) */}
             <div className="hidden lg:block w-1/2 relative h-full">
               {currentMedia.length > 1 ? (
                 isVideo(currentMedia[(selectedImage + 1) % currentMedia.length] || '') ? (
                  <video 
                    src={currentMedia[(selectedImage + 1) % currentMedia.length]} 
                    autoPlay loop muted playsInline 
                    className="w-full h-full object-cover rounded-[48px] border-2 border-brand-gold/90" 
                  />
                 ) : (
                  <ProductImageZoom 
                    image={resolveProductImage(currentMedia[(selectedImage + 1) % currentMedia.length])} 
                    name={product.name} 
                  />
                 )
               ) : (
                  <div className="w-full h-full bg-brand-bg/50 flex items-center justify-center rounded-[48px]">
                    <span className="text-brand-text/30 font-serif">No more media</span>
                  </div>
               )}
             </div>
          </div>

          {/* Navigation Arrows */}
          {currentMedia.length > 1 && (
            <>
              <button 
                onClick={() => setSelectedImage((prev) => (prev - 1 + currentMedia.length) % currentMedia.length)}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md shadow-premium border border-brand-gold/10 rounded-full flex items-center justify-center z-10 hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all text-brand-text"
              >
                 <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => setSelectedImage((prev) => (prev + 1) % currentMedia.length)}
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
                  {metals.map((metalOption: string) => {
                     return (
                      <button
                        key={metalOption}
                        onClick={() => {
                          setConfig({ 
                            ...config, 
                            metal: metalOption,
                            isCustomColor: false 
                          });
                          setSelectedImage(0);
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
                      setSelectedImage(0);
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
                    <label className="text-[11px] font-bold uppercase tracking-widest text-brand-text mb-2 flex items-center justify-between">
                      <span>Describe your Customization:</span>
                      <span className="text-[9px] text-brand-gold font-normal normal-case tracking-normal border border-brand-gold/30 px-2 py-0.5 rounded-full">Consultation</span>
                    </label>
                    <textarea 
                      className={cn(
                        "w-full bg-white dark:bg-[#1a1614] border border-brand-border dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-gold transition-colors",
                        showValidation && isFieldMissing('customColorNotes', validation.missingFields) && "border-red-500 bg-red-50/30"
                      )}
                      rows={3}
                      placeholder="Examples: I want this in 18K Rose Gold, with a 2-carat center stone. Can you make the band slightly thicker? I have attached an inspiration image..."
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

                    
                    <div className="mt-4">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text mb-2">
                        Upload Inspiration Images
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {config.inspirationImages?.map((img, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-brand-gold/20">
                            <img src={img} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => {
                                const newImages = [...(config.inspirationImages || [])];
                                newImages.splice(idx, 1);
                                setConfig({ ...config, inspirationImages: newImages });
                              }}
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <label className="w-16 h-16 border-2 border-dashed border-brand-text/20 dark:border-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:border-brand-gold transition-colors">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setConfig({ 
                                    ...config, 
                                    inspirationImages: [...(config.inspirationImages || []), reader.result as string] 
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <span className="text-[20px] text-brand-text/40">+</span>
                        </label>
                      </div>
                    </div>
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
                  {purities.map((purityOption: string) => {
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

              {/* Category-aware Size/Length Selector */}
              {['rings', 'bangles', 'chains', 'bracelets', 'mangalsutras', 'anklets', 'necklaces'].includes(product.category?.toLowerCase() || '') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center space-x-2">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">
                        {(product.category?.toLowerCase() || '') === 'rings' ? 'Ring Size' : (product.category?.toLowerCase() || '') === 'bangles' ? 'Bangle Size' : 'Length'}
                      </span>
                      {showValidation && isFieldMissing('size', validation.missingFields) && (
                        <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center animate-pulse">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" /> Incomplete
                        </span>
                      )}
                     </div>
                     {['rings', 'bangles', 'chains', 'bracelets', 'mangalsutras', 'anklets', 'necklaces'].includes(product.category?.toLowerCase() || '') && (
                        <button 
                          onClick={() => {
                            const element = document.getElementById('product-knowledge-guide');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                            window.dispatchEvent(new CustomEvent('open-product-knowledge-guide', { detail: { tab: 'size' } }));
                          }}
                          className="text-[9px] text-brand-gold underline tracking-widest"
                        >
                          Not sure?
                        </button>
                      )}
                  </div>
                  <div className="relative w-full max-w-xs">
                    <select
                      value={config.size || ''}
                      onChange={(e) => {
                        setConfig({ ...config, size: e.target.value });
                        if (showValidation) setShowValidation(false);
                      }}
                      className={cn(
                        "w-full appearance-none bg-white dark:bg-[#1a1614] text-brand-text dark:text-white border border-brand-gold/30 dark:border-white/10 rounded-2xl py-4 px-6 pr-12 text-[12px] font-bold tracking-wider uppercase focus:outline-none focus:border-brand-gold transition-all cursor-pointer shadow-soft",
                        showValidation && isFieldMissing('size', validation.missingFields) && "border-red-200 bg-red-50/30"
                      )}
                    >
                      <option value="" disabled className="text-brand-muted">Select Size / Length</option>
                      {sizes.map((size: string) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-gold">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              )}

              {/* Diamond Quality Selector */}
              {product.jewelryType === 'diamond' && (
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
                    {stones.map((q: string) => (
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
              )}
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
                  {product.jewelryType !== 'gold' && (
                    <div className="space-y-1">
                      <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Stone Quality</p>
                      <p className="text-[11px] font-bold text-brand-text">{config.stone?.replace('-', ' ')}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Estimated Weight</p>
                    <p className="text-[11px] font-bold text-brand-text">
                      {pricing.estimatedGoldWeight}g Metal
                      {product.jewelryType !== 'gold' && pricing.estimatedStoneWeight ? ` + ${pricing.estimatedStoneWeight}g Stone` : ''}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Selected Size</p>
                    <p className="text-[11px] font-bold text-brand-text">{config.size || 'Base'}</p>
                  </div>
                  <div className="space-y-1 col-span-2 pt-2 border-t border-brand-gold/10">
                    <p className="text-[9px] text-brand-text/40 dark:text-brand-text/60 uppercase">Estimated Total Weight</p>
                    <p className="text-[13px] font-bold text-brand-gold">{pricing.estimatedWeight}g</p>
                  </div>
                </div>
              </div>

            <div className="flex flex-col space-y-4 pt-4">
              {/* Ready to Ship / Made to Order Status Banner */}
              {(() => {
                const comboId = `${config.purity}-${config.metal}-${config.size || 'base'}`.toLowerCase().replace(/\s+/g, '-');
                const isReadyToShip = product.readyToShipVariants?.includes(comboId);
                
                return (
                  <div className={cn(
                    "p-4 rounded-2xl border transition-all duration-300 flex items-center space-x-3 shadow-soft",
                    isReadyToShip 
                      ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300" 
                      : "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 dark:border-amber-500/20 text-amber-800 dark:text-amber-300"
                  )}>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isReadyToShip ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    )} />
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-widest font-black text-brand-text dark:text-white">
                        {isReadyToShip ? 'Ready To Ship' : 'Made To Order'}
                      </p>
                      <p className="text-[10px] text-brand-text/60 dark:text-white/50">
                        {isReadyToShip ? 'Dispatches in 1–3 Business Days' : 'Crafted Specifically For You (Dispatches in 10–14 Days)'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {rulesEvaluation.isRestricted && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold">{rulesEvaluation.restrictionMessage}</p>
                </div>
              )}
              {rulesEvaluation.requiresConsultation && !rulesEvaluation.isRestricted && !config.isCustomColor && (
                <div className="p-4 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
                  <p className="text-xs text-brand-gold font-bold">{rulesEvaluation.consultationMessage}</p>
                </div>
              )}
              <Button 
                size="lg" 
                className={cn(
                  "w-full py-5! shadow-premium transition-all duration-300", 
                  isAdded ? "bg-green-600 hover:bg-green-700" : "",
                  (!validation.isValid && showValidation) || rulesEvaluation.isRestricted ? "bg-brand-text/40 opacity-70 cursor-not-allowed" : "",
                  (config.isCustomColor || rulesEvaluation.requiresConsultation) ? "bg-[#12100e] dark:bg-white text-white dark:text-[#12100e] hover:opacity-90" : ""
                )} 
                onClick={handleAddToCart}
                disabled={rulesEvaluation.isRestricted}
              >
                {isAdded ? <><Check size={18} className="mr-2 inline" /> {(config.isCustomColor || rulesEvaluation.requiresConsultation) ? 'Request Added' : 'Added to Cart'}</> : 
                 rulesEvaluation.isRestricted ? 'Selection Unavailable' :
                 (!validation.isValid && showValidation) ? 'Complete Selection' : 
                 (config.isCustomColor || rulesEvaluation.requiresConsultation) ? 'Request Consultation' : 'Add to Cart'}
              </Button>
              <MonthlyPlanButton
                onClick={() => setPlanModalOpen(true)}
                disabled={rulesEvaluation.isRestricted || (!validation.isValid && showValidation)}
              />
              {!(config.isCustomColor || rulesEvaluation.requiresConsultation) && !rulesEvaluation.isRestricted && (
                <Button size="lg" variant="outline" className="w-full py-5! shadow-soft border-brand-text dark:border-brand-gold text-brand-text dark:text-brand-gold hover:bg-brand-text dark:hover:bg-brand-gold hover:text-white" onClick={() => window.location.href = '/cart'}>
                  Buy It Now
                </Button>
              )}
            </div>

            {/* Educational Guides */}
            <div id="product-knowledge-guide" className="space-y-3 pt-6 border-t border-brand-text/5">
              <ProductKnowledgeGuide product={product} />
            </div>
            
            </div> {/* End Right Column */}

          </div>
      </Section>

      {/* Jewellery Details Section (Tanishq Inspired) */}
      <Section id="jewellery-details" className="py-20! bg-white dark:bg-brand-bg transition-colors">
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

          <div className="bg-white dark:bg-brand-bg border border-brand-text/5 dark:border-white/5 rounded-[40px] p-8 md:p-12 shadow-premium min-h-75 transition-colors relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-3xl rounded-full pointer-events-none" />

            {activeTab === 'details' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10 space-y-10 text-brand-text">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Metal & Composition */}
                  {specGroups.metalGroup.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold border-b border-brand-gold/20 pb-2">Metal & Composition</h3>
                      <div className="space-y-3">
                        {specGroups.metalGroup.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-text/40 dark:text-white/40">{item.label}</span>
                            <span className="text-xs font-bold text-brand-text dark:text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gemstone Specifications */}
                  {specGroups.stoneGroup.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold border-b border-brand-gold/20 pb-2">Diamond & Gemstones</h3>
                      <div className="space-y-3">
                        {specGroups.stoneGroup.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-text/40 dark:text-white/40">{item.label}</span>
                            <span className="text-xs font-bold text-brand-text dark:text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Design & Craft */}
                  {specGroups.craftGroup.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold border-b border-brand-gold/20 pb-2">Design & Craft</h3>
                      <div className="space-y-3">
                        {specGroups.craftGroup.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-text/40 dark:text-white/40">{item.label}</span>
                            <span className="text-xs font-bold text-brand-text dark:text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General Information */}
                  {specGroups.generalGroup.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold border-b border-brand-gold/20 pb-2">Product Information</h3>
                      <div className="space-y-3">
                        {specGroups.generalGroup.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-text/40 dark:text-white/40">{item.label}</span>
                            <span className="text-xs font-bold text-brand-text dark:text-white">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-brand-text/5 dark:border-white/5">
                  <p className="text-[9px] uppercase tracking-[0.25em] font-black text-brand-text/40 dark:text-white/40 mb-2">Description</p>
                  <p className="text-brand-text/80 text-xs leading-relaxed max-w-3xl">{product.description}</p>
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
            "rounded-full py-4 px-8 shadow-premium transition-all duration-300 min-w-35", 
            isAdded ? "bg-green-600 hover:bg-green-700" : "",
            (!validation.isValid && showValidation) || rulesEvaluation.isRestricted ? "bg-brand-text/40 opacity-70 cursor-not-allowed" : "",
            (config.isCustomColor || rulesEvaluation.requiresConsultation) ? "bg-[#12100e] dark:bg-white text-white dark:text-[#12100e] hover:opacity-90" : ""
          )} 
          onClick={handleAddToCart}
          disabled={rulesEvaluation.isRestricted}
        >
          {isAdded ? <><Check size={18} className="mr-2 inline" /> {(config.isCustomColor || rulesEvaluation.requiresConsultation) ? 'Request Added' : 'Added to Cart'}</> : 
           rulesEvaluation.isRestricted ? 'Selection Unavailable' :
           (!validation.isValid && showValidation) ? 'Complete Selection' : 
           (config.isCustomColor || rulesEvaluation.requiresConsultation) ? 'Request Consultation' : 'Add to Cart'}
        </Button>
      </div>

      <MonthlyPlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setPlanModalOpen(false)}
        product={product}
        config={config}
      />
    </div>
  );
}

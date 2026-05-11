'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAuthModalStore } from '@/store/authModalStore';
import { ShieldCheck, Truck, RotateCcw, Heart, Share2, Info, Check, Minus, Plus, Scale, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from './Button';
import { Section } from './Section';
import { cn } from '@/lib/utils';
import { resolveProductImage } from '@/lib/imageResolver';
import { calculatePricing, formatCurrency, ProductConfiguration } from '@/lib/pricing';
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
      className="relative w-full h-full cursor-zoom-in group/zoom touch-none overflow-hidden"
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
          "object-cover p-4 sm:p-8 transition-opacity duration-300",
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

  // Configuration State - Always initialized with valid defaults
  const [config, setConfig] = useState<ProductConfiguration>(getInitialConfiguration());

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

  const addItem = useCartStore((state) => state.items); // Note: we need the store's addItem action
  const { status } = useSession();
  const openAuthModal = useAuthModalStore((state: any) => state.openAuthModal);

  const cartAddItem = useCartStore((state) => state.addItem);
  const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;

  const handleAddToCart = () => {
    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }

    // Generate a unique ID based on productId and current configuration
    const cartItemId = `${product._id}-${config.purity}-${config.metal}-${config.size}-${config.stone}`.replace(/\s+/g, '-').toLowerCase();

    const resolvedImage = resolveProductImage(product.images[selectedImage]);

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
      configuration: { ...config }
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-24">
      {/* Top 2-Column Section */}
      <Section className="!pt-36 !pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN (50%) - Image Gallery */}
          <div className="w-full lg:w-[50%] flex flex-col space-y-3 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="relative aspect-square w-full max-h-[350px] md:max-h-[420px] rounded-[24px] overflow-hidden bg-white border border-brand-border shadow-soft group mx-auto">
              <ProductImageZoom 
                image={resolveProductImage(product.images?.[selectedImage])} 
                name={product.name} 
              />
              
              <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
                <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-brand-border text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Heart size={16} />
                </button>
                <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-brand-border text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex justify-center space-x-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-[12px] overflow-hidden border-2 transition-all shadow-sm",
                      selectedImage === i ? "border-brand-gold" : "border-transparent bg-white hover:border-brand-border"
                    )}
                  >
                    <Image src={resolveProductImage(img)} alt={`${product.name} ${i}`} fill className="object-cover p-1" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (50%) - Details & Actions */}
          <div className="w-full lg:w-[50%] space-y-6 lg:sticky lg:top-24 animate-in fade-in slide-in-from-right-8 duration-1000">
            
            <div className="space-y-4">
              <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold">
                {product.category} Collection
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-brand-text leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-col space-y-2 pt-2">
                <div className="flex items-baseline space-x-3">
                   <p className="text-4xl text-brand-gold font-bold font-serif italic transition-all duration-500">
                    {formatCurrency(pricing.totalPrice)}
                  </p>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-brand-text/40">MRP Incl. Taxes</span>
                    <span className="text-[9px] text-brand-gold font-black uppercase tracking-widest mt-0.5">
                      {config.purity} {config.metal} {config.size ? `| Size ${config.size}` : ''} {config.stone !== 'None' ? `| ${config.stone}` : ''}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-[10px] text-brand-text/50 uppercase tracking-widest font-bold">
                  <div className="flex items-center space-x-1">
                    <Scale size={12} className="text-brand-gold" />
                    <span>Est. Weight: {pricing.estimatedWeight}g</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-brand-text/10"></div>

            {/* Configurable Selectors */}
            <div className="space-y-8">
              
              {/* Purity & Metal Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">Select Purity & Gold</span>
                  {showValidation && isFieldMissing('metal', validation.missingFields) && (
                    <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest flex items-center animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" /> Incomplete
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {['18K Yellow Gold', '18K Rose Gold', '18K White Gold', '22K Yellow Gold'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setConfig({ ...config, metal: option.split(' ').slice(1).join(' '), purity: option.split(' ')[0] });
                        if (showValidation) setShowValidation(false);
                      }}
                      className={cn(
                        "px-5 py-3.5 rounded-2xl text-[10px] uppercase tracking-widest font-bold border transition-all duration-300 touch-safe-hit",
                        `${config.purity} ${config.metal}` === option 
                          ? "bg-brand-text text-white border-brand-text shadow-premium" 
                          : "bg-white text-brand-text/70 border-brand-text/10 active:border-brand-gold active:text-brand-text",
                        showValidation && isFieldMissing('metal', validation.missingFields) && "border-red-200 bg-red-50/30"
                      )}
                    >
                      {option}
                    </button>
                  ))}
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
                   <button className="text-[9px] text-brand-gold underline tracking-widest">Not sure?</button>
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
                          ? "bg-brand-text text-white border-brand-text shadow-premium" 
                          : "bg-white text-brand-text/70 border-brand-text/10 active:border-brand-gold active:text-brand-text",
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
                          ? "bg-brand-text text-white border-brand-text shadow-premium" 
                          : "bg-white text-brand-text/70 border-brand-text/10 hover:border-brand-gold hover:text-brand-text",
                        showValidation && isFieldMissing('stone', validation.missingFields) && "border-red-200"
                      )}
                    >
                      {q.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Config Summary */}
            <div className="p-6 rounded-3xl bg-brand-bg border border-brand-gold/10 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Configuration Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 uppercase">Metal & Purity</p>
                   <p className="text-[11px] font-bold text-brand-text">{config.purity} {config.metal}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 uppercase">Stone Quality</p>
                   <p className="text-[11px] font-bold text-brand-text">{config.stone?.replace('-', ' ')}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 uppercase">Estimated Weight</p>
                   <p className="text-[11px] font-bold text-brand-text">{pricing.estimatedWeight}g</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] text-brand-text/40 uppercase">Selected Size</p>
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
              <Button size="lg" variant="outline" className="w-full !py-5 shadow-soft border-brand-text text-brand-text hover:bg-brand-text hover:text-white" onClick={() => window.location.href = '/cart'}>
                Buy It Now
              </Button>
            </div>

            {/* Educational Guides */}
            <div className="space-y-3 pt-6 border-t border-brand-text/5">
              <RingSizeGuide />
              <DiamondGuide />
              <GoldPurityGuide />
            </div>

          </div>
        </div>
      </Section>

      {/* Product Information */}
      <Section className="!py-16">
        <div className="bg-white rounded-[50px] p-10 md:p-16 border border-brand-text/5 shadow-premium">
          <div className="flex items-center space-x-6 mb-12 border-b border-brand-text/5 pb-8">
            <Info size={24} className="text-brand-gold" />
            <h2 className="text-2xl font-serif text-brand-text italic">Product Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-text">The Design</h3>
              <p className="text-brand-text/60 text-sm leading-relaxed">
                {product.description} This masterfully crafted piece showcases the perfect balance of heritage techniques and contemporary aesthetics.
              </p>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-text">Specifications</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {Object.entries(specs || {}).map(([key, value]) => (
                  key !== 'price' && (
                    <div key={key} className="space-y-2 border-l-2 border-brand-text/5 pl-4">
                      <p className="text-brand-text/40 text-[9px] uppercase tracking-[0.2em] font-bold">{key}</p>
                      <p className="text-brand-text text-sm font-medium">{value as string}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

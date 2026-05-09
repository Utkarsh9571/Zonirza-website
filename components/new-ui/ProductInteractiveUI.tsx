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
import { getValidImageUrl } from '@/lib/constants';
import { calculatePricing, formatCurrency, ProductConfiguration } from '@/lib/pricing';
import { validateProductConfiguration, isFieldMissing } from '@/lib/ecommerce';
import { RingSizeGuide } from '../product/guides/RingSizeGuide';
import { DiamondGuide } from '../product/guides/DiamondGuide';
import { GoldPurityGuide } from '../product/guides/GoldPurityGuide';

export function ProductInteractiveUI({ product }: { product: any }) {
  // 1. Initial State from Product Config or Defaults
  const configOptions = product.configurableOptions || {};
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Configuration State - Initialize with empty or defaults based on necessity
  const [config, setConfig] = useState<ProductConfiguration>({
    metal: '',
    purity: '',
    size: '',
    stone: configOptions.stones?.length > 0 ? '' : 'None',
  });

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

    cartAddItem({
      cartItemId,
      productId: product._id as string,
      slug: product.slug,
      name: product.name,
      price: pricing.totalPrice,
      image: product.images[selectedImage],
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
      <Section className="!pt-32 !pb-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN (60%) - Image Gallery */}
          <div className="w-full lg:w-[60%] flex flex-col space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="relative aspect-[4/5] w-full rounded-[40px] overflow-hidden bg-white border border-brand-text/5 shadow-soft group">
              <Image
                key={selectedImage}
                src={getValidImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                fill
                className="object-cover p-12 transition-transform duration-[2s] group-hover:scale-110 animate-in fade-in zoom-in-95 duration-500"
                priority
              />
              <div className="absolute top-8 right-8 flex flex-col space-y-3">
                <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-brand-text/5 text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Heart size={20} />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-brand-text/5 text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-24 h-24 flex-shrink-0 rounded-[20px] overflow-hidden border-2 transition-all shadow-sm",
                      selectedImage === i ? "border-brand-gold" : "border-transparent bg-white hover:border-brand-text/20"
                    )}
                  >
                    <Image src={getValidImageUrl(img)} alt={`${product.name} ${i}`} fill className="object-cover p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (40%) - Details & Actions */}
          <div className="w-full lg:w-[40%] space-y-8 lg:sticky lg:top-32 animate-in fade-in slide-in-from-right-8 duration-1000">
            
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
                  <span className="text-[10px] uppercase tracking-widest text-brand-text/40">MRP Incl. Taxes</span>
                </div>
                
                <div className="flex items-center space-x-4 text-[10px] text-brand-text/50 uppercase tracking-widest font-bold">
                  <div className="flex items-center space-x-1">
                    <Scale size={12} className="text-brand-gold" />
                    <span>Est. Weight: {pricing.estimatedWeight}g</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sparkles size={12} className="text-brand-gold" />
                    <span>{config.purity} {config.metal}</span>
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
                <div className="flex flex-wrap gap-2">
                  {['18K Yellow Gold', '18K Rose Gold', '18K White Gold', '22K Yellow Gold'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setConfig({ ...config, metal: option.split(' ').slice(1).join(' '), purity: option.split(' ')[0] });
                        if (showValidation) setShowValidation(false);
                      }}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-bold border transition-all duration-300",
                        `${config.purity} ${config.metal}` === option 
                          ? "bg-brand-text text-white border-brand-text shadow-premium" 
                          : "bg-white text-brand-text/70 border-brand-text/10 hover:border-brand-gold hover:text-brand-text",
                        showValidation && isFieldMissing('metal', validation.missingFields) && "border-red-200"
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
                <div className="flex flex-wrap gap-2">
                  {['7', '8', '9', '10', '11'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setConfig({ ...config, size });
                        if (showValidation) setShowValidation(false);
                      }}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-xl text-[10px] font-bold border transition-all duration-300",
                        config.size === size 
                          ? "bg-brand-text text-white border-brand-text shadow-premium" 
                          : "bg-white text-brand-text/70 border-brand-text/10 hover:border-brand-gold hover:text-brand-text",
                        showValidation && isFieldMissing('size', validation.missingFields) && "border-red-200"
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

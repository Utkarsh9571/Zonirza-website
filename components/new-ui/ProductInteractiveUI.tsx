'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Truck, RotateCcw, Heart, Share2, Info, Check, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from './Button';
import { Section } from './Section';
import { cn } from '@/lib/utils';
import { PLACEHOLDER_IMAGE, getValidImageUrl } from '@/lib/constants';

export function ProductInteractiveUI({ product }: { product: any }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedMetal, setSelectedMetal] = useState('18K Yellow Gold');
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  
  const specs = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;
  const price = specs?.price ? parseFloat(specs.price.replace(/,/g, '')) : 0;

  const handleAddToCart = () => {
    addItem({
      _id: product._id as string,
      name: `${product.name} (${selectedMetal})`,
      price,
      image: product.images[selectedImage],
      quantity,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // In a real app, this would router.push('/cart') or '/checkout'
    window.location.href = '/cart';
  };

  return (
    <div className="bg-brand-bg min-h-screen pb-24">
      {/* Top 2-Column Section */}
      <Section className="!pt-32 !pb-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN (60%) - Image Gallery */}
          <div className="w-full lg:w-[60%] flex flex-col space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
            {/* Main Image */}
            <div className="relative aspect-[4/5] w-full rounded-[40px] overflow-hidden bg-white border border-brand-text/5 shadow-soft group">
              <Image
                key={selectedImage} // forces remount for smooth transition
                src={getValidImageUrl(product.images?.[selectedImage])}
                alt={product.name}
                fill
                className="object-cover p-12 transition-transform duration-[2s] group-hover:scale-110 animate-in fade-in zoom-in-95 duration-500"
                priority
              />
              {/* Floating Actions */}
              <div className="absolute top-8 right-8 flex flex-col space-y-3">
                <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-brand-text/5 text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Heart size={20} />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center border border-brand-text/5 text-brand-text hover:bg-brand-gold hover:text-white transition-all shadow-soft">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
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
          <div className="w-full lg:w-[40%] space-y-10 lg:sticky lg:top-32 animate-in fade-in slide-in-from-right-8 duration-1000">
            
            {/* Title & Price */}
            <div className="space-y-4">
              <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold">
                {product.category} Collection
              </p>
              <h1 className="text-4xl md:text-5xl font-serif text-brand-text leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-end space-x-4 pt-2">
                <p className="text-3xl text-brand-gold font-bold font-serif italic">
                  $ {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-brand-text/40 pb-1">Tax Included</span>
              </div>
              <p className="text-brand-text/60 text-sm leading-relaxed pt-4">
                {product.description}
              </p>
            </div>

            <div className="w-full h-[1px] bg-brand-text/10"></div>

            {/* Interactive Selectors */}
            <div className="space-y-8">
              
              {/* Variant Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">Metal Color</span>
                  <span className="text-[10px] text-brand-text/50">{selectedMetal}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['18K Yellow Gold', '18K Rose Gold', '18K White Gold'].map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={cn(
                        "px-5 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all duration-300",
                        selectedMetal === metal 
                          ? "bg-brand-text text-white border-brand-text shadow-premium" 
                          : "bg-white text-brand-text/70 border-brand-text/10 hover:border-brand-gold hover:text-brand-text"
                      )}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-text">Quantity</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-white rounded-full border border-brand-text/10 p-1 shadow-soft">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-bg text-brand-text transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-brand-text">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-bg text-brand-text transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Call To Actions */}
            <div className="flex flex-col space-y-4 pt-4">
              <Button 
                size="lg" 
                className={cn(
                  "w-full !py-5 shadow-premium transition-all duration-300",
                  isAdded ? "bg-green-600 hover:bg-green-700" : ""
                )}
                onClick={handleAddToCart}
              >
                {isAdded ? <><Check size={18} className="mr-2 inline" /> Added to Cart</> : 'Add to Cart'}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full !py-5 shadow-soft border-brand-text text-brand-text hover:bg-brand-text hover:text-white"
                onClick={handleBuyNow}
              >
                Buy It Now
              </Button>
            </div>

            {/* Quick Trust Badges */}
            <div className="flex items-center justify-between pt-6 px-2 text-brand-text/60">
              <div className="flex flex-col items-center space-y-2">
                <Truck size={20} strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-widest text-center">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RotateCcw size={20} strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-widest text-center">Easy Returns</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <ShieldCheck size={20} strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-widest text-center">Certified</span>
              </div>
            </div>

          </div>
        </div>
      </Section>

      {/* BELOW SECTION: Details & Specs */}
      <Section className="!py-16">
        <div className="bg-white rounded-[50px] p-10 md:p-16 border border-brand-text/5 shadow-premium">
          <div className="flex items-center space-x-6 mb-12 border-b border-brand-text/5 pb-8">
            <Info size={24} className="text-brand-gold" />
            <h2 className="text-2xl font-serif text-brand-text italic">Product Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-text">The Design</h3>
              <p className="text-brand-text/60 text-sm leading-relaxed">
                {product.description} Crafted with meticulous attention to detail, this piece represents the pinnacle of modern luxury jewelry. The intricate setting maximizes brilliance while ensuring everyday durability.
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

      {/* Visual Story Video (If available) */}
      {product.videoUrl && (
        <Section className="!py-12">
          <div className="mt-10 space-y-8">
            <div className="flex items-center justify-center space-x-6">
              <div className="w-12 h-[1px] bg-brand-gold"></div>
              <h3 className="text-[11px] uppercase tracking-[0.5em] font-bold text-brand-gold italic">Visual Story</h3>
              <div className="w-12 h-[1px] bg-brand-gold"></div>
            </div>
            <div className="aspect-video relative rounded-[50px] overflow-hidden bg-brand-text shadow-premium border-8 border-white/50 max-w-5xl mx-auto">
              <iframe
                src={product.videoUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </Section>
      )}

    </div>
  );
}

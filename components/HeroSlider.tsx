'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { resolveProductImage } from '@/lib/imageResolver';
import { cn } from '@/lib/utils';

// Custom resolver for sliders since they live in a different folder
const resolveSliderImage = (imageName: string) => `/images/site/${imageName}`;

const sliderItems = [
  {
    image: resolveSliderImage('wedding.png'),
    title: 'Eternal Diamond Rings',
    subtitle: 'Classic Elegance',
    link: '/products?category=rings'
  },
  {
    image: resolveSliderImage('daily-wear.png'),
    title: 'Signature Necklaces',
    subtitle: 'Handcrafted Beauty',
    link: '/products?category=necklaces'
  },
  {
    image: resolveSliderImage('jewellery_guide.png'),
    title: 'Royal Gold Bracelets',
    subtitle: 'Timeless Style',
    link: '/products?category=bracelets'
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[480px] aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-h-[500px] lg:max-h-[550px] animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
      {/* Removed Decorative Circles */}

      {sliderItems.map((item, index) => {
        const isActive = index === current;
        return (
          <Link 
            href={item.link}
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 transform",
              isActive 
                ? 'opacity-100 translate-x-0 scale-100 rotate-0 z-20 pointer-events-auto' 
                : 'opacity-0 translate-x-12 scale-95 rotate-3 z-10 pointer-events-none'
            )}
          >
            <div className="relative h-full w-full rounded-[40px] md:rounded-[50px] overflow-hidden hero-glass group touch-pan-y transition-colors">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 550px"
                className={cn(
                  "object-cover transition-transform duration-[5s]",
                  isActive ? "scale-105" : "scale-100",
                  "lg:group-hover:scale-110"
                )} 
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-colors"></div>
              
              {/* Content Area */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white space-y-4 pointer-events-none">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold opacity-90">{item.subtitle}</p>
                  <h3 className="text-3xl md:text-4xl font-serif leading-tight text-brand-gold">{item.title}</h3>
                </div>
                
                <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold group/btn">
                  <span>Explore Collection</span>
                  <div className="w-8 h-8 rounded-full bg-white text-brand-text flex items-center justify-center transition-all lg:group-hover/btn:bg-brand-gold lg:group-hover/btn:text-white">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>

              {/* Slider Indicators - Larger touch targets */}
              <div className="absolute top-8 right-8 flex space-x-3 z-30 pointer-events-auto">
                {sliderItems.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrent(i);
                    }}
                    className="touch-safe-hit py-2"
                  >
                    <div className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-white/30'
                    )} />
                  </button>
                ))}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

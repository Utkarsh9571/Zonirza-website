'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const sliderItems = [
  {
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    title: 'Eternal Diamond Rings',
    subtitle: 'Classic Elegance',
    link: '/category/ring'
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    title: 'Signature Necklaces',
    subtitle: 'Handcrafted Beauty',
    link: '/category/necklace'
  },
  {
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    title: 'Royal Gold Bracelets',
    subtitle: 'Timeless Style',
    link: '/category/bracelet'
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
    <div className="relative w-full max-w-[480px] aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-h-[500px] lg:max-h-[550px] lg:mt-8 animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
      {/* Decorative Circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {sliderItems.map((item, index) => (
        <Link 
          href={item.link}
          key={index}
          className={`absolute inset-0 transition-all duration-1000 transform ${
            index === current 
              ? 'opacity-100 translate-x-0 scale-100 rotate-0 pointer-events-auto' 
              : 'opacity-0 translate-x-12 scale-95 rotate-3 pointer-events-none'
          }`}
        >
          <div className="relative h-full w-full rounded-[40px] md:rounded-[50px] overflow-hidden border border-white/20 shadow-2xl group">
            <Image 
              src={item.image} 
              alt={item.title} 
              fill 
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 550px"
              className="object-cover transition-transform duration-[5s] group-hover:scale-110" 
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-text/90 via-brand-text/20 to-transparent"></div>
            
            {/* Content Area */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold opacity-90">{item.subtitle}</p>
                <h3 className="text-3xl md:text-4xl font-serif leading-tight">{item.title}</h3>
              </div>
              
              <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest font-bold group/btn">
                <span>Explore Collection</span>
                <div className="w-8 h-8 rounded-full bg-white text-brand-text flex items-center justify-center transition-all group-hover/btn:bg-brand-gold group-hover/btn:text-white">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>

            {/* Slider Indicators */}
            <div className="absolute top-8 right-8 flex space-x-2">
              {sliderItems.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-white/30'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

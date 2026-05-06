'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const videos = [
  { id: 1, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9WgXcQ', title: 'Diamond Styling Guide', thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600' },
  { id: 2, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9WgXcQ', title: 'The Solitaire Look', thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600' },
  { id: 3, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9WgXcQ', title: 'Minimalist Magic', thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600' },
  { id: 4, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9XcQ', title: 'Bridal Brilliance', thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600' },
  { id: 5, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9WgXcQ', title: 'Heritage Elegance', thumbnail: 'https://images.unsplash.com/photo-1588444837495-c6bfcceebce7?auto=format&fit=crop&q=80&w=600' },
  { id: 6, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9WgXcQ', title: 'Gold Essentials', thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600' },
  { id: 7, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9WgXcQ', title: 'Evening Sparkle', thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600' },
  { id: 8, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&loop=1&playlist=dQw4w9WgXcQ', title: 'Vintage Charm', thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600' }
];

export default function StylingVideoSlider() {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const next = () => setCurrent((prev) => (prev + 1) % videos.length);
  const prev = () => setCurrent((prev) => (prev - 1 + videos.length) % videos.length);

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) next();
    if (distance < -50) prev();
  };

  const getCardStyle = (index: number) => {
    const diff = (index - current + videos.length) % videos.length;
    let normalizedDiff = diff;
    if (diff > videos.length / 2) normalizedDiff = diff - videos.length;

    const absDiff = Math.abs(normalizedDiff);
    const zIndex = 50 - absDiff * 10;
    const scale = 1 - absDiff * 0.15;
    const opacity = 1 - absDiff * 0.25;
    const translateX = normalizedDiff * 75; // Increased spread
    
    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity: absDiff > 3 ? 0 : opacity, // Show up to 7 cards (center + 3 each side)
      pointerEvents: normalizedDiff === 0 ? 'auto' : 'none',
    };
  };

  return (
    <div className="relative w-full h-[550px] sm:h-[650px] flex items-center justify-center">
      
      {/* Navigation Arrows (Positioned at screen edges) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-10 z-50 pointer-events-none">
        <button 
          onClick={prev}
          className="pointer-events-auto w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-brand-text/80 text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-premium group border border-white/20"
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={next}
          className="pointer-events-auto w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-brand-text/80 text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-premium group border border-white/20"
        >
          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* The Stacked Container */}
      <div 
        className="relative w-[260px] sm:w-[320px] aspect-[9/16] flex items-center justify-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {videos.map((video, i) => (
          <div 
            key={video.id}
            className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-brand-text"
            style={getCardStyle(i) as any}
          >
            {/* Video or Thumbnail */}
            {i === current ? (
              <iframe
                src={video.url}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                title={video.title}
              ></iframe>
            ) : (
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${video.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/20"></div> {/* Reduced overlay opacity */}
              </div>
            )}

            {/* Title Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-1">Styling 101</p>
              <h4 className="text-sm font-serif leading-tight">{video.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-4 flex space-x-2">
        {videos.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-brand-gold' : 'w-1.5 bg-brand-text/20'}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

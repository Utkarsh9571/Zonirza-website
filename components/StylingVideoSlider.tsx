'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const videos = [
  { id: 1, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Diamond Styling Guide', thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600' },
  { id: 2, url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-wearing-a-diamond-necklace-4406-large.mp4', title: 'The Solitaire Look', thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600' },
  { id: 3, url: 'https://www.instagram.com/reels/C42n-ZSvK-R/', title: 'Minimalist Magic', thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600' },
  { id: 4, url: 'https://assets.mixkit.co/videos/preview/mixkit-diamond-earrings-on-a-woman-4404-large.mp4', title: 'Bridal Brilliance', thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600' },
  { id: 5, url: 'https://assets.mixkit.co/videos/preview/mixkit-shiny-gold-necklace-on-a-glamorous-woman-4405-large.mp4', title: 'Heritage Elegance', thumbnail: 'https://images.unsplash.com/photo-1588444837495-c6bfcceebce7?auto=format&fit=crop&q=80&w=600' },
  { id: 6, url: 'https://assets.mixkit.co/videos/preview/mixkit-diamond-pendant-hanging-from-a-gold-chain-4407-large.mp4', title: 'Gold Essentials', thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600' },
  { id: 7, url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-displaying-a-diamond-bracelet-4403-large.mp4', title: 'Evening Sparkle', thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600' },
  { id: 8, url: 'https://assets.mixkit.co/videos/preview/mixkit-macro-of-a-beautiful-diamond-ring-4401-large.mp4', title: 'Vintage Charm', thumbnail: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600' }
];

const getYoutubeEmbedUrl = (url: string) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&iv_load_policy=3`;
  }
  return null;
};

const getInstagramEmbedUrl = (url: string) => {
  if (url.includes('instagram.com')) {
    const reelId = url.split('/reels/')[1]?.split('/')[0] || url.split('/p/')[1]?.split('/')[0];
    if (reelId) return `https://www.instagram.com/reels/${reelId}/embed/`;
  }
  return null;
};

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
    const translateX = normalizedDiff * 75;
    
    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity: absDiff > 3 ? 0 : opacity,
      pointerEvents: normalizedDiff === 0 ? 'auto' : 'none',
    };
  };

  return (
    <div className="relative w-full h-[550px] sm:h-[650px] flex items-center justify-center">
      
      {/* Navigation Arrows (Higher z-index and explicit click handling) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-10 z-[60] pointer-events-none">
        <button 
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="pointer-events-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-text/90 text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-premium group border border-white/20 active:scale-95"
          aria-label="Previous video"
        >
          <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="pointer-events-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-text/90 text-white flex items-center justify-center hover:bg-brand-gold transition-all shadow-premium group border border-white/20 active:scale-95"
          aria-label="Next video"
        >
          <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
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
            {/* Direct Video Tag for Mobile Autoplay */}
            {i === current ? (
              <div className="relative w-full h-full">
                {getYoutubeEmbedUrl(video.url) ? (
                  <iframe
                    src={getYoutubeEmbedUrl(video.url) || ''}
                    className="w-full h-full object-cover z-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : getInstagramEmbedUrl(video.url) ? (
                  <iframe
                    src={getInstagramEmbedUrl(video.url) || ''}
                    className="w-full h-full object-cover z-0"
                    allow="autoplay"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={video.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover z-0"
                  />
                )}
                {/* Visual Overlay to ensure title readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
              </div>
            ) : (
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${video.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            {/* Title Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white transition-opacity duration-500 z-20 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-1">Styling 101</p>
              <h4 className="text-sm font-serif leading-tight">{video.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Indicators */}
      <div className="absolute bottom-4 flex space-x-2 z-20">
        {videos.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-brand-gold' : 'w-1.5 bg-brand-text/20'}`}
          />
        ))}
      </div>
    </div>
  );
}

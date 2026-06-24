'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Share2, Volume2, Video, Play, Pause, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const videos = [
  { id: 1, url: 'https://youtube.com/shorts/siNBYmnznR8?si=3RU0yqgmMOi5YdXz', title: 'Adele - Skyfall', thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600', link: '/products?tag=featured' },
  { id: 2, url: 'https://youtube.com/shorts/gf7Nwtc3XPQ?si=o3Ewvy5tqL-oTz2a', title: 'The Solitaire Look', thumbnail: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600', link: '/products?tag=solitaire' },
  { id: 3, url: 'https://youtube.com/shorts/O2iFzHObLQw?si=GdgsH8VtkH5WeTjL', title: 'Minimalist Magic', thumbnail: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600', link: '/products?style=minimalist' },
  { id: 4, url: 'https://youtube.com/shorts/d57em3y3MXQ?si=_DZMkeczYy_T153f', title: 'Bridal Brilliance', thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600', link: '/products?tag=wedding' },
  { id: 5, url: 'https://youtube.com/shorts/bxAAw8o-AxM?si=rMkxddJgDK5g6C41', title: 'Heritage Elegance', thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600', link: '/products?collection=heritage' }
];

const getYoutubeEmbedUrl = (url: string) => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`;
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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % videos.length);
  const prev = () => setCurrent((prev) => (prev - 1 + videos.length) % videos.length);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.isPrimary) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setIsMouseDown(true);
      setMouseStart(e.clientX);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isMouseDown || mouseStart === null) return;
    const distance = mouseStart - e.clientX;
    if (Math.abs(distance) > 50) { 
      if (distance > 0) next();
      else prev();
      setIsMouseDown(false);
      setMouseStart(null);
    }
  };

  const onPointerUp = () => {
    setIsMouseDown(false);
    setMouseStart(null);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setIsUserPaused(false);
  }, [current]);

  const togglePlay = () => {
    setIsUserPaused(prev => !prev);
  };

  const getCardStyle = (index: number) => {
    const diff = (index - current + videos.length) % videos.length;
    let normalizedDiff = diff;
    if (diff > videos.length / 2) normalizedDiff = diff - videos.length;

    const absDiff = Math.abs(normalizedDiff);
    const zIndex = 50 - absDiff * 10;
    const scale = isMobile ? (1 - absDiff * 0.15) : (1 - absDiff * 0.12);
    const opacity = 1 - absDiff * 0.3;
    const translateX = isMobile ? (normalizedDiff * 55) : (normalizedDiff * 45); 
    
    return {
      transform: isMobile && absDiff > 0 
        ? `translateX(${normalizedDiff * 100}%) scale(0.8)` 
        : `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity: absDiff > (isMobile ? 1 : 2) ? 0 : opacity,
      pointerEvents: normalizedDiff === 0 ? 'auto' : 'none' as const, 
      visibility: absDiff > (isMobile ? 1 : 2) ? 'hidden' : 'visible' as const,
    };
  };

  const renderContent = (video: typeof videos[0], isCurrent: boolean) => {
    if (!isCurrent) {
      return (
        <div className="relative w-full h-full bg-brand-bg">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      );
    }

    const youtubeUrl = getYoutubeEmbedUrl(video.url);
    const instagramUrl = getInstagramEmbedUrl(video.url);

    if (youtubeUrl) {
      const shouldPlay = isInView && isCurrent && !isUserPaused;
      return (
        <iframe
          key={`yt-${video.id}-${shouldPlay}`}
          src={youtubeUrl + (shouldPlay ? "" : "&autoplay=0")}
          className="w-full h-full object-cover z-0 pointer-events-auto"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      );
    }

    if (instagramUrl) {
      return (
        <iframe
          key={`ig-${video.id}-${isInView}-${isCurrent}`}
          src={instagramUrl + (isInView && isCurrent && !isUserPaused ? "?autoplay=1" : "")}
          className="w-full h-full object-cover z-0"
          allow="autoplay"
          allowFullScreen
        ></iframe>
      );
    }

    return (
      <video
        ref={el => { videoRefs.current[video.id] = el; }}
        src={video.url}
        muted
        loop
        playsInline
        className="w-full h-full object-cover z-0"
      />
    );
  };

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const isCurrentVideo = videos.find(v => v.id === parseInt(id))?.id === videos[current].id;
      if (isCurrentVideo && isInView && !isUserPaused) {
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [current, isInView, isUserPaused]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] sm:h-[700px] flex items-center justify-center overflow-hidden touch-pan-y"
    >
      <div 
        className="relative w-[260px] sm:w-[340px] aspect-[9/16] flex items-center justify-center z-0 touch-none pointer-events-none"
      >
        {videos.map((video, i) => {
          const isCurrentCard = i === current;
          return (
            <div 
              key={video.id}
              onPointerDown={isCurrentCard ? onPointerDown : undefined}
              onPointerMove={isCurrentCard ? onPointerMove : undefined}
              onPointerUp={isCurrentCard ? onPointerUp : undefined}
              onPointerLeave={isCurrentCard ? onPointerUp : undefined}
              onPointerCancel={isCurrentCard ? onPointerUp : undefined}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-brand-text",
                isCurrentCard ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none"
              )}
              style={getCardStyle(i) as any}
            >
              <div className="relative w-full h-full">
                {renderContent(video, isCurrentCard)}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500",
                  isCurrentCard ? "opacity-100" : "opacity-0"
                )} />
                {isCurrentCard && (
                  <div className="absolute top-6 left-0 right-0 px-6 flex justify-between items-center z-50 pointer-events-auto">
                    <p className="text-[10px] text-white/80 font-medium tracking-tight truncate max-w-[150px]">
                      Find the perfect diam...
                    </p>
                    <div className="flex items-center space-x-3">
                      <button onClick={togglePlay} className="text-white/90 hover:text-white transition-colors">
                        {isUserPaused ? <Play size={18} strokeWidth={1.5} /> : <Pause size={18} strokeWidth={1.5} />}
                      </button>
                      <button className="text-white/90 hover:text-white transition-colors">
                        <Volume2 size={18} strokeWidth={1.5} />
                      </button>
                      <button 
                        onClick={() => { if (navigator.share) navigator.share({ title: video.title, url: video.url }); }}
                        className="text-white/90 hover:text-white transition-colors"
                      >
                        <Share2 size={18} strokeWidth={1.5} />
                      </button>
                      <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white transition-colors">
                        <Video size={18} strokeWidth={1.5} />
                      </a>
                    </div>
                  </div>
                )}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent text-white transition-all duration-700 z-20",
                  isCurrentCard ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-2">Styling 101</p>
                  <h4 className="text-lg font-serif leading-tight">{video.title}</h4>
                  <Link 
                    href={video.link}
                    className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-white transition-colors mt-4 pointer-events-auto"
                  >
                    <span>Shop the Look</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:px-24 z-[200] pointer-events-none">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/40 backdrop-blur-md text-brand-text flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all shadow-premium border border-white/60 active:scale-90 pointer-events-auto cursor-pointer touch-safe-hit"
          aria-label="Previous video"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/40 backdrop-blur-md text-brand-text flex items-center justify-center hover:bg-brand-gold hover:text-white transition-all shadow-premium border border-white/60 active:scale-90 pointer-events-auto cursor-pointer touch-safe-hit"
          aria-label="Next video"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-10 flex space-x-3 z-20">
        {videos.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-text/10'}`} />
        ))}
      </div>
    </div>
  );
}

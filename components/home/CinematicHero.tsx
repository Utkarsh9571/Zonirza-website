'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Diamond, Coins, CalendarCheck, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthModalStore } from '@/store/authModalStore';

// The floating cards on the right side
const floatingCards = [
  {
    title: 'Bridal Collection',
    subtitle: 'Timeless Elegance',
    icon: Diamond,
    href: '/products?category=rings',
    delay: 0.1
  },
  {
    title: 'Gold Exchange',
    subtitle: '100% Value',
    icon: RotateCcw,
    href: '/exchange',
    delay: 0.2
  },
  {
    title: 'Digi Gold',
    subtitle: 'Save in 24K',
    icon: Coins,
    href: '/digi-gold',
    delay: 0.3
  },
  {
    title: 'Book Appointment',
    subtitle: 'In-Store Valuation',
    icon: CalendarCheck,
    href: '/exchange?tab=sell',
    delay: 0.4
  }
];

export default function CinematicHero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { openAuthModal } = useAuthModalStore();

  useEffect(() => {
    // Detect viewport for video source
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await fetch('/api/hero-slides');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSlides(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch hero slides:', error);
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return <div className="h-screen w-full bg-[#12100e] animate-pulse" />;
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative h-screen min-h-[750px] w-full overflow-hidden bg-[#12100e]">
      
      {/* Background Videos with Crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {(() => {
            const videoUrl = isMobile ? slide.videoMobile : slide.videoDesktop;
            const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');
            
            if (isYouTube) {
              const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
              const videoId = videoIdMatch ? videoIdMatch[1] : null;
              
              if (videoId) {
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                    allow="autoplay; encrypted-media"
                    className="object-cover w-full h-full scale-150 pointer-events-none"
                    style={{ border: 'none' }}
                  />
                );
              }
            }

            return (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={slide.posterImage}
                className="object-cover w-full h-full scale-105"
                style={{ transform: "scale(1.05)" }} // Slight scale to prevent edge bleeding on transition
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            );
          })()}
          
          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Content Area */}
        <div className="flex-1 max-w-2xl text-white space-y-8 self-center lg:self-center mt-12 lg:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 backdrop-blur-md">
                <Sparkles size={14} className="text-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">{slide.subtitle}</span>
              </div>
              
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight"
                dangerouslySetInnerHTML={{ __html: slide.title }}
              />

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                {slide.primaryCTA && (
                  <Link 
                    href={slide.primaryCTA.link}
                    className="w-full sm:w-auto px-8 py-4 bg-brand-gold hover:bg-[#B4925A] text-[#12100e] rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center space-x-3 shadow-premium group"
                  >
                    <span>{slide.primaryCTA.label}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                {slide.secondaryCTA?.label && (
                  <Link 
                    href={slide.secondaryCTA.link}
                    className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-[11px] uppercase tracking-[0.2em] font-bold transition-all flex items-center justify-center"
                  >
                    {slide.secondaryCTA.label}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Floating Cards (Desktop/Tablet mainly) */}
        <div className="hidden lg:flex flex-col gap-4 max-w-sm ml-auto">
          {floatingCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + card.delay, duration: 0.8 }}
            >
              <Link 
                href={card.href}
                className="group flex items-center p-4 rounded-2xl bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 hover:border-brand-gold/50 transition-all duration-500 shadow-2xl overflow-hidden relative"
              >
                {/* Subtle hover gradient inside card */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/0 to-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform duration-500 z-10">
                  <card.icon size={20} />
                </div>
                <div className="ml-4 z-10 flex-1">
                  <h3 className="text-white text-sm font-bold group-hover:text-brand-gold transition-colors">{card.title}</h3>
                  <p className="text-white/50 text-[10px] uppercase tracking-widest mt-1">{card.subtitle}</p>
                </div>
                <ArrowRight size={16} className="text-white/20 group-hover:text-brand-gold transform -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Progress Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="group py-2"
            >
              <div className={cn(
                "h-1 rounded-full transition-all duration-500",
                currentSlide === idx ? "w-12 bg-brand-gold" : "w-4 bg-white/30 group-hover:bg-white/60"
              )} />
            </button>
          ))}
        </div>
      )}

    </section>
  );
}

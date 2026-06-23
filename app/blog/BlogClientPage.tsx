'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOG_POSTS } from '@/lib/blog/posts';

// ---- BLOG DATA (static for now, easily replaceable with CMS/API) ----
const BLOG_CATEGORIES = [
  'All Blogs', 'Gold', 'Diamond', 'Earrings', 'Rings', 
  'Trending', 'Bridal', 'Daily Wear', 'Styling'
];

// ---- HERO SLIDES ----
const HERO_SLIDES = [
  {
    image: '/images/site/blog-hero.png',
    title: 'The Art of Adorning',
    subtitle: 'Discover stories behind the masterpieces',
  },
  {
    image: '/images/site/blog/post-1.png',
    title: 'Bridal Jewellery Guide',
    subtitle: 'Timeless traditions, modern elegance',
  },
  {
    image: '/images/site/blog/post-4.png',
    title: 'Wedding Statement Jewels',
    subtitle: 'Crafted for your most precious moments',
  },
  {
    image: '/images/site/blog/post-3.png',
    title: 'Solitaire Excellence',
    subtitle: 'A journey of emotion and precision',
  },
];

export default function BlogClientPage() {
  const [activeCategory, setActiveCategory] = useState('All Blogs');
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-sliding loop
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const filteredPosts = activeCategory === 'All Blogs'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
      );

  const featuredPosts = BLOG_POSTS.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-brand-bg">
      

      {/* ====== HERO BANNER with SLIDER ====== */}
      <section className="relative w-full h-[60vh] min-h-100 max-h-137.5 overflow-hidden">
        <div className="absolute inset-0 transition-all duration-700">
          <Image
            src={HERO_SLIDES[heroIndex].image}
            alt={HERO_SLIDES[heroIndex].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-text/70 via-brand-text/40 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-3">Zoniraz Journal</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight max-w-xl">
            {HERO_SLIDES[heroIndex].title}
          </h1>
          <p className="text-white/60 text-sm mt-4 max-w-md">
            {HERO_SLIDES[heroIndex].subtitle}
          </p>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 right-8 z-10 flex items-center space-x-3">
          <button 
            onClick={() => setHeroIndex(i => i === 0 ? HERO_SLIDES.length - 1 : i - 1)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2">
          {HERO_SLIDES.map((_, i) => (
            <button 
              key={i}
              onClick={() => setHeroIndex(i)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                i === heroIndex 
                  ? "bg-brand-gold w-8 rounded-full" 
                  : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </section>

      {/* ====== CATEGORY TABS ====== */}
      <section className="sticky top-25 z-40 bg-white/95 backdrop-blur-xl border-b border-brand-border shadow-soft mt-1">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex items-center overflow-x-auto no-scrollbar py-5 space-x-8">
            {BLOG_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "text-[11px] uppercase tracking-[0.2em] font-black whitespace-nowrap transition-all duration-300 pb-2 border-b-2",
                  activeCategory === cat
                    ? "text-brand-gold border-brand-gold"
                    : "text-brand-muted/40 border-transparent hover:text-brand-text hover:border-brand-border"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED SECTION ====== */}
      {activeCategory === 'All Blogs' && (
        <section className="bg-[#3A1C16] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-serif text-[#EAE1D5]">Editor&apos;s Picks</h2>
              <Link href="#all" className="text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-white transition-colors">
                View More
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Large Left Featured Card */}
              {featuredPosts[0] && (
                <div className="lg:col-span-6 group">
                  <Link href={`/blog/${featuredPosts[0].slug}`} className="block">
                    <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden mb-6">
                      <Image
                        src={featuredPosts[0].image}
                        alt={featuredPosts[0].title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                      {featuredPosts[0].tags.map(tag => (
                        <span key={tag} className="px-4 py-1.5 border border-[#EAE1D5]/40 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#EAE1D5]/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-serif text-[#EAE1D5] leading-tight group-hover:text-brand-gold transition-colors">
                      {featuredPosts[0].title}
                    </h3>
                    <p className="text-[#EAE1D5]/70 text-sm mt-4 leading-relaxed line-clamp-3">
                      {featuredPosts[0].excerpt}
                    </p>
                  </Link>
                </div>
              )}

              {/* Right Stacked Featured Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredPosts.slice(1, 3).map(post => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                    <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 border border-[#EAE1D5]/40 rounded-full text-[9px] uppercase tracking-widest font-bold text-[#EAE1D5]/80">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h4 className="text-lg font-serif text-[#EAE1D5] leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-[#EAE1D5]/60 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mt-3">{post.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====== TWO-COLUMN LARGE CARDS ====== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(activeCategory === 'All Blogs' ? filteredPosts.slice(0, 2) : filteredPosts.slice(0, 2)).map(post => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-white rounded-4xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 border border-brand-border">
                <div className="relative w-full aspect-16/10 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 space-y-4 border border-brand-gold rounded-b-4xl">
                  <p className="text-brand-gold text-[11px] uppercase tracking-widest font-bold">{post.date}</p>
                  <h3 className="text-xl sm:text-2xl font-serif text-brand-text leading-snug group-hover:text-brand-gold transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-4 py-1.5 border border-brand-border rounded-full text-[10px] uppercase tracking-widest font-bold text-brand-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SPOTLIGHT EDITORIAL SECTION ====== */}
      {activeCategory === 'All Blogs' && (
        <section className="bg-[#3A1C16] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              {/* Left: Image */}
              <div className="relative w-full aspect-square lg:aspect-auto lg:h-137.5 overflow-hidden">
                <Image
                  src="/images/site/blog/post-1.png"
                  alt="Queen of the Aisle"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Right: Editorial Content */}
              <div className="p-10 sm:p-16 lg:p-20 space-y-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#EAE1D5] leading-[1.15]">
                  Queen of the Aisle: Wedding jewels that make a statement.
                </h2>
                <p className="text-[#EAE1D5]/60 text-sm sm:text-base leading-relaxed max-w-lg">
                  Your wedding day is your time to shine like the queen you are, and while you may have spent months searching for the perfect bridal ensemble, the right jewellery can elevate your entire look.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-5 py-2 border border-[#EAE1D5]/30 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#EAE1D5]/70">
                    Styling
                  </span>
                  <span className="px-5 py-2 border border-[#EAE1D5]/30 rounded-full text-[10px] uppercase tracking-widest font-bold text-[#EAE1D5]/70">
                    Bridal
                  </span>
                </div>
                <Link 
                  href="/blog/bihari-bridal-jewellery-traditions"
                  className="inline-flex items-center space-x-3 text-brand-gold text-[11px] uppercase tracking-widest font-bold group"
                >
                  <span>Read the Story</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ====== THREE-COLUMN GRID ====== */}
      <section id="all" className="pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif text-brand-text">Latest Stories</h2>
              <div className="w-16 h-0.5 bg-brand-gold mt-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeCategory === 'All Blogs' ? filteredPosts : filteredPosts).map(post => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 border border-brand-text/5">
                <div className="relative w-full aspect-4/3 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-3 border border-brand-gold rounded-b-3xl">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 border border-brand-text/10 rounded-full text-[9px] uppercase tracking-widest font-bold text-brand-text/50 hover:border-brand-gold hover:text-brand-gold transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-serif text-brand-text leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-brand-text/40 text-[13px] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-brand-text/30 text-[11px] font-bold">{post.date}</p>
                    <div className="flex items-center space-x-1 text-brand-text/30">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold">{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

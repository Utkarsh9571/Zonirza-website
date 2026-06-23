'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Heart, Share2, Globe, Mail, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BLOG_POSTS } from '@/lib/blog/posts';

export default function BlogPostClient({ post }: { post: any }) {
  const slug = post.slug;
  
  return (
    <div className="min-h-screen bg-white">
      

      {/* Hero Header Section */}
      <section className="relative w-full h-[70vh] min-h-125 overflow-hidden">
        <Image 
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              {post.title}
            </h1>
            <p className="text-white/80 text-sm uppercase tracking-[0.3em] font-bold animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">By {post.author}</p>
          </div>
        </div>
      </section>

      {/* Meta Bar */}
      <div className="sticky top-18 z-30 bg-white/80 backdrop-blur-xl border-b border-brand-text/5 py-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-brand-text/40">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest">+1 People like this!</span>
            </div>
            <div className="flex items-center space-x-2 text-brand-text/40">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">{post.readTime}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-brand-bg rounded-full transition-all duration-300" title="Share on Web"><Globe size={18} className="text-brand-text/60" /></button>
            <button className="p-2 hover:bg-brand-bg rounded-full transition-all duration-300" title="Share via Email"><Mail size={18} className="text-brand-text/60" /></button>
          </div>
        </div>
      </div>

      {/* Dynamic Content Sections */}
      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-brand max-w-none">
          {post.sections?.map((section: any, idx: number) => {
            switch (section.type) {
              case 'intro':
                return (
                  <div key={idx} className="mb-20">
                    <h2 className="text-4xl font-serif text-brand-text mb-8">{section.title}</h2>
                    <p className="text-lg text-brand-text/70 leading-relaxed italic border-l-4 border-brand-gold pl-8">
                      {section.text}
                    </p>
                  </div>
                );
              case 'text-image':
                return (
                  <section key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-6">
                      <h2 className="text-3xl font-serif text-brand-text">{section.title}</h2>
                      <p className="text-brand-text/70 leading-relaxed">{section.text}</p>
                    </div>
                    {section.image && (
                      <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-premium">
                        <Image src={section.image} alt={section.title || ""} fill className="object-cover" />
                      </div>
                    )}
                  </section>
                );
              case 'image-text':
                return (
                  <section key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    {section.image && (
                      <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-premium order-2 md:order-1">
                        <Image src={section.image} alt={section.title || ""} fill className="object-cover" />
                      </div>
                    )}
                    <div className="space-y-6 order-1 md:order-2">
                      <h2 className="text-3xl font-serif text-brand-text">{section.title}</h2>
                      <p className="text-brand-text/70 leading-relaxed">{section.text}</p>
                    </div>
                  </section>
                );
              case 'highlight':
                return (
                  <div key={idx} className="bg-brand-bg rounded-[40px] p-10 md:p-16 mb-24 text-center space-y-8">
                    <h2 className="text-3xl font-serif text-brand-text">{section.title}</h2>
                    <p className="text-brand-text/70 leading-relaxed max-w-2xl mx-auto">{section.text}</p>
                    <Link href="/products" className="inline-flex items-center space-x-2 bg-brand-gold text-white px-10 py-4 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-text transition-all">
                      <span>Explore Collection</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                );
              case 'tips':
                return (
                  <div key={idx} className="bg-[#3A1C16] rounded-[40px] p-10 md:p-16 mb-24 text-[#EAE1D5]">
                    <h2 className="text-3xl font-serif mb-8">{section.title}</h2>
                    <ul className="space-y-6 text-[#EAE1D5]/70">
                      {section.items?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start space-x-4">
                          <div className="w-6 h-6 rounded-full bg-brand-gold shrink-0 flex items-center justify-center text-white text-[10px] font-bold">{i + 1}</div>
                          <p>{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Shop Now Banner */}
        <Link href="/products" className="block relative w-full h-62.5 rounded-[40px] overflow-hidden group mb-24">
          <Image src="/images/site/blog/banner-shop.png" alt="Shop Now" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="px-12 py-5 bg-white text-brand-text text-[11px] uppercase tracking-[0.4em] font-black rounded-full shadow-premium hover:bg-brand-gold hover:text-white transition-all transform active:scale-95">
              Shop Now
            </span>
          </div>
        </Link>

        {/* Related Posts */}
        <div className="border-t border-brand-text/10 pt-20 mb-20">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-text text-center mb-16">Related Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3).map(relatedPost => (
              <Link 
                href={`/blog/${relatedPost.slug}`} 
                key={relatedPost.id} 
                className="group bg-white rounded-3xl border border-brand-text/5 overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image src={relatedPost.image} alt={relatedPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6 space-y-4 border border-brand-gold rounded-b-4xl">
                  <div className="flex flex-wrap gap-2">
                    {relatedPost.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-3 py-1 border border-red-800/20 rounded-lg text-[9px] uppercase tracking-widest font-bold text-red-800/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-serif text-brand-text group-hover:text-brand-gold transition-colors line-clamp-2 leading-snug">
                    {relatedPost.title}
                  </h3>
                  <p className="text-brand-text/30 text-[10px] font-bold uppercase tracking-widest pt-2">
                    {relatedPost.date}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-brand-text/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/blog" className="flex items-center space-x-3 text-brand-text/40 hover:text-brand-gold transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Journal</span>
          </Link>
          <div className="flex items-center space-x-6">
            <p className="text-[10px] uppercase tracking-widest font-black text-brand-text/20">Read More</p>
            <Link href={`/blog/${BLOG_POSTS.find(p => p.slug !== slug)?.slug || "gold-earrings-must-have-accessory-2026"}`} className="text-sm font-serif text-brand-text hover:text-brand-gold transition-colors">
              Discover More
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

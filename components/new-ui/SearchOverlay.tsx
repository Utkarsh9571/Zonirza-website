'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resolveProductImage } from '@/lib/imageResolver';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
          const data = await res.json();
          if (data.success) {
            setResults(data.data);
            setCollections(data.collections || []);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setCollections([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-in fade-in duration-300">
      {/* Glassmorphism Background */}
      <div 
        className="absolute inset-0 bg-brand-text/40 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Search Content */}
      <div className="relative w-full max-w-5xl mx-auto mt-20 px-6 sm:px-12 flex flex-col h-full max-h-[80vh]">
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-[40px] shadow-premium overflow-hidden flex flex-col border border-white/20 dark:border-zinc-800 transition-colors">
          
          {/* Search Input Area */}
          <div className="p-8 border-b border-brand-text/5 flex items-center space-x-6">
            <div className="relative flex-1">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-gold" size={24} />
              <form onSubmit={handleSearchSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Discover masterpieces..."
                  className="w-full bg-transparent border-none focus:ring-0 text-2xl sm:text-3xl font-serif text-brand-text placeholder:text-brand-text/20 pl-10"
                />
              </form>
            </div>
            {loading && <Loader2 className="animate-spin text-brand-gold" size={24} />}
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-brand-bg text-brand-text hover:bg-brand-gold hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {query.length < 2 ? (
              <div className="space-y-12 py-8">
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-text/40 mb-8">Popular Suggestions</h3>
                  <div className="flex flex-wrap gap-3">
                    {['Diamond Rings', 'Gold Necklace', 'Engagement', 'Minimalist', 'Bridal'].map((tag) => (
                      <button 
                        key={tag}
                        onClick={() => setQuery(tag)}
                        className="px-6 py-3 rounded-full bg-brand-bg text-[11px] font-bold uppercase tracking-widest text-brand-text hover:bg-brand-gold hover:text-white transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left: Collections & Categories */}
                <div className="lg:col-span-4 space-y-10">
                  {collections.length > 0 && (
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-text/40 mb-6">Collections</h3>
                      <div className="space-y-4">
                        {collections.map((col) => (
                          <Link 
                            key={col.slug}
                            href={`/products?collection=${col.slug}`}
                            onClick={onClose}
                            className="flex items-center justify-between p-4 rounded-2xl bg-brand-bg dark:bg-zinc-900 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-soft transition-all group"
                          >
                            <span className="text-[12px] font-bold uppercase tracking-widest text-brand-text">{col.name}</span>
                            <ArrowRight size={14} className="text-brand-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-8 bg-brand-gold/5 rounded-[32px] border border-brand-gold/10">
                    <ShoppingBag className="text-brand-gold mb-4" size={24} />
                    <h4 className="text-brand-text font-serif font-bold text-lg mb-2">Need help?</h4>
                    <p className="text-[11px] text-brand-text/60 leading-relaxed uppercase tracking-widest font-medium mb-6">
                      Our jewelry experts are ready to assist you in finding the perfect piece.
                    </p>
                    <Link href="/contact" onClick={onClose} className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center group">
                      Book Consultation <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Right: Product Results */}
                <div className="lg:col-span-8 space-y-8">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-text/40">Masterpieces</h3>
                  {results.length > 0 ? (
                    <div className="space-y-4">
                      {results.map((product) => (
                        <Link 
                          key={product.slug}
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center space-x-6 p-4 rounded-2xl hover:bg-brand-bg transition-all group"
                        >
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-bg flex-shrink-0">
                            <Image 
                              src={resolveProductImage(product.images?.[0])}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold mb-1">{product.category}</p>
                            <h4 className="text-brand-text font-serif font-bold truncate group-hover:text-brand-gold transition-colors">{product.name}</h4>
                            <p className="text-[12px] font-bold text-brand-text mt-1">₹{product.basePrice?.toLocaleString()}</p>
                          </div>
                          <ArrowRight size={18} className="text-brand-text/10 group-hover:text-brand-gold transition-colors" />
                        </Link>
                      ))}
                      {query.length >= 2 && (
                        <button 
                          onClick={handleSearchSubmit}
                          className="w-full py-4 mt-4 border-2 border-brand-text/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-gold hover:border-brand-gold transition-all"
                        >
                          View All Results
                        </button>
                      )}
                    </div>
                  ) : !loading && query.length >= 2 ? (
                    <div className="py-12 text-center bg-brand-bg rounded-[32px]">
                      <p className="text-brand-text/40 text-sm italic font-serif">No matches found for &quot;{query}&quot;</p>
                    </div>
                  ) : loading ? (
                    <div className="py-24 flex items-center justify-center">
                      <Loader2 className="animate-spin text-brand-gold/30" size={48} />
                    </div>
                  ) : null}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Search, 
  LayoutGrid, 
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { resolveProductImage } from '@/lib/imageResolver';

// Filter data structure (Simplified for Search)
const FILTERS = [
  {
    id: 'category',
    label: 'Category',
    options: ['Gold', 'Diamond', 'Earrings', 'Rings', 'Pendants']
  },
  {
    id: 'metal',
    label: 'Metal',
    options: ['Yellow Gold', 'White Gold', 'Rose Gold']
  },
  {
    id: 'price',
    label: 'Price Range',
    options: [
      { label: 'Under ₹20,000', min: 0, max: 20000 },
      { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
      { label: 'Over ₹1,00,000', min: 100000, max: 10000000 }
    ]
  }
];

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          setTotalCount(data.count);
          setCollections(data.collections || []);
        }
      } catch (error) {
        console.error('Search results error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Parse filters
    const filters: any[] = [];
    searchParams.forEach((value, key) => {
      if (key !== 'q' && !['price_min', 'price_max', 'limit', 'sort'].includes(key)) {
        filters.push({ key, value });
      }
    });
    setActiveFilters(filters);
  }, [query, searchParams]);

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-brand-white">
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-32 pb-12 px-6 sm:px-12 bg-gradient-to-b from-[#FDF8F6] to-brand-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">
                <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
                <span>/</span>
                <span className="text-brand-text/80">Search Results</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-text italic">
                Search: <span className="not-italic text-brand-gold">&quot;{query}&quot;</span>
              </h1>
              <p className="text-brand-text/50 text-sm max-w-lg">
                Discovering masterpieces inspired by your search.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[12px] font-bold text-brand-text/60 uppercase tracking-widest">
                {totalCount} Results Found
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-24">
        
        {/* Collection Suggestions Bar (if any) */}
        {collections.length > 0 && (
          <div className="mb-12 p-8 bg-brand-bg rounded-[40px] border border-brand-text/5">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-text/40 mb-6">Suggested Collections</h3>
            <div className="flex flex-wrap gap-4">
              {collections.map((col) => (
                <Link 
                  key={col.slug}
                  href={`/products?collection=${col.slug}`}
                  className="flex items-center space-x-3 px-6 py-4 bg-white rounded-2xl shadow-soft hover:shadow-premium transition-all group"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-text">{col.name}</span>
                  <ArrowRight size={14} className="text-brand-gold group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar (Reusing Logic) */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-10">
            <div className="flex items-center justify-between pb-6 border-b border-brand-text/10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-text">Refine Search</h2>
              {activeFilters.length > 0 && (
                <button onClick={clearAllFilters} className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Clear All</button>
              )}
            </div>
            <div className="space-y-12">
              {FILTERS.map((filter) => (
                <div key={filter.id} className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-brand-text/40">{filter.label}</h3>
                  <div className="space-y-3">
                    {filter.options.map((option: any, idx) => (
                      <button 
                        key={idx} 
                        className="flex items-center justify-between w-full text-brand-text/60 hover:text-brand-text text-[13px] tracking-wide"
                      >
                        <span>{typeof option === 'object' ? option.label : option}</span>
                        <div className="w-4 h-4 rounded-full border border-brand-text/10" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Grid */}
          <div className="flex-1 space-y-8">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="space-y-4 animate-pulse">
                    <div className="aspect-square bg-brand-bg rounded-2xl" />
                    <div className="h-4 bg-brand-bg rounded w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product.slug}
                    name={product.name}
                    price={`₹${(product.basePrice || 0).toLocaleString()}`}
                    image={resolveProductImage(product.images?.[0])}
                    slug={product.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center space-y-6 bg-brand-bg rounded-[40px] border border-dashed border-brand-text/10">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-soft">
                  <Search size={32} className="text-brand-gold/30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-brand-text">No Matches Found</h3>
                  <p className="text-brand-text/50 text-sm max-w-sm mx-auto uppercase tracking-widest">
                    We couldn&apos;t find any masterpieces matching &quot;{query}&quot;. Try a different keyword.
                  </p>
                </div>
                <Link 
                  href="/products"
                  className="inline-block px-10 py-4 bg-brand-text text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-gold transition-all duration-300 shadow-xl"
                >
                  Explore All Collections
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Searching...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

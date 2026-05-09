'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Search, 
  LayoutGrid, 
  List,
  ArrowUpDown,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import { resolveProductImage } from '@/lib/imageResolver';

// Filter data structure
const FILTERS = [
  {
    id: 'category',
    label: 'Category',
    options: ['Gold', 'Diamond', 'Earrings', 'Rings', 'Daily Wear', 'Wedding', 'Gifting', 'Men', 'Kids']
  },
  {
    id: 'metal',
    label: 'Metal',
    options: ['Yellow Gold', 'White Gold', 'Rose Gold', 'Platinum']
  },
  {
    id: 'price',
    label: 'Price Range',
    options: [
      { label: 'Under ₹20,000', min: 0, max: 20000 },
      { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
      { label: '₹50,000 - ₹1,00,000', min: 50000, max: 100000 },
      { label: 'Over ₹1,00,000', min: 100000, max: 10000000 }
    ]
  },
  {
    id: 'stone',
    label: 'Stone',
    options: ['Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Pearl', 'Zirconia']
  }
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);

  // Fetch products based on query params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const res = await fetch(`/api/products?${query}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          setTotalCount(data.total);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Parse active filters for UI
    const filters: any[] = [];
    searchParams.forEach((value, key) => {
      if (['price_min', 'price_max', 'limit', 'sort'].includes(key)) return;
      filters.push({ key, value });
    });
    setActiveFilters(filters);
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/products?${params.toString()}`);
  };

  const setPriceFilter = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('price_min') === min.toString() && params.get('price_max') === max.toString()) {
      params.delete('price_min');
      params.delete('price_max');
    } else {
      params.set('price_min', min.toString());
      params.set('price_max', max.toString());
    }
    router.push(`/products?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    if (key === 'price') {
      params.delete('price_min');
      params.delete('price_max');
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
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
                <span className="text-brand-text/80">Products</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-text capitalize">
                {searchParams.get('category') 
                  ? searchParams.get('category')?.replace(/-/g, ' ') 
                  : searchParams.get('tag') 
                    ? `${searchParams.get('tag')} Collection`
                    : searchParams.get('collection')
                      ? `${searchParams.get('collection')?.replace(/-/g, ' ')} Collection`
                      : 'Exquisite Collection'}
              </h1>
              <p className="text-brand-text/50 text-sm max-w-lg">
                Discover our hand-curated selection of luxury jewellery, where timeless craftsmanship meets modern elegance.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[12px] font-bold text-brand-text/60 uppercase tracking-widest">
                {totalCount} Masterpieces Found
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pb-24">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center justify-center space-x-2 py-4 px-6 bg-brand-text text-white rounded-2xl w-full sticky top-24 z-30 shadow-xl"
          >
            <Filter size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Refine Collection</span>
          </button>

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-10">
            <div className="flex items-center justify-between pb-6 border-b border-brand-text/10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-text">Filters</h2>
              {activeFilters.length > 0 && (
                <button 
                  onClick={clearAllFilters}
                  className="text-[10px] font-bold text-brand-gold uppercase tracking-widest hover:text-brand-text transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-12">
              {FILTERS.map((filter) => (
                <div key={filter.id} className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-brand-text/40">
                    {filter.label}
                  </h3>
                  <div className="space-y-3">
                    {filter.options.map((option: any, idx) => {
                      const isPrice = typeof option === 'object';
                      const label = isPrice ? option.label : option;
                      const isActive = isPrice 
                        ? (searchParams.get('price_min') === option.min.toString())
                        : (searchParams.get(filter.id) === option.toLowerCase() || searchParams.get('tag') === option.toLowerCase());

                      return (
                        <button
                          key={idx}
                          onClick={() => isPrice ? setPriceFilter(option.min, option.max) : updateFilter(filter.id, option.toLowerCase())}
                          className={cn(
                            "flex items-center justify-between w-full group transition-all duration-300",
                            isActive ? "text-brand-gold font-bold" : "text-brand-text/60 hover:text-brand-text"
                          )}
                        >
                          <span className="text-[13px] tracking-wide">{label}</span>
                          <div className={cn(
                            "w-4 h-4 rounded-full border border-brand-text/10 flex items-center justify-center transition-all duration-300",
                            isActive ? "bg-brand-gold border-brand-gold" : "group-hover:border-brand-gold"
                          )}>
                            {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Promo */}
            <div className="p-8 bg-[#FAF7F5] rounded-[32px] border border-brand-text/5 relative overflow-hidden group">
              <div className="relative z-10">
                <ShoppingBag className="text-brand-gold mb-4 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="text-brand-text font-serif font-bold text-lg mb-2">Bespoke Design</h4>
                <p className="text-brand-text/50 text-[11px] leading-relaxed mb-6 uppercase tracking-widest font-medium">
                  Cannot find your perfect piece? Let us craft it for you.
                </p>
                <button className="text-[10px] font-bold text-brand-gold flex items-center group/btn uppercase tracking-widest">
                  Consult Now <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            
            {/* Active Filters Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {activeFilters.map((filter, i) => (
                <div 
                  key={i} 
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-bg rounded-full border border-brand-text/5 group animate-in fade-in zoom-in duration-300"
                >
                  <span className="text-[11px] font-bold text-brand-text/60 uppercase tracking-widest">
                    {filter.key}:
                  </span>
                  <span className="text-[11px] font-black text-brand-text uppercase tracking-widest">
                    {filter.value}
                  </span>
                  <button 
                    onClick={() => removeFilter(filter.key)}
                    className="p-1 hover:text-brand-gold transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center justify-between py-4 border-y border-brand-text/5">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-brand-text/40">
                  <LayoutGrid size={16} className="text-brand-gold" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Grid View</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-text/40">Sort By:</label>
                <select 
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('sort', e.target.value);
                    router.push(`/products?${params.toString()}`);
                  }}
                  className="text-[11px] font-bold text-brand-text uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="oldest">Classic Styles</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="space-y-4 animate-pulse">
                    <div className="aspect-square bg-brand-bg rounded-2xl" />
                    <div className="h-4 bg-brand-bg rounded w-3/4 mx-auto" />
                    <div className="h-4 bg-brand-bg rounded w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product.slug}
                    name={product.name}
                    price={`₹${(product.basePrice || product.price || 0).toLocaleString()}`}
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
                  <h3 className="text-2xl font-serif font-bold text-brand-text">No Masterpieces Found</h3>
                  <p className="text-brand-text/50 text-sm max-w-sm mx-auto uppercase tracking-widest">
                    We couldn't find any products matching your specific refinement. Try adjusting your filters.
                  </p>
                </div>
                <button 
                  onClick={clearAllFilters}
                  className="px-10 py-4 bg-brand-text text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-brand-gold transition-all duration-300 shadow-xl"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-brand-text/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 border-b border-brand-text/5 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Refine By</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {FILTERS.map((filter) => (
                <div key={filter.id} className="space-y-6">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-brand-text/40">
                    {filter.label}
                  </h3>
                  <div className="space-y-4">
                    {filter.options.map((option: any, idx) => {
                      const isPrice = typeof option === 'object';
                      const label = isPrice ? option.label : option;
                      const isActive = isPrice 
                        ? (searchParams.get('price_min') === option.min.toString())
                        : (searchParams.get(filter.id) === option.toLowerCase() || searchParams.get('tag') === option.toLowerCase());

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (isPrice) setPriceFilter(option.min, option.max);
                            else updateFilter(filter.id, option.toLowerCase());
                            setIsFilterOpen(false);
                          }}
                          className={cn(
                            "flex items-center justify-between w-full group transition-all duration-300",
                            isActive ? "text-brand-gold font-bold" : "text-brand-text/60"
                          )}
                        >
                          <span className="text-[13px]">{label}</span>
                          <div className={cn(
                            "w-5 h-5 rounded-full border border-brand-text/10 flex items-center justify-center",
                            isActive ? "bg-brand-gold border-brand-gold" : ""
                          )}>
                            {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-brand-text/5">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-5 bg-brand-text text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-xl"
              >
                Show {totalCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

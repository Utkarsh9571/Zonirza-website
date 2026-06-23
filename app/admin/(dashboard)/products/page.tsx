'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  X,
  ChevronDown,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveProductImage } from '@/lib/imageResolver';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type AdminProduct = { _id: string; name: string; slug: string; images?: string[]; category?: string; specs?: { metal?: string }; basePrice?: number; price?: number; stockStatus?: string; isActive?: boolean };

function AdminProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL States
  const page = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const metal = searchParams.get('metal') || '';
  const stockStatus = searchParams.get('stockStatus') || '';
  const isActive = searchParams.get('isActive') || '';
  const tags = searchParams.get('tags') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const limit = 10;
  
  const currentQueryString = searchParams.toString();
  const createProductHref = currentQueryString ? `/admin/products/new?returnTo=${encodeURIComponent(currentQueryString)}` : '/admin/products/new';

  // Helper to update URL params
  const updateQueryParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset page on filter change unless explicitly setting page
    if (!updates.page && updates.page !== null) {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        q: searchTerm,
        category,
        metal,
        stockStatus,
        isActive,
        tags,
        sort
      });
      const res = await fetch(`/api/admin/products?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalProducts(data.total);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, category, metal, stockStatus, isActive, tags, sort]);

  const handleSearch = (val: string) => {
    updateQueryParams({ q: val });
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this masterpiece? This action will archive it.')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const categories = [
    'Rings', 
    'Earrings', 
    'Necklaces', 
    'Bracelets', 
    'Bangles', 
    'Pendants',
    'Nose Pins',
    'Religious',
    'Zodiac',
    'Initial',
    'Love & Heart',
    'Cluster Studs'
  ];
  const metals = ['Yellow Gold', 'Rose Gold', 'White Gold', 'Platinum', 'Silver'];
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Alphabetical', value: 'alphabetical' },
    { label: 'Recently Updated', value: 'updated' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Catalog Management</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Products <span className="not-italic text-brand-text/20 dark:text-white/20">({totalProducts})</span>
          </h1>
        </div>
        <Link 
          href={createProductHref}
          className="flex items-center space-x-3 px-8 py-4 bg-brand-gold hover:bg-[#B4925A] text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-500 shadow-premium active:scale-95"
        >
          <Plus size={18} />
          <span>New Masterpiece</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-white/10 p-4 md:p-6 rounded-4xl border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, slug, or category..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[13px] focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder:text-brand-text/30 dark:placeholder:text-white/20"
            />
            {searchTerm && (
              <button 
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text/30 hover:text-brand-gold"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <button 
                onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 rounded-2xl border transition-all text-[12px] font-bold uppercase tracking-widest w-full md:w-auto justify-center",
                  showFilters || category || metal || stockStatus || isActive || tags
                    ? "bg-brand-gold text-brand-bg border-brand-gold" 
                    : "bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 border-transparent hover:border-brand-gold/20"
                )}
              >
                <Filter size={16} />
                <span>Filters</span>
                {(category || metal || stockStatus || isActive || tags) && (
                  <span className="ml-1 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
              
              {showFilters && (
                <div className="absolute top-full mt-4 right-0 w-72 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-brand-text/10 dark:border-white/10 p-6 z-50 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Refine Catalog</h4>
                    <button 
                      onClick={() => updateQueryParams({ category: '', metal: '', stockStatus: '', isActive: '', tags: '' })}
                      className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 hover:text-brand-gold"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => updateQueryParams({ category: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Metal</label>
                      <select 
                        value={metal}
                        onChange={(e) => updateQueryParams({ metal: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="">All Metals</option>
                        {metals.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Tags (Comma separated)</label>
                      <input 
                        type="text"
                        value={tags}
                        onChange={(e) => updateQueryParams({ tags: e.target.value })}
                        placeholder="diamond, gold..."
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50 placeholder:text-brand-text/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Stock</label>
                        <select 
                          value={stockStatus}
                          onChange={(e) => updateQueryParams({ stockStatus: e.target.value })}
                          className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50"
                        >
                          <option value="">All</option>
                          <option value="in-stock">Available</option>
                          <option value="out-of-stock">Sold Out</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Visibility</label>
                        <select 
                          value={isActive}
                          onChange={(e) => updateQueryParams({ isActive: e.target.value })}
                          className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50"
                        >
                          <option value="">All</option>
                          <option value="true">Live</option>
                          <option value="false">Hidden</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex-1 md:flex-none">
              <button 
                onClick={() => { setShowSort(!showSort); setShowFilters(false); }}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 rounded-2xl border transition-all text-[12px] font-bold uppercase tracking-widest w-full md:w-auto justify-center",
                  showSort || sort !== 'newest'
                    ? "bg-brand-text text-white border-brand-text dark:bg-white dark:text-brand-bg" 
                    : "bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 border-transparent hover:border-brand-gold/20"
                )}
              >
                <span>Sort</span>
                <ChevronDown size={16} className={cn("transition-transform", showSort && "rotate-180")} />
              </button>

              {showSort && (
                <div className="absolute top-full mt-4 right-0 w-56 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-brand-text/10 dark:border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateQueryParams({ sort: option.value });
                          setShowSort(false);
                        }}
                        className="w-full px-6 py-3 text-left flex items-center justify-between hover:bg-brand-bg dark:hover:bg-white/5 transition-colors group"
                      >
                        <span className={cn(
                          "text-[11px] font-bold uppercase tracking-widest",
                          sort === option.value ? "text-brand-gold" : "text-brand-text/60 dark:text-white/60 group-hover:text-brand-text dark:group-hover:text-white"
                        )}>
                          {option.label}
                        </span>
                        {sort === option.value && <Check size={14} className="text-brand-gold" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(category || metal || stockStatus || isActive || tags || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 mr-2">Active:</span>
            {searchTerm && (
              <button 
                onClick={() => handleSearch('')}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>&ldquo;{searchTerm}&rdquo;</span>
                <X size={12} />
              </button>
            )}
            {category && (
              <button 
                onClick={() => updateQueryParams({ category: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>{category}</span>
                <X size={12} />
              </button>
            )}
            {metal && (
              <button 
                onClick={() => updateQueryParams({ metal: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>{metal}</span>
                <X size={12} />
              </button>
            )}
            {tags && (
              <button 
                onClick={() => updateQueryParams({ tags: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>Tags: {tags}</span>
                <X size={12} />
              </button>
            )}
            {stockStatus && (
              <button 
                onClick={() => updateQueryParams({ stockStatus: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>{stockStatus === 'in-stock' ? 'Available' : 'Sold Out'}</span>
                <X size={12} />
              </button>
            )}
            {isActive && (
              <button 
                onClick={() => updateQueryParams({ isActive: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>{isActive === 'true' ? 'Live' : 'Hidden'}</span>
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Grid/Table */}
      <div className="bg-white dark:bg-white/5 rounded-[40px] border border-brand-text/5 dark:border-white/5 overflow-hidden shadow-premium">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-brand-gold animate-spin" size={40} />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Acquiring Catalog...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-brand-bg/50 dark:bg-white/2">
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Masterpiece</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Category</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Price (Base)</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Stock Status</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Visibility</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {products.map((product) => (
                  <tr key={product._id} className="group hover:bg-brand-bg/30 dark:hover:bg-white/2 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-bg dark:bg-white/5 overflow-hidden border border-brand-text/5 dark:border-white/10 p-2 group-hover:border-brand-gold/30 transition-colors">
                          <img 
                            src={resolveProductImage(product.images?.[0])} 
                            alt={product.name}
                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text dark:text-white group-hover:text-brand-gold transition-colors">{product.name}</span>
                          <span className="text-[10px] text-brand-text/30 uppercase tracking-widest font-medium mt-1">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-brand-text/60 dark:text-white/60 uppercase tracking-widest">{product.category}</span>
                        <span className="text-[9px] text-brand-text/30 uppercase tracking-widest font-medium mt-1">{product.specs?.metal}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[14px] font-black text-brand-gold">₹{(product.basePrice || product.price || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          product.stockStatus === 'in-stock' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500"
                        )} />
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          product.stockStatus === 'in-stock' ? "text-emerald-500" : "text-red-500"
                        )}>
                          {product.stockStatus === 'in-stock' ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => handleToggleStatus(product._id, product.isActive !== false)}
                          className={cn(
                            "w-8 h-4 rounded-full relative transition-colors duration-500",
                            product.isActive !== false ? "bg-brand-gold" : "bg-brand-text/10"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-2 h-2 bg-white rounded-full transition-all duration-500",
                            product.isActive !== false ? "left-5" : "left-1"
                          )} />
                        </button>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text/70">
                          {product.isActive !== false ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-2 text-brand-text/30 hover:text-brand-gold transition-colors"
                          title="View on Store"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <Link 
                          href={currentQueryString ? `/admin/products/${product._id}?returnTo=${encodeURIComponent(currentQueryString)}` : `/admin/products/${product._id}`}
                          className="p-2 text-brand-text/30 hover:text-brand-gold transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-brand-text/30 hover:text-red-500 transition-colors"
                          title="Archive Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <div className="w-20 h-20 bg-brand-bg dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-text/20">
              <Package size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white italic">No Masterpieces Found</h3>
              <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium max-w-xs mx-auto">
                Your filters did not match any items in our exclusive catalog.
              </p>
            </div>
            <button 
              onClick={() => updateQueryParams({ category: '', metal: '', stockStatus: '', isActive: '', q: '' })}
              className="px-10 py-4 bg-brand-text dark:bg-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-gold transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalProducts > limit && (
          <div className="p-8 border-t border-brand-text/5 dark:border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium">
              Showing <span className="text-brand-text dark:text-white font-black">{((page - 1) * limit) + 1}</span> to <span className="text-brand-text dark:text-white font-black">{Math.min(page * limit, totalProducts)}</span> of <span className="text-brand-text dark:text-white font-black">{totalProducts}</span> masterpieces
            </p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => updateQueryParams({ page: Math.max(1, page - 1).toString() })}
                disabled={page === 1}
                className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[11px] font-black uppercase tracking-widest text-brand-gold">Page {page}</span>
              <button 
                onClick={() => updateQueryParams({ page: (page + 1).toString() })}
                disabled={page * limit >= totalProducts}
                className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats/Alerts */}
      <div className="flex items-center space-x-3 p-6 bg-brand-gold/5 border border-brand-gold/20 rounded-4xl">
        <AlertCircle className="text-brand-gold" size={20} />
        <p className="text-[11px] text-brand-gold uppercase tracking-widest font-black">
          Critical Note: Changes to base pricing or active variants will reflect instantly across all regional storefronts.
        </p>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Page...</p>
      </div>
    }>
      <AdminProductsPageContent />
    </Suspense>
  );
}

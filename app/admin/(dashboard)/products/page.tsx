'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveProductImage } from '@/lib/imageResolver';
import { useSearchParams } from 'next/navigation';

function AdminProductsPageContent() {
  const searchParams = useSearchParams();
  const filterType = searchParams.get('filter') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, filterType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${page}&limit=${limit}&q=${encodeURIComponent(searchTerm)}&filter=${filterType}`);
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
          href="/admin/products/new"
          className="flex items-center space-x-3 px-8 py-4 bg-brand-gold hover:bg-[#B4925A] text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-500 shadow-premium active:scale-95"
        >
          <Plus size={18} />
          <span>New Masterpiece</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-white/10 p-6 rounded-[32px] border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, slug, or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[13px] focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder:text-brand-text/30 dark:placeholder:text-white/20"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center space-x-2 px-6 py-3 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all text-[12px] font-bold uppercase tracking-widest flex-1 md:flex-none justify-center">
            <Filter size={16} />
            <span>Filters</span>
          </button>
          <button className="px-6 py-3 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all text-[12px] font-bold uppercase tracking-widest flex-1 md:flex-none justify-center">
            Sort
          </button>
        </div>
      </div>

      {/* Product Grid/Table */}
      <div className="bg-white dark:bg-white/5 rounded-[40px] border border-brand-text/5 dark:border-white/5 overflow-hidden">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-brand-gold animate-spin" size={40} />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Acquiring Catalog...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-brand-bg/50 dark:bg-white/2">
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Masterpiece</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Category</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Price (Base)</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Stock Status</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Visibility</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {products.map((product) => (
                  <tr key={product._id} className="group hover:bg-brand-bg/30 dark:hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-xl bg-brand-bg dark:bg-white/5 overflow-hidden border border-brand-text/5 dark:border-white/10 p-2">
                          <img 
                            src={resolveProductImage(product.images?.[0])} 
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text dark:text-white group-hover:text-brand-gold transition-colors">{product.name}</span>
                          <span className="text-[10px] text-brand-text/30 uppercase tracking-widest font-medium mt-1">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-bold text-brand-text/60 dark:text-white/60 uppercase tracking-widest">{product.category}</span>
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
                          href={`/admin/products/${product._id}`}
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
                Your search did not match any items in our exclusive catalog.
              </p>
            </div>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-10 py-4 bg-brand-text dark:bg-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-gold transition-all"
            >
              Clear Search
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
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[11px] font-black uppercase tracking-widest text-brand-gold">Page {page}</span>
              <button 
                onClick={() => setPage(p => p + 1)}
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
      <div className="flex items-center space-x-3 p-6 bg-brand-gold/5 border border-brand-gold/20 rounded-[32px]">
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

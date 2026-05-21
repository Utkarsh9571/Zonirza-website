"use client";
import { useState, useEffect, useCallback, Suspense } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Loader2,
  Percent,
  CircleDollarSign,
  TrendingUp,
  Activity,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function AdminCouponsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL States
  const searchTerm = searchParams.get('q') || '';
  const isActiveFilter = searchParams.get('isActive') || '';

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minCartValue: 0,
    expirationDate: '',
    usageLimit: 100,
    isActive: true
  });

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
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  useEffect(() => {
    fetchCoupons();
  }, [searchTerm, isActiveFilter]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchTerm,
        isActive: isActiveFilter
      });
      const res = await fetch(`/api/admin/coupons?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) setCoupons(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCoupon ? 'PATCH' : 'POST';
    const body = editingCoupon ? { ...formData, id: editingCoupon._id } : formData;

    try {
      const res = await fetch('/api/admin/coupons', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
        setIsModalOpen(false);
        setEditingCoupon(null);
        setFormData({
          code: '',
          discountType: 'percentage',
          discountValue: 0,
          minCartValue: 0,
          expirationDate: '',
          usageLimit: 100,
          isActive: true
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Exterminate this campaign? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const activeCouponsCount = coupons.filter(c => c.isActive).length;
  const totalUsage = coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Campaign Command</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Strategic <span className="not-italic text-brand-text/20 dark:text-white/20">Coupons</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-brand-text/5 flex items-center space-x-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <Activity className="text-brand-gold" size={18} />
              <div>
                <p className="text-[14px] font-black text-brand-text dark:text-white">{activeCouponsCount}</p>
                <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Active</p>
              </div>
            </div>
            <div className="w-px h-8 bg-brand-text/10" />
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-emerald-500" size={18} />
              <div>
                <p className="text-[14px] font-black text-brand-text dark:text-white">{totalUsage}</p>
                <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Conversions</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              setEditingCoupon(null);
              setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: 0,
                minCartValue: 0,
                expirationDate: '',
                usageLimit: 100,
                isActive: true
              });
              setIsModalOpen(true);
            }}
            className="h-[74px] px-8 bg-brand-gold text-[#12100e] rounded-[30px] font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
          >
            <Plus size={20} />
            <span>New Code</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-white/10 p-4 md:p-6 rounded-[32px] border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Coupon Code..." 
            value={searchTerm}
            onChange={(e) => updateQueryParams({ q: e.target.value })}
            className="w-full bg-slate-100 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[13px] focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder:text-brand-text/30 dark:placeholder:text-white/20"
          />
          {searchTerm && (
            <button 
              onClick={() => updateQueryParams({ q: '' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text/30 hover:text-brand-gold"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={isActiveFilter}
            onChange={(e) => updateQueryParams({ isActive: e.target.value })}
            className="bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all text-[12px] font-bold uppercase tracking-widest px-6 py-3 focus:ring-1 focus:ring-brand-gold/50 outline-none"
          >
            <option value="">All Campaigns</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-brand-gold animate-spin" size={40} />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Encrypting Vouchers...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-white dark:bg-white/5 rounded-[48px] border border-dashed border-brand-text/20">
            <Ticket className="mx-auto text-brand-text/10 mb-4" size={48} />
            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">No campaigns matching your criteria.</p>
            {(searchTerm || isActiveFilter) && (
              <button 
                onClick={() => updateQueryParams({ q: '', isActive: '' })}
                className="mt-4 text-[11px] font-bold text-brand-gold uppercase tracking-widest hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : coupons.map((coupon) => (
          <div key={coupon._id} className="group bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-premium flex flex-col hover:border-brand-gold/30 transition-all duration-500">
            <div className={cn(
              "p-8 relative overflow-hidden",
              coupon.isActive ? "bg-brand-gold/5" : "bg-slate-50 dark:bg-white/2 opacity-60"
            )}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white dark:bg-[#1A1A1A] rounded-full border border-brand-gold/20">
                    <Ticket className="text-brand-gold" size={14} />
                    <span className="text-[12px] font-black tracking-widest">{coupon.code}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} <span className="not-italic text-brand-text/20">Off</span>
                  </h3>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  <div className={cn(
                    "p-2 rounded-xl border transition-all duration-500",
                    coupon.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  )}>
                    {coupon.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-black text-brand-text dark:text-white">{coupon.usedCount || 0}</p>
                    <p className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">Used</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-brand-text/40">Minimum Cart</span>
                  <span className="text-brand-text dark:text-white">₹{coupon.minCartValue || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-brand-text/40">Expires</span>
                  <span className="text-brand-text dark:text-white">
                    {new Date(coupon.expirationDate).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-brand-text/40">Limit</span>
                  <span className="text-brand-text dark:text-white">{coupon.usedCount || 0} / {coupon.usageLimit}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button 
                  onClick={() => {
                    setEditingCoupon(coupon);
                    setFormData({
                      code: coupon.code,
                      discountType: coupon.discountType,
                      discountValue: coupon.discountValue,
                      minCartValue: coupon.minCartValue,
                      expirationDate: new Date(coupon.expirationDate).toISOString().split('T')[0],
                      usageLimit: coupon.usageLimit,
                      isActive: coupon.isActive
                    });
                    setIsModalOpen(true);
                  }}
                  className="flex-1 py-3 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all border border-transparent hover:border-brand-gold"
                >
                  Edit Campaign
                </button>
                <button 
                  onClick={() => handleDelete(coupon._id)}
                  className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-transparent hover:border-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - kept original for brevity but added basic responsive tweaks */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" 
            onClick={() => setIsModalOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1614] rounded-[40px] shadow-2xl overflow-hidden p-10 border border-brand-text/10 dark:border-white/10">
            <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic mb-8">
              {editingCoupon ? 'Edit' : 'Create'} <span className="not-italic text-brand-text/20">Campaign</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Coupon Code</label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  placeholder="SUMMER2026"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Type</label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Value</label>
                  <input 
                    type="number" 
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: Number(e.target.value)})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Min. Cart</label>
                  <input 
                    type="number" 
                    value={formData.minCartValue}
                    onChange={(e) => setFormData({...formData, minCartValue: Number(e.target.value)})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Usage Limit</label>
                  <input 
                    type="number" 
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: Number(e.target.value)})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Expiration Date</label>
                <input 
                  type="date" 
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                  className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-brand-bg dark:bg-white/5 text-brand-text/40 dark:text-white/40 rounded-2xl text-[12px] font-bold uppercase tracking-widest hover:bg-brand-text hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-4 bg-brand-gold text-[#12100e] rounded-2xl text-[12px] font-bold uppercase tracking-widest shadow-premium hover:bg-[#B4925A] transition-all"
                >
                  {editingCoupon ? 'Update Campaign' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCouponsPage() {
  return (
    <Suspense fallback={
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Campaigns...</p>
      </div>
    }>
      <AdminCouponsPageContent />
    </Suspense>
  );
}

'use client';

import { useState, useEffect } from 'react';
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
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminCouponsPage() {
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

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
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

  const activeCoupons = coupons.filter(c => c.isActive);
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
                <p className="text-[14px] font-black text-brand-text dark:text-white">{activeCoupons.length}</p>
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
              setIsModalOpen(true);
            }}
            className="h-[74px] px-8 bg-brand-gold text-[#12100e] rounded-[30px] font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
          >
            <Plus size={20} />
            <span>New Code</span>
          </button>
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
            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">No active campaigns in orbit.</p>
          </div>
        ) : coupons.map((coupon) => (
          <div key={coupon._id} className="group bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-md flex flex-col">
            <div className={cn(
              "p-8 relative overflow-hidden",
              coupon.isActive ? "bg-brand-gold/5" : "bg-slate-50 opacity-60"
            )}>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl" />
              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white rounded-full border border-brand-gold/20">
                    <Ticket className="text-brand-gold" size={14} />
                    <span className="text-[12px] font-black tracking-widest">{coupon.code}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} <span className="not-italic text-brand-text/20">Off</span>
                  </h3>
                </div>
                <div className="flex flex-col items-end space-y-4">
                  <div className={cn(
                    "p-2 rounded-xl border",
                    coupon.isActive ? "bg-emerald-50 text-emerald-500 border-emerald-500/20" : "bg-red-50 text-red-500 border-red-500/20"
                  )}>
                    {coupon.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-black text-brand-text">{coupon.usedCount}</p>
                    <p className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">Used</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-brand-text/40">Minimum Cart</span>
                  <span className="text-brand-text">₹{coupon.minCartValue || 0}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-brand-text/40">Expires</span>
                  <span className="text-brand-text">
                    {new Date(coupon.expirationDate).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-bold">
                  <span className="text-brand-text/40">Limit</span>
                  <span className="text-brand-text">{coupon.usageLimit} total</span>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-text/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
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
                    className="p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl text-brand-text/40 hover:text-brand-gold transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon._id)}
                    className="p-3 hover:bg-red-50 rounded-2xl text-brand-text/40 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <ChevronRight className="text-brand-gold/40" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1a1614] rounded-[48px] shadow-2xl p-10 border border-brand-text/15">
            <h2 className="text-3xl font-serif font-bold text-brand-text italic mb-8">
              {editingCoupon ? 'Refine' : 'Initialize'} <span className="not-italic text-brand-text/20">Coupon</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Promo Code</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g. FESTIVE20"
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-black tracking-widest uppercase"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Type</label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value as any})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Value</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                      className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text/30">
                      {formData.discountType === 'percentage' ? <Percent size={16} /> : <CircleDollarSign size={16} />}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Min Cart (₹)</label>
                  <input 
                    type="number" 
                    value={formData.minCartValue}
                    onChange={(e) => setFormData({...formData, minCartValue: parseFloat(e.target.value)})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Usage Limit</label>
                  <input 
                    type="number" 
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Expiration Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={18} />
                    <input 
                      type="date" 
                      value={formData.expirationDate}
                      onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                      className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[14px] font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-brand-text/5 mt-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="text-brand-gold" size={20} />
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-brand-text">Active Status</p>
                      <p className="text-[9px] text-brand-text/40 uppercase tracking-widest font-bold">Toggle visibility</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={cn(
                      "w-12 h-7 rounded-full relative transition-colors duration-500",
                      formData.isActive ? "bg-emerald-500" : "bg-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-500 shadow-sm",
                      formData.isActive ? "left-6" : "left-1"
                    )} />
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-gold text-[#12100e] py-5 rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium mt-6 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {editingCoupon ? 'Finalize Changes' : 'Broadcast Campaign'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

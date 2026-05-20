'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
  Eye,
  ChevronDown,
  Check,
  X,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function AdminOrdersPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL States
  const page = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const limit = 10;

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

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
    if (!updates.page && updates.page !== null) {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        q: searchTerm,
        status,
        paymentStatus,
        sort
      });
      const res = await fetch(`/api/admin/orders?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setTotalOrders(data.total);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm, status, paymentStatus, sort]);

  const handleUpdateStatus = async (id: string, updates: any) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder?._id === id) {
          setSelectedOrder(data.data);
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'shipped': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'cancelled': return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'processing': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'placed': return "bg-brand-gold/10 text-brand-gold border-brand-gold/20";
      default: return "bg-brand-text/10 text-brand-text/40 border-brand-text/5";
    }
  };

  const statusOptions = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded'];
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Amount: High to Low', value: 'amount-high' },
    { label: 'Amount: Low to High', value: 'amount-low' },
    { label: 'Recently Updated', value: 'updated' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Operations Hub</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Orders <span className="not-italic text-brand-text/20 dark:text-white/20">({totalOrders})</span>
          </h1>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="space-y-4">
        <div className="bg-white dark:bg-white/10 p-4 md:p-6 rounded-[32px] border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer Name, or Phone..." 
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
            <div className="relative flex-1 md:flex-none">
              <button 
                onClick={() => { setShowFilters(!showFilters); setShowSort(false); }}
                className={cn(
                  "flex items-center space-x-2 px-6 py-3 rounded-2xl border transition-all text-[12px] font-bold uppercase tracking-widest w-full md:w-auto justify-center",
                  showFilters || status || paymentStatus
                    ? "bg-brand-gold text-brand-bg border-brand-gold" 
                    : "bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 border-transparent hover:border-brand-gold/20"
                )}
              >
                <Filter size={16} />
                <span>Filters</span>
                {(status || paymentStatus) && (
                  <span className="ml-1 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
              
              {showFilters && (
                <div className="absolute top-full mt-4 right-0 w-72 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-brand-text/10 dark:border-white/10 p-6 z-50 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Filter Orders</h4>
                    <button 
                      onClick={() => updateQueryParams({ status: '', paymentStatus: '' })}
                      className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 hover:text-brand-gold"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Order Status</label>
                      <select 
                        value={status}
                        onChange={(e) => updateQueryParams({ status: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="">All Statuses</option>
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Payment Status</label>
                      <select 
                        value={paymentStatus}
                        onChange={(e) => updateQueryParams({ paymentStatus: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="">All Payments</option>
                        {paymentStatusOptions.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                      </select>
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
        {(status || paymentStatus || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 mr-2">Active:</span>
            {searchTerm && (
              <button 
                onClick={() => updateQueryParams({ q: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>"{searchTerm}"</span>
                <X size={12} />
              </button>
            )}
            {status && (
              <button 
                onClick={() => updateQueryParams({ status: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>{status}</span>
                <X size={12} />
              </button>
            )}
            {paymentStatus && (
              <button 
                onClick={() => updateQueryParams({ paymentStatus: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>{paymentStatus}</span>
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-premium">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-brand-gold animate-spin" size={40} />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Gathering Ledger...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-brand-bg/50 dark:bg-white/2">
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Order Info</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Customer</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Status</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Payment</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Amount</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-brand-bg/30 dark:hover:bg-white/2 transition-all duration-300">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-brand-text dark:text-white">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-[10px] text-brand-text/30 uppercase tracking-widest font-medium mt-1 flex items-center space-x-2">
                          <Calendar size={12} />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-brand-text/60 dark:text-white/60">{order.shippingAddress?.fullName}</span>
                        <span className="text-[10px] text-brand-text/30 uppercase tracking-widest font-medium mt-1">{order.shippingAddress?.phone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "flex items-center space-x-2 px-3 py-1.5 rounded-full border w-fit transition-all duration-500",
                        getStatusColor(order.orderStatus)
                      )}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="text-[10px] font-black uppercase tracking-widest">{order.orderStatus}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          order.paymentStatus === 'paid' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"
                        )} />
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          order.paymentStatus === 'paid' ? "text-emerald-500" : "text-amber-500"
                        )}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[14px] font-black text-brand-gold">{order.currency} {order.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/40 hover:text-brand-gold rounded-xl transition-all group/btn"
                      >
                        <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <div className="w-20 h-20 bg-brand-bg dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-text/20">
              <ShoppingBag size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white italic">No Orders Found</h3>
              <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium max-w-xs mx-auto">
                No purchases have been recorded in the current filter context.
              </p>
            </div>
            <button 
              onClick={() => updateQueryParams({ status: '', paymentStatus: '', q: '' })}
              className="px-10 py-4 bg-brand-text dark:bg-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-gold transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalOrders > limit && (
          <div className="p-8 border-t border-brand-text/5 dark:border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium">
              Showing <span className="text-brand-text dark:text-white font-black">{((page - 1) * limit) + 1}</span> to <span className="text-brand-text dark:text-white font-black">{Math.min(page * limit, totalOrders)}</span> of <span className="text-brand-text dark:text-white font-black">{totalOrders}</span> orders
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
                disabled={page * limit >= totalOrders}
                className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md animate-in fade-in duration-500" 
            onClick={() => setSelectedOrder(null)} 
          />
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1614] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-700 max-h-[90vh] flex flex-col border border-brand-text/20 dark:border-white/10">
            {/* Modal Header */}
            <div className="p-8 border-b border-brand-text/5 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#1a1614]/80 backdrop-blur-md z-10">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic">
                  Order <span className="not-italic text-brand-text/20 dark:text-white/20">#{selectedOrder._id.slice(-8).toUpperCase()}</span>
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] text-brand-text/40 uppercase tracking-widest font-black">Placed {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-12 h-12 rounded-full bg-brand-bg dark:bg-white/5 flex items-center justify-center text-brand-text/40 hover:text-brand-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Customer & Shipping */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Shipping Destination</h4>
                    <div className="bg-brand-bg dark:bg-white/2 p-6 rounded-3xl border border-brand-text/5 dark:border-white/5 space-y-2">
                      <p className="text-[15px] font-bold text-brand-text dark:text-white">{selectedOrder.shippingAddress?.fullName}</p>
                      <p className="text-[13px] text-brand-text/60 dark:text-white/60 leading-relaxed">
                        {selectedOrder.shippingAddress?.addressLine}<br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                        {selectedOrder.shippingAddress?.country} - {selectedOrder.shippingAddress?.pincode}
                      </p>
                      <div className="pt-2 flex items-center space-x-2 text-brand-gold font-bold text-[13px]">
                        <AlertCircle size={14} />
                        <span>{selectedOrder.shippingAddress?.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Lifecycle Management</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-widest font-black text-brand-text/30">Order Status</label>
                        <select 
                          value={selectedOrder.orderStatus}
                          disabled={updating}
                          onChange={(e) => handleUpdateStatus(selectedOrder._id, { orderStatus: e.target.value })}
                          className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/5 rounded-xl py-3 px-4 text-[12px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-widest font-black text-brand-text/30">Payment Status</label>
                        <select 
                          value={selectedOrder.paymentStatus}
                          disabled={updating}
                          onChange={(e) => handleUpdateStatus(selectedOrder._id, { paymentStatus: e.target.value })}
                          className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/5 rounded-xl py-3 px-4 text-[12px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                        >
                          {paymentStatusOptions.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Financial Summary</h4>
                    <div className="bg-brand-bg dark:bg-white/2 p-8 rounded-3xl border border-brand-text/5 dark:border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-brand-text/40 font-bold uppercase tracking-widest">Currency</span>
                        <span className="font-black text-brand-text dark:text-white">{selectedOrder.currency}</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-brand-text/40 font-bold uppercase tracking-widest">Tax (GST)</span>
                        <span className="font-black text-brand-text dark:text-white">Included</span>
                      </div>
                      <div className="h-px bg-brand-text/5 dark:bg-white/5" />
                      <div className="flex justify-between items-end pt-2">
                        <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.2em]">Grand Total</span>
                        <span className="text-2xl font-black text-brand-gold">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Payment Intelligence</h4>
                    <div className="bg-brand-bg dark:bg-white/2 p-6 rounded-3xl border border-brand-text/5 dark:border-white/5 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-brand-gold border border-brand-text/5">
                          <CreditCard size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black uppercase tracking-widest text-brand-text dark:text-white">Razorpay ID</span>
                          <span className="text-[10px] text-brand-text/40 font-medium">{selectedOrder.razorpayOrderId || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Manifest ({selectedOrder.items?.length})</h4>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center space-x-6 p-4 bg-brand-bg/50 dark:bg-white/2 rounded-2xl border border-brand-text/5 dark:border-white/5 group hover:border-brand-gold/20 transition-all">
                      <div className="w-20 h-20 rounded-xl bg-white dark:bg-white/5 overflow-hidden p-2 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[14px] font-bold text-brand-text dark:text-white truncate">{item.name}</h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-brand-text/5 dark:bg-white/5 text-[9px] font-bold uppercase tracking-widest text-brand-text/40 rounded-md border border-brand-text/5">
                            {item.configuration?.metal} {item.configuration?.purity}
                          </span>
                          {item.configuration?.size && (
                            <span className="px-2 py-0.5 bg-brand-text/5 dark:bg-white/5 text-[9px] font-bold uppercase tracking-widest text-brand-text/40 rounded-md border border-brand-text/5">
                              Size: {item.configuration?.size}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[11px] text-brand-text/40 font-bold uppercase tracking-widest mb-1">{item.quantity} × ₹{item.price.toLocaleString()}</div>
                        <div className="text-[15px] font-black text-brand-gold">₹{(item.quantity * item.price).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Ledger...</p>
      </div>
    }>
      <AdminOrdersPageContent />
    </Suspense>
  );
}

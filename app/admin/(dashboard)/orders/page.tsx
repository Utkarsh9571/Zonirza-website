'use client';

import { useState, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=${limit}&q=${encodeURIComponent(searchTerm)}`);
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
      default: return "bg-brand-text/10 text-brand-text/40 border-brand-text/5";
    }
  };

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
      <div className="bg-white dark:bg-white/10 p-6 rounded-[32px] border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer Name, or Phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[13px] focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder:text-brand-text/30 dark:placeholder:text-white/20"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center space-x-2 px-6 py-3 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all text-[12px] font-bold uppercase tracking-widest flex-1 md:flex-none justify-center">
            <Filter size={16} />
            <span>Refine</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-md">
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
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Order Info</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Customer</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Status</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Payment</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Amount</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-brand-bg/30 dark:hover:bg-white/2 transition-colors">
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
                        "flex items-center space-x-2 px-3 py-1.5 rounded-full border w-fit",
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
          </div>
        )}

        {/* Pagination */}
        {totalOrders > limit && (
          <div className="p-8 border-t border-brand-text/5 dark:border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium">
              Page <span className="text-brand-text dark:text-white font-black">{page}</span> of <span className="text-brand-text dark:text-white font-black">{Math.ceil(totalOrders / limit)}</span>
            </p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
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
                <XCircle size={24} />
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
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Update Lifecycle</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-widest font-black text-brand-text/30">Order Status</label>
                        <select 
                          value={selectedOrder.orderStatus}
                          disabled={updating}
                          onChange={(e) => handleUpdateStatus(selectedOrder._id, { orderStatus: e.target.value })}
                          className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/5 rounded-xl py-3 px-4 text-[12px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
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
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Acquired Masterpieces</h4>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center space-x-4 p-4 bg-brand-bg dark:bg-white/2 rounded-2xl border border-brand-text/5 dark:border-white/5">
                        <div className="w-16 h-16 rounded-xl bg-white dark:bg-black/20 overflow-hidden p-2 flex-shrink-0">
                          <img src={item.image} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-brand-text dark:text-white truncate">{item.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-[9px] uppercase tracking-widest bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-md font-bold">
                              {item.configuration?.metal}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest bg-brand-text/5 text-brand-text/40 px-2 py-0.5 rounded-md font-bold">
                              {item.configuration?.purity}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[13px] font-black text-brand-gold">₹{item.price.toLocaleString()}</p>
                          <p className="text-[10px] text-brand-text/30 font-bold mt-1">QTY: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-brand-text/5 dark:border-white/5 space-y-3">
                    <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-brand-text/40">
                      <span>Subtotal</span>
                      <span>{selectedOrder.currency} {selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] uppercase tracking-widest font-bold text-brand-text/40">
                      <span>Shipping</span>
                      <span className="text-emerald-500">Free</span>
                    </div>
                    <div className="flex justify-between pt-4 text-lg font-serif font-bold italic text-brand-gold border-t border-brand-text/5 border-dashed">
                      <span className="not-italic">Total Amount</span>
                      <span>{selectedOrder.currency} {selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-8 border-t border-brand-text/5 dark:border-white/5 bg-brand-bg/50 dark:bg-white/2 flex justify-end items-center space-x-4">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-10 py-4 bg-brand-text dark:bg-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-gold transition-all"
              >
                Close Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats/Alerts */}
    </div>
  );
}

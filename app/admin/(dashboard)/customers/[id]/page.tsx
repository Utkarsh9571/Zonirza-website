'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  Star, 
  Heart,
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Ban,
  MoreVertical,
  Activity,
  Package,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminCustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`);
      const data = await res.json();
      if (data.success) setCustomer(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, isActive: status === 'active' }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomer({ ...customer, status, isActive: status === 'active' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Decrypting Profile...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="py-40 text-center space-y-4">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <p className="text-[14px] font-bold text-brand-text">Patron Not Found</p>
        <Link href="/admin/customers" className="text-brand-gold text-[12px] uppercase tracking-widest font-black">Return to Ledger</Link>
      </div>
    );
  }

  const totalSpent = customer.orders?.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0) || 0;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link href="/admin/customers" className="flex items-center space-x-2 text-brand-gold hover:translate-x-[-4px] transition-transform">
            <ChevronLeft size={16} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-black">Patron Ledger</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
              {customer.name || 'Anonymous Patron'}
            </h1>
            <p className="text-[11px] text-brand-text/40 uppercase tracking-[0.4em] font-bold">UID: {customer._id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {customer.status === 'active' ? (
            <button 
              onClick={() => handleUpdateStatus('suspended')}
              disabled={updating}
              className="px-8 py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2"
            >
              {updating ? <Loader2 className="animate-spin" size={16} /> : <Ban size={16} />}
              <span>Suspend Account</span>
            </button>
          ) : (
            <button 
              onClick={() => handleUpdateStatus('active')}
              disabled={updating}
              className="px-8 py-4 bg-emerald-500/10 text-emerald-500 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center space-x-2"
            >
              {updating ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
              <span>Reinstate Account</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 p-10 space-y-8 shadow-md">
            <div className="flex flex-col items-center text-center space-y-4 pb-8 border-b border-brand-text/5">
              <div className="w-24 h-24 rounded-[40px] bg-brand-gold/10 flex items-center justify-center text-brand-gold text-3xl font-serif italic border-4 border-white shadow-xl">
                {customer.name ? customer.name[0] : '?'}
              </div>
              <div>
                <p className={cn(
                  "inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-2",
                  customer.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                )}>
                  <Activity size={10} />
                  <span>{customer.status}</span>
                </p>
                <h3 className="text-xl font-bold text-brand-text dark:text-white">{customer.name}</h3>
                <p className="text-[12px] text-brand-text/40">{customer.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-brand-text/60">
                <Phone size={18} className="text-brand-gold" />
                <span className="text-[13px] font-medium">{customer.phone || 'No phone provided'}</span>
              </div>
              <div className="flex items-center space-x-4 text-brand-text/60">
                <Calendar size={18} className="text-brand-gold" />
                <span className="text-[13px] font-medium">Joined {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-4 text-brand-text/60">
                <Clock size={18} className="text-brand-gold" />
                <span className="text-[13px] font-medium">Last seen {new Date(customer.lastLogin).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-white/5 rounded-[40px] border border-brand-text/5 p-8 space-y-2">
              <ShoppingBag className="text-brand-gold mb-2" size={20} />
              <p className="text-2xl font-bold text-brand-text">{customer.orders?.length || 0}</p>
              <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-black">Total Orders</p>
            </div>
            <div className="bg-[#12100e] rounded-[40px] p-8 space-y-2 shadow-xl shadow-brand-gold/5">
              <CreditCard className="text-brand-gold mb-2" size={20} />
              <p className="text-2xl font-bold text-white">₹{totalSpent.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-widest text-white/30 font-black">Lifetime Spend</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          {/* Order History */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <Package size={20} />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text">Purchase History</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-[48px] border border-brand-text/15 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-text/5">
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-gold">Order ID</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-gold">Status</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-gold">Total</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-gold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-text/5">
                  {customer.orders?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-[12px] text-brand-text/40 font-medium">No purchase records found.</td>
                    </tr>
                  ) : customer.orders?.map((order: any) => (
                    <tr key={order._id} className="group hover:bg-brand-gold/[0.02] transition-colors">
                      <td className="p-6">
                        <span className="text-[12px] font-bold text-brand-text">#{order._id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className="p-6">
                        <div className={cn(
                          "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          order.orderStatus === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", order.orderStatus === 'delivered' ? "bg-emerald-500" : "bg-amber-500")} />
                          <span>{order.orderStatus}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-[12px] font-black text-brand-text">₹{order.totalAmount?.toLocaleString()}</span>
                      </td>
                      <td className="p-6 text-[12px] text-brand-text/40 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <MapPin size={20} />
              </div>
              <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text">Address Vault</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customer.addresses?.length === 0 ? (
                <div className="col-span-full py-10 text-center bg-slate-50 rounded-[40px] border border-dashed border-brand-text/10">
                  <p className="text-[12px] text-brand-text/40 font-medium italic">No addresses registered yet.</p>
                </div>
              ) : customer.addresses?.map((addr: any, i: number) => (
                <div key={i} className="bg-white dark:bg-white/5 border border-brand-text/15 rounded-[40px] p-8 space-y-4 relative overflow-hidden group">
                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest font-black text-brand-gold">{addr.type}</p>
                      <p className="text-[14px] font-bold text-brand-text">{addr.fullName}</p>
                    </div>
                    {addr.isDefault && (
                      <div className="px-2 py-1 bg-brand-gold text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Default</div>
                    )}
                  </div>
                  <div className="space-y-1 text-[12px] text-brand-text/60 leading-relaxed">
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p>{addr.country}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] font-bold text-brand-text/40">
                    <Phone size={12} />
                    <span>{addr.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

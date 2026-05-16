'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Synchronizing Vault...</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `₹${stats?.totalRevenue?.toLocaleString()}`, 
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-emerald-500/5',
      href: '/admin/orders'
    },
    { 
      label: 'Active Orders', 
      value: stats?.activeOrders?.toString(), 
      icon: ShoppingBag,
      color: 'from-brand-gold/20 to-brand-gold/5',
      href: '/admin/orders'
    },
    { 
      label: 'Total Products', 
      value: stats?.totalProducts?.toString(), 
      icon: Package,
      color: 'from-blue-500/20 to-blue-500/5',
      href: '/admin/products'
    },
    { 
      label: 'Total Customers', 
      value: stats?.totalCustomers?.toString(), 
      icon: Users,
      color: 'from-purple-500/20 to-purple-500/5',
      href: '/admin/customers'
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Management Overview</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Dashboard <span className="not-italic text-brand-text/20 dark:text-white/20">/ Live Status</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4 bg-white dark:bg-white/5 p-2 rounded-2xl border border-brand-text/15 dark:border-white/15">
          <div className="px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-xl text-[11px] font-bold uppercase tracking-widest">
            Production Linked
          </div>
          <div className="pr-4 flex items-center space-x-2 text-[11px] font-medium text-brand-text/40">
            <Clock size={14} />
            <span>Last Sync: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, i) => (
          <Link 
            key={i}
            href={stat.href}
            className="group relative bg-white dark:bg-white/10 rounded-[32px] p-8 border border-brand-text/15 dark:border-white/15 hover:border-brand-gold/40 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", stat.color)} />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-brand-bg dark:bg-white/5 flex items-center justify-center text-brand-text/40 group-hover:text-brand-gold transition-colors duration-500">
                  <stat.icon size={24} />
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70 mb-1">{stat.label}</p>
                <p className="text-3xl font-serif font-bold text-brand-text dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 overflow-hidden flex flex-col shadow-md">
          <div className="p-8 border-b border-brand-text/5 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-brand-text dark:text-white italic">Recent Orders</h3>
            <Link href="/admin/orders" className="text-[10px] font-bold text-brand-gold uppercase tracking-widest hover:underline transition-all">View Ledger</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-brand-bg/50 dark:bg-white/2">
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">ID</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Customer</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Status</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Amount</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-brand-bg/30 dark:hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6 text-[13px] font-bold text-brand-text dark:text-white/80">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-6 text-[13px] text-brand-text/60 dark:text-white/60">{order.shippingAddress?.fullName}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border",
                        order.orderStatus === 'processing' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        order.orderStatus === 'shipped' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        order.orderStatus === 'delivered' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        "bg-brand-text/10 text-brand-text/40 border-brand-text/5"
                      )}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[13px] font-black text-brand-gold">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-8 py-6 text-[11px] text-brand-text/30 text-right">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-brand-gold to-[#B4925A] p-10 rounded-[40px] text-[#12100e] relative overflow-hidden group shadow-premium">
            <Sparkles className="absolute top-[-20px] right-[-20px] w-40 h-40 text-black/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-serif font-bold italic leading-tight">Stock <br /> Intelligence</h3>
              <p className="text-[11px] uppercase tracking-widest font-bold opacity-60">Inventory requiring immediate attention</p>
              
              {stats?.lowStockCount > 0 ? (
                <div className="bg-black/10 p-4 rounded-2xl border border-black/5">
                  <div className="flex items-center space-x-3 text-red-900">
                    <AlertCircle size={20} />
                    <span className="text-[13px] font-black uppercase tracking-widest">{stats.lowStockCount} Items Out of Stock</span>
                  </div>
                </div>
              ) : (
                <div className="bg-black/5 p-4 rounded-2xl border border-black/5">
                  <div className="flex items-center space-x-3 text-emerald-900">
                    <CheckCircle2 className="text-emerald-900" size={20} />
                    <span className="text-[13px] font-black uppercase tracking-widest">Inventory Healthy</span>
                  </div>
                </div>
              )}

              <Link 
                href="/admin/products?filter=low-stock"
                className="block w-full bg-black text-white text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-premium"
              >
                Manage Inventory
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-white/10 p-8 rounded-[40px] border border-brand-text/15 dark:border-white/15 space-y-6 shadow-md">
            <h3 className="text-lg font-serif font-bold text-brand-text dark:text-white italic">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/products/new" className="flex flex-col items-center justify-center p-6 bg-brand-bg dark:bg-white/5 rounded-3xl border border-transparent hover:border-brand-gold/20 transition-all group">
                <Package size={20} className="text-brand-text/40 group-hover:text-brand-gold mb-3 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text/60">New Item</span>
              </Link>
              <Link href="/admin/orders" className="flex flex-col items-center justify-center p-6 bg-brand-bg dark:bg-white/5 rounded-3xl border border-transparent hover:border-brand-gold/20 transition-all group">
                <ShoppingBag size={20} className="text-brand-text/40 group-hover:text-brand-gold mb-3 transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-text/60">Fulfillment</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  CreditCard,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/customers?page=${page}&limit=${limit}&q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
        setTotalCustomers(data.total);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Patron Ledger</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Customers <span className="not-italic text-brand-text/20 dark:text-white/20">({totalCustomers})</span>
          </h1>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-white/10 p-6 rounded-[32px] border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Email, or Phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-[13px] focus:ring-1 focus:ring-brand-gold/50 transition-all placeholder:text-brand-text/30 dark:placeholder:text-white/20"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center space-x-2 px-6 py-3 bg-slate-100 dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all text-[12px] font-bold uppercase tracking-widest flex-1 md:flex-none justify-center">
            <Filter size={16} />
            <span>Refine</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-md">
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-brand-gold animate-spin" size={40} />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Identifying Patrons...</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-brand-bg/50 dark:bg-white/2">
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Patron Info</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Contact</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Activity</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Value</th>
                  <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-black text-brand-text/50 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {customers.map((customer) => (
                  <tr key={customer._id} className="group hover:bg-brand-bg/30 dark:hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                          <UserIcon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text dark:text-white">{customer.name || 'Anonymous Patron'}</span>
                          <span className={cn(
                            "text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md w-fit mt-1",
                            customer.onboardingCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                          )}>
                            {customer.onboardingCompleted ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2 text-[12px] text-brand-text/60 dark:text-white/60 font-medium">
                          <Mail size={12} className="text-brand-text/30" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center space-x-2 text-[11px] text-brand-text/40 dark:text-white/40">
                            <Phone size={11} className="text-brand-text/20" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-black text-brand-text dark:text-white">{customer.orderCount}</span>
                          <span className="text-[9px] text-brand-text/30 uppercase tracking-widest font-bold">Orders</span>
                        </div>
                        <div className="w-px h-8 bg-brand-text/5" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-brand-text/40 uppercase tracking-widest font-black flex items-center space-x-2">
                            <Clock size={10} />
                            <span>Last Seen</span>
                          </span>
                          <span className="text-[11px] font-bold text-brand-text/60 dark:text-white/60">{new Date(customer.lastLogin).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-brand-gold">₹{customer.totalSpent?.toLocaleString()}</span>
                        <span className="text-[9px] text-brand-text/30 uppercase tracking-widest font-bold">Lifetime Value</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-[11px] font-bold text-brand-text/40 uppercase tracking-widest">
                        {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-brand-text/20">
              <Users size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white italic">No Patrons Identified</h3>
              <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium max-w-xs mx-auto">
                The vault contains no records matching your current filter.
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalCustomers > limit && (
          <div className="p-8 border-t border-brand-text/5 dark:border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium">
              Page <span className="text-brand-text dark:text-white font-black">{page}</span> of <span className="text-brand-text dark:text-white font-black">{Math.ceil(totalCustomers / limit)}</span>
            </p>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-3 bg-slate-100 dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= totalCustomers}
                className="p-3 bg-slate-100 dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

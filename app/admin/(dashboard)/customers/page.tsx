'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Mail,
  Phone,
  User as UserIcon,
  Clock,
  Eye,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function AdminCustomersPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL States
  const page = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('q') || '';
  const status = searchParams.get('status') || '';
  const isActive = searchParams.get('isActive') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const limit = 10;

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

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        q: searchTerm,
        status,
        isActive,
        sort
      });
      const res = await fetch(`/api/admin/customers?${queryParams.toString()}`);
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

  useEffect(() => {
    fetchCustomers();
  }, [page, searchTerm, status, isActive, sort]);

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Highest Spend', value: 'spend-high' },
    { label: 'Most Orders', value: 'orders-high' },
    { label: 'Recent Activity', value: 'activity' },
  ];

  const statusOptions = ['active', 'suspended', 'banned'];

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
      <div className="space-y-4">
        <div className="bg-white dark:bg-white/10 p-4 md:p-6 rounded-4xl border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Phone..." 
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
                  showFilters || status || isActive
                    ? "bg-brand-gold text-brand-bg border-brand-gold" 
                    : "bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 border-transparent hover:border-brand-gold/20"
                )}
              >
                <Filter size={16} />
                <span>Filters</span>
                {(status || isActive) && (
                  <span className="ml-1 w-2 h-2 bg-white rounded-full" />
                )}
              </button>
              
              {showFilters && (
                <div className="absolute top-full mt-4 right-0 w-72 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl border border-brand-text/10 dark:border-white/10 p-6 z-50 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Filter Patrons</h4>
                    <button 
                      onClick={() => updateQueryParams({ status: '', isActive: '' })}
                      className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 hover:text-brand-gold"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Account Status</label>
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
                      <label className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 ml-1">Visibility</label>
                      <select 
                        value={isActive}
                        onChange={(e) => updateQueryParams({ isActive: e.target.value })}
                        className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-xl py-2 px-3 text-[12px] focus:ring-1 focus:ring-brand-gold/50"
                      >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
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
        {(status || isActive || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 mr-2">Active:</span>
            {searchTerm && (
              <button 
                onClick={() => updateQueryParams({ q: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>&ldquo;{searchTerm}&rdquo;</span>
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
            {isActive && (
              <button 
                onClick={() => updateQueryParams({ isActive: '' })}
                className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold/20 transition-all"
              >
                <span>{isActive === 'true' ? 'Active' : 'Inactive'}</span>
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-premium">
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
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Patron Info</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Contact</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Activity</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50">Value</th>
                  <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-black text-brand-text/50 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-text/5 dark:divide-white/5">
                {customers.map((customer) => (
                  <tr key={customer._id} className="group hover:bg-brand-bg/30 dark:hover:bg-white/2 transition-all duration-300 relative">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold border border-brand-gold/20 group-hover:scale-110 transition-transform">
                          {customer.name ? customer.name[0] : <UserIcon size={18} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-brand-text dark:text-white group-hover:text-brand-gold transition-colors">{customer.name || 'Anonymous Patron'}</span>
                          <span className={cn(
                            "text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md w-fit mt-1 transition-all",
                            customer.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
                          )}>
                            {customer.status || 'active'}
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
                        <div className="w-px h-8 bg-brand-text/5 dark:bg-white/5" />
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
                      <div className="flex items-center justify-end space-x-4">
                        <span className="text-[11px] font-bold text-brand-text/40 uppercase tracking-widest">
                          {new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </span>
                        <Link 
                          href={`/admin/customers/${customer._id}`}
                          className="p-3 bg-brand-gold/5 text-brand-gold rounded-xl hover:bg-brand-gold hover:text-brand-bg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Eye size={18} />
                        </Link>
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
              <Users size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white italic">No Patrons Identified</h3>
              <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium max-w-xs mx-auto">
                The vault contains no records matching your current filter.
              </p>
            </div>
            <button 
              onClick={() => updateQueryParams({ status: '', isActive: '', q: '' })}
              className="px-10 py-4 bg-brand-text dark:bg-white/5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-gold transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalCustomers > limit && (
          <div className="p-8 border-t border-brand-text/5 dark:border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-brand-text/40 uppercase tracking-widest font-medium">
              Showing <span className="text-brand-text dark:text-white font-black">{((page - 1) * limit) + 1}</span> to <span className="text-brand-text dark:text-white font-black">{Math.min(page * limit, totalCustomers)}</span> of <span className="text-brand-text dark:text-white font-black">{totalCustomers}</span> patrons
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
                disabled={page * limit >= totalCustomers}
                className="p-3 bg-brand-bg dark:bg-white/5 text-brand-text/40 rounded-xl disabled:opacity-30 transition-all hover:text-brand-gold"
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

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Patrons...</p>
      </div>
    }>
      <AdminCustomersPageContent />
    </Suspense>
  );
}

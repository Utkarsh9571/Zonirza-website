"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { 
  Gift, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Loader2,
  TrendingUp,
  Activity,
  CircleDollarSign,
  ChevronRight,
  Filter,
  X,
  Eye,
  EyeOff,
  History,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function AdminGiftCardsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL States
  const searchTerm = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || '';

  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealedCodes, setRevealedCodes] = useState<Record<string, boolean>>({});
  const [selectedCardForTx, setSelectedCardForTx] = useState<any>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'registry' | 'delivery' | 'scheduled'>('registry');
  
  const [formData, setFormData] = useState({
    initialAmount: 5000,
    currency: 'INR',
    recipientEmail: '',
    recipientName: '',
    personalMessage: '',
    expirationDate: '',
    theme: 'Minimal Luxury',
    scheduledAt: ''
  });

  const handleResendEmail = async (id: string) => {
    if (!confirm('Are you sure you want to resend this voucher email?')) return;
    try {
      const res = await fetch('/api/admin/gift-cards/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Email resent successfully');
        fetchGiftCards();
      } else {
        alert(data.error || 'Failed to resend email');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to SMTP server.');
    }
  };

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
    fetchGiftCards();
    fetchTransactions();
  }, [searchTerm, statusFilter]);

  const fetchGiftCards = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchTerm,
        status: statusFilter
      });
      const res = await fetch(`/api/admin/gift-cards?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) setGiftCards(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/gift-cards/transactions');
      const data = await res.json();
      if (data.success) setTransactions(data.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchGiftCards();
        fetchTransactions();
        setIsModalOpen(false);
        setFormData({
          initialAmount: 5000,
          currency: 'INR',
          recipientEmail: '',
          recipientName: '',
          personalMessage: '',
          expirationDate: '',
          theme: 'Minimal Luxury',
          scheduledAt: ''
        });
      } else {
        alert(data.error || 'Failed to create Gift Card');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'cancelled' : 'active';
    if (!confirm(`Are you sure you want to change status of this gift card to '${nextStatus}'?`)) return;

    try {
      const res = await fetch('/api/admin/gift-cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchGiftCards();
        fetchTransactions();
      } else {
        alert(data.error || 'Failed to update Gift Card status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCodeReveal = (id: string) => {
    setRevealedCodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Metrics
  const activeCards = giftCards.filter(c => c.status === 'active' || c.status === 'partially_redeemed');
  const totalActiveValue = activeCards.reduce((acc, c) => acc + c.currentBalance, 0);
  const totalRedeemedValue = transactions
    .filter(tx => tx.type === 'redeemed')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const scheduledCardsCount = giftCards.filter(c => c.deliveryStatus === 'pending' && c.scheduledAt).length;

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Stored Value Management</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Luxury <span className="not-italic text-brand-text/20 dark:text-white/20">Gift Cards</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-brand-text/5 flex items-center space-x-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <Activity className="text-brand-gold" size={18} />
              <div>
                <p className="text-[14px] font-black text-brand-text dark:text-white">₹{totalActiveValue.toLocaleString('en-IN')}</p>
                <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Active Liability</p>
              </div>
            </div>
            <div className="w-px h-8 bg-brand-text/10" />
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-emerald-500" size={18} />
              <div>
                <p className="text-[14px] font-black text-brand-text dark:text-white">₹{totalRedeemedValue.toLocaleString('en-IN')}</p>
                <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Total Redeemed</p>
              </div>
            </div>
            <div className="w-px h-8 bg-brand-text/10" />
            <div className="flex items-center space-x-3">
              <Clock className="text-amber-500" size={18} />
              <div>
                <p className="text-[14px] font-black text-brand-text dark:text-white">{scheduledCardsCount}</p>
                <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Scheduled Queue</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-[74px] px-8 bg-brand-gold text-[#12100e] rounded-[30px] font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
          >
            <Plus size={20} />
            <span>Generate Card</span>
          </button>
        </div>
      </div>

      {/* Analytics Dashboard Panel */}
      <div className="bg-white dark:bg-[#1C1A19]/25 border border-brand-text/5 dark:border-white/5 rounded-[40px] p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Theme Popularity */}
        <div className="space-y-3">
          <span className="text-[9px] uppercase tracking-widest text-brand-text/40 dark:text-white/40 font-black">Theme Popularity</span>
          <div className="space-y-2">
            {['Minimal Luxury', 'Wedding Gold', 'Anniversary Velvet', 'Birthday Blush', 'Diwali Spark', 'Festive Gold'].map((th) => {
              const count = giftCards.filter(c => c.theme === th).length;
              const total = giftCards.length || 1;
              return (
                <div key={th} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="truncate">{th}</span>
                    <span>{count}</span>
                  </div>
                  <div className="w-full h-1 bg-brand-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold" style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Distributions */}
        <div className="space-y-3">
          <span className="text-[9px] uppercase tracking-widest text-brand-text/40 dark:text-white/40 font-black">Value Distribution</span>
          <div className="space-y-2">
            {[1000, 5000, 10000, 25000].map((v) => {
              const count = giftCards.filter(c => c.initialAmount === v).length;
              const total = giftCards.length || 1;
              return (
                <div key={v} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>₹{v.toLocaleString()}</span>
                    <span>{count}</span>
                  </div>
                  <div className="w-full h-1 bg-brand-bg rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold" style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Open Tracking Rate */}
        <div className="space-y-3">
          <span className="text-[9px] uppercase tracking-widest text-brand-text/40 dark:text-white/40 font-black">Recipient Open Rate</span>
          <div className="flex items-baseline space-x-2">
            {(() => {
              const openedCount = giftCards.filter(c => c.openedAt).length;
              const totalDelivered = giftCards.filter(c => c.deliveryStatus === 'delivered').length || 1;
              const rate = Math.round((openedCount / totalDelivered) * 100);
              return (
                <>
                  <p className="text-3xl font-serif italic font-black text-brand-gold">{rate}%</p>
                  <span className="text-[9px] uppercase font-bold text-gray-400">({openedCount} of {totalDelivered})</span>
                </>
              );
            })()}
          </div>
          <p className="text-[9px] text-brand-text/40 leading-relaxed font-medium">Percentage of vouchers opened by recipient via tracking pixel.</p>
        </div>

        {/* Redemption conversion */}
        <div className="space-y-3">
          <span className="text-[9px] uppercase tracking-widest text-brand-text/40 dark:text-white/40 font-black">Conversion Rate</span>
          <div className="flex items-baseline space-x-2">
            {(() => {
              const fullyRedeemed = giftCards.filter(c => c.status === 'redeemed').length;
              const totalActive = giftCards.length || 1;
              const conversionRate = Math.round((fullyRedeemed / totalActive) * 100);
              return (
                <>
                  <p className="text-3xl font-serif italic font-black text-brand-gold">{conversionRate}%</p>
                  <span className="text-[9px] uppercase font-bold text-gray-400">({fullyRedeemed} used)</span>
                </>
              );
            })()}
          </div>
          <p className="text-[9px] text-brand-text/40 leading-relaxed font-medium">Conversion from issued gift balance to completed jewellery checkouts.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-white/10 p-4 md:p-6 rounded-[32px] border border-brand-text/15 dark:border-white/15 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by Code, Recipient Name or Email..." 
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
            value={statusFilter}
            onChange={(e) => updateQueryParams({ status: e.target.value })}
            className="bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all text-[12px] font-bold uppercase tracking-widest px-6 py-3 focus:ring-1 focus:ring-brand-gold/50 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="partially_redeemed">Partial</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex border-b border-brand-text/10 pt-4 gap-6">
        <button
          onClick={() => setActiveAdminTab('registry')}
          className={cn(
            "pb-4 px-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2",
            activeAdminTab === 'registry' ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-text/40 hover:text-brand-text"
          )}
        >
          <Gift size={14} />
          <span>Voucher Registry ({giftCards.length})</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('delivery')}
          className={cn(
            "pb-4 px-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2",
            activeAdminTab === 'delivery' ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-text/40 hover:text-brand-text"
          )}
        >
          <Mail size={14} />
          <span>Delivery Queue ({giftCards.filter(c => c.deliveryStatus === 'delivered' || c.deliveryStatus === 'failed').length})</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('scheduled')}
          className={cn(
            "pb-4 px-4 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all flex items-center space-x-2",
            activeAdminTab === 'scheduled' ? "border-brand-gold text-brand-gold" : "border-transparent text-brand-text/40 hover:text-brand-text"
          )}
        >
          <Clock size={14} />
          <span>Scheduled Queue ({giftCards.filter(c => c.deliveryStatus === 'pending' && (c.scheduledFor || c.scheduledAt)).length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="text-brand-gold animate-spin" size={40} />
          <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Querying Ledger...</p>
        </div>
      ) : (
        <>
          {/* Tab 1: Registry Grid */}
          {activeAdminTab === 'registry' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {giftCards.length === 0 ? (
                <div className="col-span-full py-40 text-center bg-white dark:bg-white/5 rounded-[48px] border border-dashed border-brand-text/20">
                  <Gift className="mx-auto text-brand-text/10 mb-4" size={48} />
                  <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">No gift cards matching criteria.</p>
                </div>
              ) : giftCards.map((card) => {
                const isRevealed = revealedCodes[card._id] || false;
                return (
                  <div key={card._id} className="group bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-premium flex flex-col hover:border-brand-gold/30 transition-all duration-500">
                    <div className={cn(
                      "p-8 relative overflow-hidden border-b border-brand-text/5",
                      card.status === 'active' || card.status === 'partially_redeemed' ? "bg-brand-gold/5" : "bg-slate-50 dark:bg-white/2 opacity-60"
                    )}>
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl" />
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white dark:bg-[#1A1A1A] rounded-full border border-brand-gold/20">
                            <Gift className="text-brand-gold" size={14} />
                            <span className="font-mono text-[12px] font-black tracking-widest">
                              {isRevealed ? card.code : 'ZGFT-••••-••••'}
                            </span>
                            <button onClick={() => toggleCodeReveal(card._id)} className="text-brand-text/30 hover:text-brand-gold">
                              {isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold">Remaining Balance</p>
                            <h3 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic">
                              ₹{card.currentBalance.toLocaleString()} <span className="not-italic text-sm text-brand-text/40">/ ₹{card.initialAmount.toLocaleString()}</span>
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-4">
                          <button
                            onClick={() => handleToggleStatus(card._id, card.status)}
                            className={cn(
                              "p-2 rounded-xl border transition-all duration-500",
                              card.status === 'active' || card.status === 'partially_redeemed' 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-500" 
                                : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-emerald-500/10 hover:text-emerald-500"
                            )}
                            title={card.status === 'active' ? 'Click to Disable' : 'Click to Enable'}
                          >
                            {card.status === 'active' || card.status === 'partially_redeemed' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          </button>
                          <div className="text-right">
                            <span className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold block">Status</span>
                            <span className="text-[10px] font-bold uppercase text-brand-gold">{card.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-3 text-[11px] uppercase tracking-widest font-bold">
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text/40">Recipient</span>
                          <span className="text-brand-text dark:text-white max-w-[150px] truncate">{card.recipientName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text/40">Email</span>
                          <span className="text-brand-text dark:text-white max-w-[150px] truncate lowercase">{card.recipientEmail}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text/40">Security PIN</span>
                          <span className="font-mono text-brand-text dark:text-white">{isRevealed ? card.pin : '••••••'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text/40">Theme Style</span>
                          <span className="text-brand-text dark:text-white">{card.theme || 'Minimal Luxury'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text/40">Expires</span>
                          <span className="text-brand-text dark:text-white">
                            {new Date(card.expirationDate).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text/40">Issued Via</span>
                          <span className="text-brand-text dark:text-white">{card.createdByAdmin ? 'Admin Manual' : 'Customer Web'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-text/40">Delivery Queue</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                            card.deliveryStatus === 'delivered' ? "bg-green-500/10 text-green-500" :
                            card.deliveryStatus === 'pending' ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                          )}>
                            {card.deliveryStatus || 'delivered'}
                          </span>
                        </div>
                        {(card.scheduledFor || card.scheduledAt) && card.deliveryStatus === 'pending' && (
                          <div className="flex items-center justify-between text-amber-500">
                            <span className="text-brand-text/40">Scheduled For</span>
                            <span>{new Date(card.scheduledFor || card.scheduledAt).toLocaleString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                        {card.openedAt && (
                          <div className="flex items-center justify-between text-green-600">
                            <span className="text-brand-text/40">Opened At</span>
                            <span>{new Date(card.openedAt).toLocaleDateString('en-IN', { month: 'short', day: '2-digit' })}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-brand-text/5">
                        <button 
                          onClick={() => setSelectedCardForTx(card)}
                          className="flex-1 py-3 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center space-x-2"
                        >
                          <History size={14} />
                          <span>Audit Ledger</span>
                        </button>
                        {card.status !== 'cancelled' && card.deliveryStatus !== 'pending' && (
                          <button 
                            onClick={() => handleResendEmail(card._id)}
                            className="flex-1 py-3 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white transition-all flex items-center justify-center space-x-2"
                          >
                            <Mail size={14} />
                            <span>Resend Email</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Delivery Status Table */}
          {activeAdminTab === 'delivery' && (
            <div className="bg-white dark:bg-[#1C1A19]/25 border border-brand-text/5 dark:border-white/5 rounded-[40px] p-8 shadow-sm overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-text/10 text-brand-text/40 uppercase tracking-widest font-black">
                    <th className="pb-4">Code</th>
                    <th className="pb-4">Recipient</th>
                    <th className="pb-4 text-right">Value</th>
                    <th className="pb-4">Channel</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Dispatched At</th>
                    <th className="pb-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-text/5 font-medium">
                  {giftCards.filter(c => c.deliveryStatus === 'delivered' || c.deliveryStatus === 'failed').map((card) => (
                    <tr key={card._id} className="hover:bg-brand-bg/10 transition-colors">
                      <td className="py-4 font-mono font-bold tracking-wider">
                        {revealedCodes[card._id] ? card.code : 'ZGFT-••••-••••'}
                        <button onClick={() => toggleCodeReveal(card._id)} className="text-brand-text/30 hover:text-brand-gold ml-2 align-middle">
                          {revealedCodes[card._id] ? <EyeOff size={11} /> : <Eye size={11} />}
                        </button>
                      </td>
                      <td className="py-4">
                        <span className="font-bold block uppercase">{card.recipientName}</span>
                        <span className="text-brand-text/40 lowercase">{card.recipientEmail}</span>
                      </td>
                      <td className="py-4 text-right font-bold text-brand-text dark:text-white">
                        ₹{card.currentBalance.toLocaleString()} / ₹{card.initialAmount.toLocaleString()}
                      </td>
                      <td className="py-4 uppercase tracking-wider text-[9px] font-black text-brand-text/40">{card.deliveryChannel || 'email'}</td>
                      <td className="py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
                          card.deliveryStatus === 'delivered' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                          {card.deliveryStatus}
                        </span>
                      </td>
                      <td className="py-4 text-brand-text/60">
                        {card.deliveredAt ? new Date(card.deliveredAt).toLocaleString('en-IN') : 'N/A'}
                      </td>
                      <td className="py-4 text-center flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleResendEmail(card._id)}
                          disabled={card.status === 'cancelled'}
                          className="px-3 py-1 bg-brand-bg hover:bg-brand-gold hover:text-[#12100e] rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors disabled:opacity-40"
                        >
                          Resend Email
                        </button>
                        <button 
                          onClick={() => setSelectedCardForTx(card)}
                          className="p-1.5 bg-brand-bg hover:bg-brand-gold hover:text-[#12100e] rounded-lg transition-colors"
                          title="Audit"
                        >
                          <History size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {giftCards.filter(c => c.deliveryStatus === 'delivered' || c.deliveryStatus === 'failed').length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400 font-bold uppercase tracking-wider">No delivered gift cards in queue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Scheduled Deliveries List */}
          {activeAdminTab === 'scheduled' && (
            <div className="bg-white dark:bg-[#1C1A19]/25 border border-brand-text/5 dark:border-white/5 rounded-[40px] p-8 shadow-sm overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-text/10 text-brand-text/40 uppercase tracking-widest font-black">
                    <th className="pb-4">Code</th>
                    <th className="pb-4">Recipient</th>
                    <th className="pb-4 text-right">Value</th>
                    <th className="pb-4">Theme</th>
                    <th className="pb-4">Scheduled For</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-text/5 font-medium">
                  {giftCards.filter(c => c.deliveryStatus === 'pending' && (c.scheduledFor || c.scheduledAt)).map((card) => (
                    <tr key={card._id} className="hover:bg-brand-bg/10 transition-colors">
                      <td className="py-4 font-mono font-bold tracking-wider">
                        {revealedCodes[card._id] ? card.code : 'ZGFT-••••-••••'}
                        <button onClick={() => toggleCodeReveal(card._id)} className="text-brand-text/30 hover:text-brand-gold ml-2 align-middle">
                          {revealedCodes[card._id] ? <EyeOff size={11} /> : <Eye size={11} />}
                        </button>
                      </td>
                      <td className="py-4">
                        <span className="font-bold block uppercase">{card.recipientName}</span>
                        <span className="text-brand-text/40 lowercase">{card.recipientEmail}</span>
                      </td>
                      <td className="py-4 text-right font-bold text-brand-text dark:text-white">
                        ₹{card.initialAmount.toLocaleString()}
                      </td>
                      <td className="py-4 uppercase tracking-wider text-[9px] font-black text-brand-text/40">{card.theme}</td>
                      <td className="py-4 text-amber-500 font-bold">
                        {new Date(card.scheduledFor || card.scheduledAt).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500">
                          {card.status}
                        </span>
                      </td>
                      <td className="py-4 text-center flex items-center justify-center gap-2">
                        <button 
                          onClick={async () => {
                            if (confirm("Would you like to force immediate delivery of this scheduled gift card?")) {
                              await handleResendEmail(card._id);
                            }
                          }}
                          className="px-3 py-1 bg-brand-bg hover:bg-brand-gold hover:text-[#12100e] rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors"
                        >
                          Deliver Now
                        </button>
                        <button 
                          onClick={() => setSelectedCardForTx(card)}
                          className="p-1.5 bg-brand-bg hover:bg-brand-gold hover:text-[#12100e] rounded-lg transition-colors"
                          title="Audit"
                        >
                          <History size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {giftCards.filter(c => c.deliveryStatus === 'pending' && (c.scheduledFor || c.scheduledAt)).length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400 font-bold uppercase tracking-wider">No scheduled gift cards in queue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Manual Generate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1614] rounded-[40px] shadow-2xl overflow-hidden p-10 border border-brand-text/10 dark:border-white/10 animate-in zoom-in duration-300">
            <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic mb-8">
              Issue <span className="not-italic text-brand-text/20">Manual Voucher</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Amount (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.initialAmount}
                    onChange={(e) => setFormData({...formData, initialAmount: Number(e.target.value)})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Currency</label>
                  <select 
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED (Dh)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Recipient Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="John Doe"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Recipient Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Personal Message (Optional)</label>
                <textarea 
                  placeholder="Compliments from Luxury Jewelry Curator..."
                  rows={2}
                  value={formData.personalMessage}
                  onChange={(e) => setFormData({...formData, personalMessage: e.target.value})}
                  className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Expiration Date (Optional)</label>
                <input 
                  type="date" 
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                  className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Theme Style</label>
                  <select 
                    value={formData.theme}
                    onChange={(e) => setFormData({...formData, theme: e.target.value})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  >
                    <option value="Minimal Luxury">Minimal Luxury</option>
                    <option value="Wedding Gold">Wedding Gold</option>
                    <option value="Anniversary Velvet">Anniversary Velvet</option>
                    <option value="Birthday Blush">Birthday Blush</option>
                    <option value="Diwali Spark">Diwali Spark</option>
                    <option value="Festive Gold">Festive Gold</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Scheduled Delivery (Optional)</label>
                  <input 
                    type="datetime-local" 
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
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
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Ledger Modal */}
      {selectedCardForTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" onClick={() => setSelectedCardForTx(null)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1614] rounded-[40px] shadow-2xl overflow-hidden p-10 border border-brand-text/10 dark:border-white/10 max-h-[80vh] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic">
                  Audit Ledger <span className="not-italic text-brand-text/20">for {selectedCardForTx.code}</span>
                </h2>
                <button 
                  onClick={() => setSelectedCardForTx(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-bg text-brand-text/40 hover:text-brand-gold transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="divide-y divide-brand-text/5 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
                {transactions.filter(tx => tx.giftCardId?._id === selectedCardForTx._id).length === 0 ? (
                  <p className="text-center py-12 text-xs uppercase tracking-widest text-brand-text/30 font-bold">No ledger actions recorded.</p>
                ) : (
                  transactions
                    .filter(tx => tx.giftCardId?._id === selectedCardForTx._id)
                    .map((tx) => (
                      <div key={tx._id} className="py-4 flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <span className={cn(
                            "font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mr-2",
                            tx.type === 'issued' ? 'bg-green-500/10 text-green-500' :
                            tx.type === 'redeemed' ? 'bg-amber-500/10 text-amber-500' :
                            tx.type === 'refunded' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'
                          )}>
                            {tx.type}
                          </span>
                          <span className="text-brand-text/40 font-bold">
                            {new Date(tx.createdAt).toLocaleString()}
                          </span>
                          <p className="text-[10px] text-brand-text/60 mt-1 font-bold">
                            {tx.metadata?.notes || 'No description provided.'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-text dark:text-white">
                            {tx.type === 'redeemed' ? '-' : '+'}{selectedCardForTx.currency} {tx.amount.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-brand-text/30 font-bold">
                            Bal: {selectedCardForTx.currency} {tx.balanceAfter.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <button 
              onClick={() => setSelectedCardForTx(null)}
              className="w-full mt-6 py-4 bg-brand-bg dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl text-[12px] font-bold uppercase tracking-widest hover:bg-brand-text hover:text-white transition-all"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminGiftCardsPage() {
  return (
    <Suspense fallback={
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Ledger...</p>
      </div>
    }>
      <AdminGiftCardsPageContent />
    </Suspense>
  );
}

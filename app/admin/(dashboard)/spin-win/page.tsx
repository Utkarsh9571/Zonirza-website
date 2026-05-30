"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, 
  Plus, 
  Settings2, 
  Activity, 
  TrendingUp, 
  RotateCcw, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  Ticket, 
  User, 
  Eye, 
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Prize {
  _id: string;
  title: string;
  couponId?: string;
  couponCode?: string;
  probabilityWeight: number;
  enabled: boolean;
  displayOrder: number;
}

interface MetricStats {
  totalSpins: number;
  uniqueParticipants: number;
  couponWins: number;
  claimedWins: number;
  redemptions: number;
  winRate: number | string;
  redemptionRate: number | string;
}

interface SpinAttempt {
  _id: string;
  userId?: {
    name: string;
    email: string;
  };
  ipAddress: string;
  userAgent: string;
  wheelSlot: number;
  couponCode?: string;
  claimed: boolean;
  createdAt: string;
}

export default function AdminSpinWinPage() {
  // Global status
  const [featureEnabled, setFeatureEnabled] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<MetricStats>({
    totalSpins: 0,
    uniqueParticipants: 0,
    couponWins: 0,
    claimedWins: 0,
    redemptions: 0,
    winRate: 0,
    redemptionRate: 0
  });

  // Prizes & history collections
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [history, setHistory] = useState<SpinAttempt[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  
  // Loaders
  const [loadingPrizes, setLoadingPrizes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [submittingToggle, setSubmittingToggle] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    couponId: "",
    probabilityWeight: 1,
    displayOrder: 0,
    enabled: true
  });

  // 1. Fetch data on mount
  useEffect(() => {
    fetchSettings();
    fetchPrizes();
    fetchCoupons();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/spin-win/settings");
      const data = await res.json();
      if (data.success) {
        setFeatureEnabled(data.enabled);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const fetchPrizes = async () => {
    try {
      setLoadingPrizes(true);
      const res = await fetch("/api/admin/spin-win/prizes");
      const data = await res.json();
      if (data.success) {
        setPrizes(data.data);
      }
    } catch (err) {
      console.error("Failed to load prizes:", err);
    } finally {
      setLoadingPrizes(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const res = await fetch("/api/admin/coupons?isActive=true");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch(`/api/admin/spin-win/history?page=${page}&limit=10`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.data);
        setMetrics(data.metrics);
        setTotalPages(data.pagination.pages || 1);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // 2. Actions
  const handleToggleFeature = async () => {
    try {
      setSubmittingToggle(true);
      const targetState = !featureEnabled;
      const res = await fetch("/api/admin/spin-win/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: targetState }),
      });
      const data = await res.json();
      if (data.success) {
        setFeatureEnabled(data.enabled);
      }
    } catch (err) {
      console.error("Failed to toggle settings:", err);
    } finally {
      setSubmittingToggle(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPrize(null);
    setFormData({
      title: "",
      couponId: "",
      probabilityWeight: 1,
      displayOrder: prizes.length,
      enabled: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prize: Prize) => {
    setEditingPrize(prize);
    setFormData({
      title: prize.title,
      couponId: prize.couponId || "",
      probabilityWeight: prize.probabilityWeight,
      displayOrder: prize.displayOrder,
      enabled: prize.enabled
    });
    setIsModalOpen(true);
  };

  const handleSubmitPrize = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingPrize ? "PATCH" : "POST";
    const body = editingPrize ? { ...formData, id: editingPrize._id } : formData;

    try {
      const res = await fetch("/api/admin/spin-win/prizes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        fetchPrizes();
        setIsModalOpen(false);
      } else {
        alert(data.message || "Failed to save prize.");
      }
    } catch (err) {
      console.error("Error saving prize:", err);
    }
  };

  const handleDeletePrize = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prize slice?")) return;
    try {
      const res = await fetch(`/api/admin/spin-win/prizes?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchPrizes();
      } else {
        alert(data.message || "Failed to delete prize.");
      }
    } catch (err) {
      console.error("Error deleting prize:", err);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Feature Center</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Fortune <span className="not-italic text-brand-text/20 dark:text-white/20">Wheel</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Feature Toggle Card */}
          <button 
            disabled={submittingToggle}
            onClick={handleToggleFeature}
            className={cn(
              "flex items-center space-x-3 bg-white dark:bg-white/5 px-6 py-3 border rounded-[24px] text-xs font-bold uppercase tracking-wider transition-all",
              featureEnabled 
                ? "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/5" 
                : "border-red-500/30 text-red-500 hover:bg-red-500/5"
            )}
          >
            {submittingToggle ? (
              <Loader2 size={16} className="animate-spin" />
            ) : featureEnabled ? (
              <ToggleRight size={22} className="text-emerald-500" />
            ) : (
              <ToggleLeft size={22} className="text-red-500" />
            )}
            <span>Status: {featureEnabled ? "Active" : "Disabled"}</span>
          </button>

          {/* Add New Slice button */}
          <button
            onClick={handleOpenCreateModal}
            className="h-[50px] px-6 bg-brand-gold text-[#12100e] rounded-[24px] font-bold text-[11px] uppercase tracking-widest shadow-premium hover:scale-102 active:scale-98 transition-all flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>New Slice</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-white/5 border border-brand-text/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 text-brand-gold mb-2">
            <RotateCcw size={18} />
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 dark:text-white/40">Total Spins</span>
          </div>
          <p className="text-2xl font-black text-brand-text dark:text-white">{metrics.totalSpins}</p>
          <p className="text-[9px] text-brand-text/40 dark:text-white/30 mt-1">
            {metrics.uniqueParticipants} Unique Users
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-brand-text/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 text-brand-gold mb-2">
            <Ticket size={18} />
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 dark:text-white/40">Wins Generated</span>
          </div>
          <p className="text-2xl font-black text-brand-text dark:text-white">{metrics.couponWins}</p>
          <p className="text-[9px] text-brand-text/40 dark:text-white/30 mt-1">
            Win Rate: <span className="font-bold text-[#D4AF37]">{metrics.winRate}%</span>
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-brand-text/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 text-brand-gold mb-2">
            <CheckCircle2 size={18} />
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 dark:text-white/40">Claimed Wins</span>
          </div>
          <p className="text-2xl font-black text-brand-text dark:text-white">{metrics.claimedWins}</p>
          <p className="text-[9px] text-brand-text/40 dark:text-white/30 mt-1">
            Claim Rate: {metrics.couponWins > 0 ? ((metrics.claimedWins / metrics.couponWins) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 border border-brand-text/5 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 text-emerald-500 mb-2">
            <TrendingUp size={18} />
            <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 dark:text-white/40">Orders Checked Out</span>
          </div>
          <p className="text-2xl font-black text-brand-text dark:text-white">{metrics.redemptions}</p>
          <p className="text-[9px] text-brand-text/40 dark:text-white/30 mt-1">
            Redeem Rate: <span className="font-bold text-emerald-500">{metrics.redemptionRate}%</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Wheel Prizes Configuration Block */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-white/5 rounded-3xl border border-brand-text/5 p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-brand-text/5 pb-4">
              <h3 className="font-serif text-lg font-bold text-brand-text dark:text-white">Wheel Slices ({prizes.length})</h3>
              <span className="text-[10px] text-brand-text/45 uppercase tracking-wider">Sorted by display order</span>
            </div>

            {loadingPrizes ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="animate-spin text-brand-gold" size={24} />
                <span className="text-[9px] text-brand-text/30 uppercase tracking-widest">Loading wheel structure...</span>
              </div>
            ) : prizes.length === 0 ? (
              <div className="py-20 text-center text-brand-text/40 text-xs">
                No wheel slices configured yet. Create a slice to begin.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {prizes.map((prize, idx) => (
                  <div 
                    key={prize._id} 
                    className={cn(
                      "flex items-center justify-between p-4 bg-brand-bg dark:bg-white/2 rounded-2xl border transition-all duration-300",
                      prize.enabled ? "border-brand-gold/15" : "border-brand-text/5 opacity-55"
                    )}
                  >
                    <div className="space-y-1.5 max-w-[70%]">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#1e1b18] text-[#D4AF37] font-mono text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <h4 className="font-medium text-sm text-brand-text dark:text-white truncate">{prize.title}</h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 items-center text-[10px] text-brand-text/40 font-bold uppercase tracking-wider pl-7">
                        {prize.couponCode ? (
                          <span className="inline-flex items-center gap-1 text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded-full border border-brand-gold/10">
                            <Ticket size={10} /> {prize.couponCode}
                          </span>
                        ) : (
                          <span className="text-gray-400">Better Luck Next Time</span>
                        )}
                        <span>Weight: {prize.probabilityWeight}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenEditModal(prize)}
                        className="p-2 hover:bg-brand-gold/10 rounded-lg text-brand-text/60 hover:text-brand-gold transition-all"
                        title="Edit prize"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeletePrize(prize._id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-brand-text/60 hover:text-red-500 transition-all"
                        title="Delete prize"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Spin History Log Block */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-white/5 rounded-3xl border border-brand-text/5 p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-brand-text/5 pb-4">
              <h3 className="font-serif text-lg font-bold text-brand-text dark:text-white">Activity Log</h3>
              <span className="text-[10px] text-brand-text/45 uppercase tracking-wider">Recent spin events</span>
            </div>

            {loadingHistory ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="animate-spin text-brand-gold" size={24} />
                <span className="text-[9px] text-brand-text/30 uppercase tracking-widest">Loading history ledger...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="py-20 text-center text-brand-text/40 text-xs">
                No activity registered yet.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                  {history.map((attempt) => (
                    <div key={attempt._id} className="p-3 bg-brand-bg/50 dark:bg-white/1 rounded-xl border border-brand-text/5 flex items-center justify-between text-xs">
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-brand-text/45" />
                          <span className="font-bold text-brand-text dark:text-white truncate">
                            {attempt.userId ? attempt.userId.name : "Guest"}
                          </span>
                          {attempt.userId && (
                            <span className="text-[9px] text-brand-text/40 truncate">({attempt.userId.email})</span>
                          )}
                        </div>
                        <div className="text-[10px] text-brand-text/40 pl-5">
                          <span>IP: {attempt.ipAddress}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(attempt.createdAt).toLocaleString("en-IN", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold",
                          attempt.couponCode ? "bg-brand-gold/10 text-brand-gold" : "bg-gray-200 text-gray-500"
                        )}>
                          {attempt.couponCode || "No Win"}
                        </span>
                        <div className="text-[9px] text-brand-text/40 mt-1">
                          {attempt.claimed ? (
                            <span className="text-emerald-500 font-bold uppercase tracking-widest">Claimed</span>
                          ) : (
                            <span className="text-amber-500 font-bold uppercase tracking-widest">Unclaimed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-2 border-t border-brand-text/5">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1 bg-brand-bg dark:bg-white/5 border border-brand-text/5 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-brand-gold hover:text-black transition-all disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="text-[10px] uppercase tracking-wider text-brand-text/40 font-bold">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 bg-brand-bg dark:bg-white/5 border border-brand-text/5 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-brand-gold hover:text-black transition-all disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Prize Slice Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-[#12100e]/85 backdrop-blur-md" 
            onClick={() => setIsModalOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1614] rounded-[40px] shadow-2xl overflow-hidden p-8 sm:p-10 border border-brand-text/10 dark:border-white/10">
            <h2 className="text-2xl font-serif font-bold text-brand-text dark:text-white italic mb-6">
              {editingPrize ? "Edit" : "Create"} <span className="not-italic text-brand-text/20">Wheel Slice</span>
            </h2>

            <form onSubmit={handleSubmitPrize} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Slice Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-3.5 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold outline-none"
                  placeholder="e.g. 10% OFF VOUCHER"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Associated Coupon</label>
                  <span className="text-[8px] text-brand-text/30 font-bold uppercase">(Leave empty for lose/better-luck slices)</span>
                </div>
                {loadingCoupons ? (
                  <div className="flex items-center space-x-2 text-xs py-2">
                    <Loader2 size={12} className="animate-spin text-brand-gold" />
                    <span>Fetching active coupons...</span>
                  </div>
                ) : (
                  <select
                    value={formData.couponId}
                    onChange={(e) => setFormData({...formData, couponId: e.target.value})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-3.5 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold outline-none"
                  >
                    <option value="">-- No Coupon Mapped --</option>
                    {coupons.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.code} ({c.discountType === "percentage" ? `${c.discountValue}%` : `₹${c.discountValue}`} Off)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Weight</label>
                    <div className="relative group cursor-pointer text-brand-text/40 hover:text-brand-gold transition-colors">
                      <HelpCircle size={10} />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-[#12100e] text-white text-[8px] rounded p-2 w-[180px] hidden group-hover:block z-30 font-bold uppercase tracking-wider leading-relaxed shadow-lg">
                        Probability scale. Higher weights mean a higher chance of landing on this slice. (e.g. 10 weight vs 1 weight).
                      </div>
                    </div>
                  </div>
                  <input 
                    type="number" 
                    min="0"
                    step="any"
                    value={formData.probabilityWeight}
                    onChange={(e) => setFormData({...formData, probabilityWeight: Number(e.target.value)})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-3.5 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold outline-none"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Display Order</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})}
                    className="w-full bg-brand-bg dark:bg-white/5 border border-brand-text/5 dark:border-white/10 rounded-2xl py-3.5 px-6 text-[14px] font-bold text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  id="slice-enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                  className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold h-4 w-4"
                />
                <label htmlFor="slice-enabled" className="text-xs font-bold text-brand-text dark:text-white uppercase tracking-wider cursor-pointer">
                  Slice enabled on wheel
                </label>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 bg-brand-bg dark:bg-white/5 text-brand-text/40 dark:text-white/40 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-brand-text hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-3.5 bg-brand-gold text-[#12100e] rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-premium hover:bg-[#B4925A] transition-all"
                >
                  {editingPrize ? "Update Slice" : "Launch Slice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

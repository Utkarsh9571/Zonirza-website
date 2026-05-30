"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { 
  Ticket, 
  Loader2, 
  ChevronLeft, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Gift
} from "lucide-react";
import { Section } from "@/components/new-ui/Section";
import { Button } from "@/components/new-ui/Button";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CustomerRewardsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "redeemed" | "expired">("all");

  const { data: rewardsRes, error, isLoading } = useSWR(
    status === "authenticated" ? "/api/spin-win/rewards" : null,
    fetcher
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold h-12 w-12" />
      </div>
    );
  }

  if (error || (rewardsRes && !rewardsRes.success)) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 text-center text-red-500 font-serif">
        Failed to load rewards. Please refresh or try again.
      </div>
    );
  }

  const allRewards = rewardsRes?.data || [];

  // Filter rewards
  const filteredRewards = allRewards.filter((reward: any) => {
    if (filter === "all") return true;
    return reward.status === filter;
  });

  const getStatusBadge = (rewardStatus: string) => {
    switch (rewardStatus) {
      case "active":
        return (
          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> Active
          </span>
        );
      case "redeemed":
        return (
          <span className="px-3 py-1 bg-brand-text/10 text-brand-text/50 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> Used
          </span>
        );
      case "expired":
        return (
          <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
            <XCircle size={10} /> Expired
          </span>
        );
      case "inactive":
        return (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
            <Clock size={10} /> Paused
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 overflow-x-hidden transition-colors duration-500 font-sans">
      <Section className="max-w-[1200px] mx-auto px-4 md:px-6 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => router.push("/account")}
          className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text transition-colors"
        >
          <ChevronLeft size={14} />
          <span>My Profile</span>
        </button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-serif text-brand-text">My Rewards</h1>
            <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Vouchers and prizes won via the fortune wheel</p>
          </div>
          
          <Button 
            variant="primary" 
            onClick={() => router.push("/spin-win")}
            className="shadow-premium px-8 flex items-center gap-2"
          >
            <span>Play Lucky Wheel</span>
            <ArrowRight size={14} />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1614] text-white rounded-3xl p-6 shadow-premium relative overflow-hidden flex flex-col justify-between min-h-[140px]">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Ticket size={120} />
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-white/50 font-bold mb-1">Total Rewards Won</p>
              <p className="text-3xl font-serif text-brand-gold">{allRewards.length}</p>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-white/40">Across all 24h spins</p>
          </div>

          <div className="bg-white dark:bg-brand-white rounded-3xl p-6 border border-brand-text/5 shadow-soft flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold mb-1">Active Coupons</p>
              <p className="text-3xl font-serif text-brand-text">
                {allRewards.filter((r: any) => r.status === "active").length}
              </p>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-brand-text/30">Ready to use at checkout</p>
          </div>

          <div className="bg-white dark:bg-brand-white rounded-3xl p-6 border border-brand-text/5 shadow-soft flex flex-col justify-between min-h-[140px]">
            <div>
              <p className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold mb-1">Redeemed Vouchers</p>
              <p className="text-3xl font-serif text-brand-text">
                {allRewards.filter((r: any) => r.status === "redeemed").length}
              </p>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-brand-text/30">Used on previous orders</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 border-t border-brand-text/5 pt-6">
          <span className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 mr-2">Filter By Status:</span>
          {(["all", "active", "redeemed", "expired"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold border transition-all",
                filter === s
                  ? "bg-brand-text dark:bg-brand-gold text-white border-transparent shadow-sm"
                  : "bg-white dark:bg-brand-white text-brand-text/60 border-brand-text/5 hover:border-brand-gold/30"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Rewards List */}
        <div className="space-y-6">
          {filteredRewards.length === 0 ? (
            <div className="py-20 bg-gradient-to-b from-white to-[#FAF9F6] dark:from-[#1C1A19] dark:to-[#121110] rounded-[32px] border border-brand-text/5 shadow-soft flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-brand-gold/5 flex items-center justify-center text-brand-gold border border-brand-gold/15">
                <Gift size={28} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-serif italic text-brand-text">No Vouchers Found</h3>
                <p className="text-[9px] uppercase tracking-widest text-brand-text/50 font-bold leading-relaxed">
                  {filter === "all"
                    ? "You haven't won any rewards yet. Play our luxury Lucky Wheel to spin for exclusive discounts!"
                    : `You don't have any rewards currently categorized as '${filter}'.`}
                </p>
              </div>
              {filter === "all" && (
                <Button 
                  onClick={() => router.push("/spin-win")}
                  className="shadow-premium px-8 text-[9px] tracking-widest uppercase !py-3"
                >
                  Spin the Wheel
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRewards.map((reward: any) => {
                const hasCouponDetails = !!reward.couponDetails;
                const details = reward.couponDetails;
                const isExpired = reward.status === "expired";
                const isRedeemed = reward.status === "redeemed";
                
                return (
                  <div 
                    key={reward._id}
                    className={cn(
                      "bg-white dark:bg-brand-white rounded-[32px] p-6 border shadow-soft hover:shadow-premium transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group",
                      isExpired || isRedeemed ? "border-brand-text/5 opacity-70" : "border-brand-gold/25"
                    )}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[8px] uppercase tracking-widest font-black text-brand-gold">
                          Fortune Reward
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-bold tracking-widest uppercase text-brand-text">
                            {reward.couponCode}
                          </span>
                          <button
                            onClick={() => copyToClipboard(reward.couponCode)}
                            className="text-brand-text/30 hover:text-brand-gold transition-colors p-1 hover:bg-brand-bg rounded"
                            title="Copy code"
                          >
                            {copiedCode === reward.couponCode ? (
                              <Check size={12} className="text-green-500" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                      {getStatusBadge(reward.status)}
                    </div>

                    {/* Offer Value Details */}
                    {hasCouponDetails ? (
                      <div className="bg-brand-bg/40 border border-brand-text/5 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">Reward Discount</p>
                          <h3 className="text-xl font-serif font-black italic mt-0.5 text-brand-text">
                            {details.discountType === "percentage" 
                              ? `${details.discountValue}% OFF` 
                              : `₹${details.discountValue.toLocaleString("en-IN")} OFF`}
                          </h3>
                        </div>
                        {details.minCartValue > 0 && (
                          <div className="text-right">
                            <p className="text-[8px] uppercase tracking-widest text-brand-text/40 font-bold">Min Purchase Required</p>
                            <p className="text-xs font-bold text-brand-text/60 mt-0.5">
                              ₹{details.minCartValue.toLocaleString("en-IN")}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-brand-bg/40 border border-brand-text/5 rounded-2xl p-4 text-center">
                        <p className="text-xs text-brand-text/50 font-medium">Coupon configuration loaded successfully</p>
                      </div>
                    )}

                    {/* Expiration and Won At details */}
                    <div className="grid grid-cols-2 gap-4 text-[9px] font-bold uppercase tracking-widest border-t border-brand-text/5 pt-4">
                      <div>
                        <span className="text-brand-text/30">Won On</span>
                        <p className="text-brand-text dark:text-brand-text/90 mt-1">
                          {new Date(reward.wonAt).toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <span className="text-brand-text/30">
                          {isRedeemed ? "Redeemed" : isExpired ? "Expired On" : "Valid Until"}
                        </span>
                        <p className="text-brand-text dark:text-brand-text/90 mt-1 flex items-center gap-1">
                          <Calendar size={12} className="text-brand-gold" />
                          {hasCouponDetails 
                            ? new Date(details.expirationDate).toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" })
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Apply Discount Helper Button */}
                    {!isExpired && !isRedeemed && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          copyToClipboard(reward.couponCode);
                          router.push("/products");
                        }}
                        className="w-full text-[8px] uppercase tracking-widest !py-2 shadow-sm font-black"
                      >
                        Copy & Shop Now
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </Section>
    </div>
  );
}

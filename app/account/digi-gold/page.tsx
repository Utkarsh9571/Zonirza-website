'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { Loader2, TrendingUp, TrendingDown, Coins, Calendar, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ShoppingBag, Star, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1614] border border-brand-text/10 p-4 rounded-xl shadow-premium">
        <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">{label}</p>
        <p className="text-brand-gold text-lg font-serif">₹{payload[0].value.toLocaleString()}</p>
        {payload[1] && (
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">Invested: ₹{payload[1].value.toLocaleString()}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function UserDigiGold() {
  const { data: walletData, error: walletError, isLoading: walletLoading } = useSWR('/api/digi-gold/wallet', fetcher);
  const { data: chartData, isLoading: chartLoading } = useSWR('/api/digi-gold/analytics', fetcher);
  const { data: sipData, isLoading: sipLoading } = useSWR('/api/digi-gold/sip', fetcher);
  const { data: milestoneData } = useSWR('/api/digi-gold/milestones', fetcher);

  const [timeRange, setTimeRange] = useState('30D');

  if (walletLoading) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold h-12 w-12" />
      </div>
    );
  }

  if (walletError || !walletData?.success) {
    return (
      <div className="bg-brand-bg min-h-screen pt-32 text-center text-red-500">
        Failed to load Digi Gold wallet.
      </div>
    );
  }

  const { wallet, transactions, valuation, liveRate } = walletData;
  const isPositiveGrowth = valuation.percentageGrowth >= 0;

  const handlePayInstallment = async (installmentId: string, sipId: string) => {
    try {
      const res = await fetch(`/api/digi-gold/sip/${sipId}/installment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installmentId })
      });
      const data = await res.json();

      if (data.success) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: 'INR',
          name: 'Luxury Jewelry',
          description: 'SIP Installment Payment',
          order_id: data.razorpayOrderId,
          handler: function (response: any) {
            window.location.reload();
          },
          theme: { color: '#D4AF37' }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initiate payment');
    }
  };

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 overflow-x-hidden">
      <Section className="max-w-[1200px] mx-auto px-4 md:px-6 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif text-brand-text">My Portfolio</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-text/60 font-bold">Live Rate:</span>
              <span className="text-sm font-bold text-brand-gold">₹{liveRate?.sellRate24K?.toLocaleString()} / g</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/account/digi-gold/report">
              <Button variant="outline" className="shadow-soft px-4 border-brand-text/10 text-brand-text hover:bg-brand-bg transition-colors" title="Download Statement">
                <FileText size={18} />
              </Button>
            </Link>
            <Link href="/digi-gold/sip">
              <Button variant="outline" className="shadow-soft px-8 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white">Start SIP</Button>
            </Link>
            <Link href="/digi-gold">
              <Button variant="primary" className="shadow-premium px-8">Buy One-Time</Button>
            </Link>
          </div>
        </div>

        {wallet.totalGrams === 0 ? (
          <div className="py-24 bg-white rounded-[40px] border border-brand-text/5 shadow-soft flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-brand-bg flex items-center justify-center text-brand-gold/30">
              <Coins size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif italic text-brand-text">Begin Your Legacy</h3>
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-brand-text/30 max-w-[250px] leading-relaxed">
                Start your premium digital gold journey with as little as ₹100.
              </p>
            </div>
            <Link href="/digi-gold" className="pt-4">
              <Button variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white px-10 transition-colors">Start Saving</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Top Metrics & Chart */}
            <div className="lg:col-span-2 space-y-8">

              {/* Premium Valuation Card */}
              <div className="bg-[#1a1614] rounded-[40px] p-8 md:p-10 text-white shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Coins size={200} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                  <div>
                    <h3 className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2">Total Portfolio Value</h3>
                    <div className="flex items-end gap-4">
                      <div className="text-5xl md:text-6xl font-serif text-brand-gold">
                        ₹{valuation.currentValue.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-md ${isPositiveGrowth ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isPositiveGrowth ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {Math.abs(valuation.percentageGrowth)}%
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40">Since inception</span>
                    </div>
                  </div>

                  <div className="flex gap-8 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Grams</p>
                      <p className="text-xl font-bold">{wallet.totalGrams.toFixed(4)} <span className="text-brand-gold text-sm">g</span></p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1">Invested</p>
                      <p className="text-xl font-bold">₹{valuation.totalInvested.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white rounded-[40px] p-8 border border-brand-text/5 shadow-soft">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-serif">Performance History</h3>
                  <div className="flex gap-2">
                    {['7D', '30D', 'YTD'].map(range => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-full transition-colors ${timeRange === range ? 'bg-brand-text text-white' : 'bg-brand-bg text-brand-text/50 hover:bg-brand-text/5'}`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  {chartLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Activity className="animate-pulse text-brand-gold/30 h-10 w-10" />
                    </div>
                  ) : chartData?.data && chartData.data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        <Area type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorInvested)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-brand-text/40">
                      Not enough data to display chart.
                    </div>
                  )}
                </div>
              </div>

              {/* Active SIP Section */}
              {!sipLoading && sipData?.sips?.length > 0 && (
                <div className="bg-[#1a1614] rounded-[40px] p-8 border border-brand-gold/20 shadow-premium text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 opacity-5 w-48 h-48 rounded-full border-[20px] border-brand-gold" />
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-xl font-serif text-brand-gold">Active SIPs</h3>
                    <Link href="/digi-gold/sip" className="text-[10px] uppercase tracking-widest font-bold text-white hover:text-brand-gold">New SIP</Link>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {sipData.sips.map((sip: any) => (
                      <div key={sip._id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-bold text-sm">{sip.goalName || 'Wealth SIP'}</p>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">₹{sip.monthlyAmount.toLocaleString()} / month</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${sip.status === 'active' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-white/10 text-white/50'}`}>
                              {sip.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end border-t border-white/5 pt-4">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Accumulated</p>
                            <p className="text-sm font-bold">{sip.totalGramsAccumulated.toFixed(4)} g</p>
                          </div>
                          {sipData.upcomingInstallments?.find((i: any) => i.sipId === sip._id) && (
                            <Button
                              size="sm"
                              onClick={() => handlePayInstallment(sipData.upcomingInstallments.find((i: any) => i.sipId === sip._id)._id, sip._id)}
                              className="text-[10px] h-8 px-4"
                            >
                              Pay Installment
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Transactions & Insights */}
            <div className="space-y-8">

              {/* Intelligence Summary */}
              <div className="bg-brand-gold/5 rounded-[30px] p-6 border border-brand-gold/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Star size={100} /></div>
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-brand-gold mb-4 relative z-10">Portfolio Insights</h4>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center pb-4 border-b border-brand-gold/10">
                    <span className="text-sm font-medium text-brand-text/70">Avg. Cost / Gram</span>
                    <span className="text-sm font-bold">₹{valuation.averageAcquisitionCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-brand-gold/10">
                    <span className="text-sm font-medium text-brand-text/70">Unrealized Gain</span>
                    <span className={`text-sm font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                      {valuation.unrealizedGainLoss > 0 ? '+' : ''}₹{valuation.unrealizedGainLoss.toLocaleString()}
                    </span>
                  </div>

                  {chartData?.insights?.map((insight: string, idx: number) => (
                    <div key={idx} className="p-3 bg-white dark:bg-[#1a1614] rounded-xl border border-brand-gold/10 text-xs text-brand-text/80 shadow-soft">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              {milestoneData?.milestones?.length > 0 && (
                <div className="bg-white rounded-[30px] p-6 border border-brand-text/5 shadow-soft">
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-brand-text/50 mb-4">Milestones Achieved</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {milestoneData.milestones.map((m: any) => (
                      <div key={m._id} className="flex flex-col items-center justify-center p-4 bg-brand-bg rounded-2xl text-center border border-brand-text/5">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center mb-2">
                          <Star size={16} className="text-brand-gold" />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest">{m.type.replace(/_/g, ' ')}</p>
                        <p className="text-[8px] text-brand-text/40 mt-1">{new Date(m.achievedAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              <div className="bg-white rounded-[40px] p-6 border border-brand-text/5 shadow-soft flex-1 flex flex-col max-h-[500px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif">Recent Activity</h3>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:underline">View All</button>
                </div>

                <div className="overflow-y-auto pr-2 custom-scrollbar space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-sm text-brand-text/50 text-center py-10">No recent transactions.</p>
                  ) : (
                    transactions.map((tx: any) => (
                      <div key={tx._id} className="p-4 rounded-2xl border border-brand-text/5 hover:border-brand-text/10 transition-colors group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'buy' ? 'bg-green-50 text-green-600' :
                                tx.type === 'redeem' ? 'bg-brand-gold/10 text-brand-gold' :
                                  'bg-brand-bg text-brand-text/50'
                              }`}>
                              {tx.type === 'buy' ? <TrendingUp size={16} /> :
                                tx.type === 'redeem' ? <ShoppingBag size={16} /> :
                                  <Calendar size={16} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold uppercase tracking-widest">{tx.type} GOLD</p>
                              <p className="text-[9px] text-brand-text/40 font-bold uppercase tracking-widest mt-0.5">{new Date(tx.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-brand-text">₹{tx.rupeeAmount.toLocaleString()}</p>
                            <p className={cn(
                              "text-[10px] font-bold",
                              tx.type === 'redeem' ? 'text-brand-text/60' : 'text-brand-gold'
                            )}>
                              {tx.type === 'redeem' ? '-' : '+'}{tx.goldGrams.toFixed(4)} g
                            </p>
                          </div>
                        </div>

                        {/* Transaction Details Enhancements */}
                        {tx.type === 'redeem' && tx.linkedOrderId && (
                          <div className="pt-3 border-t border-brand-text/5 mt-2">
                            <Link href={`/account/orders`} className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:underline flex items-center">
                              <ArrowUpRight size={10} className="mr-1" /> View Linked Order
                            </Link>
                          </div>
                        )}

                        {/* Transaction Performance Enrichments */}
                        {tx.performance && (
                          <div className="pt-3 border-t border-brand-text/5 flex justify-between items-center bg-brand-bg/50 px-3 py-2 rounded-xl">
                            <span className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40">Purchased at: ₹{tx.goldRateAtExecution.toLocaleString()}</span>
                            <span className={`text-[10px] font-bold ${tx.performance.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.performance.growth > 0 ? '+' : ''}{tx.performance.growth}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

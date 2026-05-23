'use client';

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ShieldAlert, CheckCircle2, ShieldCheck, Clock, Loader2, TrendingUp, Users, Coins, Activity, Target } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1614] border border-brand-text/10 p-4 rounded-xl shadow-premium">
        <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">{label}</p>
        <p className="text-brand-gold text-lg font-serif">₹{payload[0].value.toLocaleString()} / g</p>
      </div>
    );
  }
  return null;
};

export default function AdminDigiGold() {
  const { data: rateData, isLoading: rateLoading } = useSWR('/api/admin/digi-gold/rate', fetcher);
  const { data: walletData, isLoading: walletLoading } = useSWR('/api/admin/digi-gold/wallets', fetcher);
  const { data: sipData, isLoading: sipLoading } = useSWR('/api/admin/digi-gold/sip', fetcher);
  const { data: auditData, mutate: mutateAudit } = useSWR('/api/admin/digi-gold/audit-logs', fetcher);

  const [buyRate, setBuyRate] = useState('');
  const [sellRate, setSellRate] = useState('');
  const [spread, setSpread] = useState('0');
  const [gst, setGst] = useState('3');
  const [saving, setSaving] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [reconciliationReport, setReconciliationReport] = useState<any>(null);

  const handleRunReconciliation = async () => {
    if (!confirm('Run global ledger reconciliation? This may take a moment.')) return;
    setReconciling(true);
    try {
      const res = await fetch('/api/admin/digi-gold/reconcile', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setReconciliationReport(data.report);
        mutateAudit();
      } else {
        alert('Failed: ' + data.error);
      }
    } catch (err) {
      alert('Error running reconciliation');
    } finally {
      setReconciling(false);
    }
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/digi-gold/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyRate24K: Number(buyRate),
          sellRate24K: Number(sellRate),
          spread: Number(spread),
          gst: Number(gst),
          active: true
        })
      });
      if (res.ok) {
        mutate('/api/admin/digi-gold/rate');
        setBuyRate('');
        setSellRate('');
        alert('Rate updated successfully!');
      } else {
        alert('Failed to update rate');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving rate');
    } finally {
      setSaving(false);
    }
  };

  if (rateLoading || walletLoading || sipLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-brand-gold h-8 w-8" /></div>;
  }

  const rates = rateData?.data || [];
  const currentRate = rates.find((r: any) => r.active);
  const stats = walletData?.data?.stats || { totalWallets: 0, totalGrams: 0, totalInvestment: 0 };
  const transactions = walletData?.data?.recentTransactions || [];
  const sipStats = sipData?.stats || { totalActiveSIPs: 0, projectedMonthlyRevenue: 0 };
  const sips = sipData?.sips || [];
  const auditLogs = auditData?.logs || [];

  // Format rates for chart
  const rateChartData = [...rates]
    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((r: any) => ({
      date: new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      buyRate: r.buyRate24K,
      sellRate: r.sellRate24K
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-text dark:text-white">Digi Gold Intelligence</h1>
          <p className="text-brand-text/60 mt-1">Platform analytics, valuation, and live rate control.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-brand-text/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70">Total Active Wallets</h3>
            <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center"><Users className="h-4 w-4 text-brand-gold" /></div>
          </div>
          <div className="text-3xl font-serif text-brand-text dark:text-white mb-1">{stats.totalWallets}</div>
        </div>
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-brand-text/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70">Platform Gold Held</h3>
            <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center"><TrendingUp className="h-4 w-4 text-brand-gold" /></div>
          </div>
          <div className="text-3xl font-serif text-brand-text dark:text-white mb-1">{stats.totalGrams.toFixed(4)} <span className="text-lg">g</span></div>
        </div>
        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-brand-text/10 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] uppercase tracking-widest font-bold text-brand-text/70">Total Platform Investment</h3>
            <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center"><Coins className="h-4 w-4 text-brand-gold" /></div>
          </div>
          <div className="text-3xl font-serif text-brand-text dark:text-white mb-1">₹{stats.totalInvestment.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-gold/10 p-6 rounded-2xl border border-brand-gold/20 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mb-4"><Target className="h-6 w-6 text-brand-gold" /></div>
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-brand-gold mb-1">Active SIPs</h3>
          <div className="text-4xl font-serif text-brand-text dark:text-white">{sipStats.totalActiveSIPs}</div>
        </div>
        <div className="bg-brand-gold/10 p-6 rounded-2xl border border-brand-gold/20 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mb-4"><TrendingUp className="h-6 w-6 text-brand-gold" /></div>
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-brand-gold mb-1">Monthly SIP Revenue</h3>
          <div className="text-4xl font-serif text-brand-text dark:text-white">₹{sipStats.projectedMonthlyRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-brand-gold/10 p-6 rounded-2xl border border-brand-gold/20 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center mb-4"><Coins className="h-6 w-6 text-brand-gold" /></div>
          <h3 className="text-[11px] uppercase tracking-widest font-bold text-brand-gold mb-1">Avg Portfolio Size</h3>
          <div className="text-4xl font-serif text-brand-text dark:text-white">
            {stats.totalWallets > 0 ? (stats.totalGrams / stats.totalWallets).toFixed(2) : 0}g
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Rate Setting & Current Rate */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-[30px] border border-brand-text/10 shadow-sm flex flex-col">
          <h2 className="text-xl font-serif mb-6">Market Rate Control</h2>
          
          <div className="mb-8 p-6 bg-brand-gold/5 rounded-2xl border border-brand-gold/20 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Active Buy Rate (24K)</p>
              <p className="text-3xl font-serif text-brand-gold mt-1">₹{currentRate?.buyRate24K || '---'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Active Sell Rate</p>
              <p className="text-2xl font-serif text-brand-text mt-1">₹{currentRate?.sellRate24K || '---'}</p>
            </div>
          </div>

          <form onSubmit={handleSaveRate} className="space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">New Buy Rate (₹)</label>
                <input type="number" required value={buyRate} onChange={(e) => setBuyRate(e.target.value)} className="w-full px-4 h-12 bg-brand-bg border border-brand-text/10 rounded-xl focus:border-brand-gold outline-none transition-colors" placeholder="e.g. 7100" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">New Sell Rate (₹)</label>
                <input type="number" required value={sellRate} onChange={(e) => setSellRate(e.target.value)} className="w-full px-4 h-12 bg-brand-bg border border-brand-text/10 rounded-xl focus:border-brand-gold outline-none transition-colors" placeholder="e.g. 6950" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Spread (%)</label>
                <input type="number" value={spread} onChange={(e) => setSpread(e.target.value)} className="w-full px-4 h-12 bg-brand-bg border border-brand-text/10 rounded-xl focus:border-brand-gold outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">GST (%)</label>
                <input type="number" value={gst} onChange={(e) => setGst(e.target.value)} className="w-full px-4 h-12 bg-brand-bg border border-brand-text/10 rounded-xl focus:border-brand-gold outline-none transition-colors" />
              </div>
            </div>
            <button disabled={saving} type="submit" className="w-full h-14 bg-brand-text text-white font-bold text-[12px] uppercase tracking-widest rounded-xl hover:bg-brand-gold transition-colors flex items-center justify-center">
              {saving ? <Loader2 className="animate-spin" size={20} /> : 'Publish New Rate'}
            </button>
            <p className="text-[10px] text-center text-brand-text/40">Publishing a new rate automatically archives the old rate.</p>
          </form>
        </div>

        {/* Rate History Chart */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-[30px] border border-brand-text/10 shadow-sm flex flex-col">
          <h2 className="text-xl font-serif mb-6">Historical Rate Trends</h2>
          
          <div className="h-[300px] w-full mt-4">
            {rateChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rateChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} dy={10} minTickGap={30} />
                  <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="buyRate" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorBuy)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-brand-text/40 border-2 border-dashed border-brand-text/10 rounded-2xl">
                <Activity size={32} className="mb-2 opacity-50" />
                <span className="text-xs">No historical rates found</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-[#111] p-8 rounded-[30px] border border-brand-text/10 shadow-sm overflow-hidden">
        <h2 className="text-xl font-serif mb-6">Recent Platform Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-brand-text/10">
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">User</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Type</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Amount</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Grams</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Exec. Rate</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-text/5">
              {transactions.slice(0, 10).map((tx: any) => (
                <tr key={tx._id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="py-4 px-4 font-medium">{tx.userId?.name || tx.userId?.email || 'Unknown'}</td>
                  <td className={`py-4 px-4 uppercase text-[10px] font-bold tracking-widest ${tx.type === 'buy' ? 'text-green-600' : 'text-brand-gold'}`}>{tx.type}</td>
                  <td className="py-4 px-4 font-bold">₹{tx.rupeeAmount.toLocaleString()}</td>
                  <td className="py-4 px-4 font-medium">{tx.goldGrams.toFixed(4)}g</td>
                  <td className="py-4 px-4 text-brand-text/70 text-xs">₹{tx.goldRateAtExecution.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-brand-text/50 text-sm">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIP Table */}
      <div className="bg-white dark:bg-[#111] p-8 rounded-[30px] border border-brand-text/10 shadow-sm overflow-hidden">
        <h2 className="text-xl font-serif mb-6">Active SIP Portfolios</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-brand-text/10">
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">User</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Monthly Amt</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Total Invested</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Grams Acc.</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Goal</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-bold text-brand-text/50">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-text/5">
              {sips.map((sip: any) => (
                <tr key={sip._id} className="hover:bg-brand-bg/50 transition-colors">
                  <td className="py-4 px-4 font-medium">{sip.userId?.name || sip.userId?.email || 'Unknown'}</td>
                  <td className="py-4 px-4 font-bold text-brand-text">₹{sip.monthlyAmount.toLocaleString()}</td>
                  <td className="py-4 px-4 font-bold text-brand-gold">₹{sip.totalInvested.toLocaleString()}</td>
                  <td className="py-4 px-4 font-medium">{sip.totalGramsAccumulated.toFixed(4)}g</td>
                  <td className="py-4 px-4 text-brand-text/70">{sip.goalName || 'General Wealth'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${sip.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-brand-text/10 text-brand-text/70'}`}>
                      {sip.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sips.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-brand-text/50 text-sm">No active SIPs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Ledger Reconciliation */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-[30px] border border-red-500/20 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5"><ShieldCheck size={120} /></div>
          <h2 className="text-xl font-serif mb-2 text-brand-text dark:text-white relative z-10">Ledger Reconciliation Engine</h2>
          <p className="text-[10px] uppercase tracking-widest text-brand-text/50 font-bold mb-6 relative z-10">Verify total balances against transaction history</p>
          
          <div className="flex-1">
            {reconciliationReport ? (
              <div className="bg-brand-bg rounded-2xl p-6 border border-brand-text/10 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center">
                  <CheckCircle2 size={16} className="text-green-500 mr-2" /> Scan Complete
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-brand-text/60">Wallets Scanned:</span>
                    <span className="font-bold">{reconciliationReport.totalWalletsScanned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text/60">Mismatches Found:</span>
                    <span className={`font-bold ${reconciliationReport.mismatchesFound > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {reconciliationReport.mismatchesFound}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-text/60">Stale Locks Released:</span>
                    <span className="font-bold">{reconciliationReport.staleLocksReleased}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-brand-bg/50 rounded-2xl p-6 border border-dashed border-brand-text/20 mb-6 text-center">
                <ShieldAlert size={32} className="text-brand-gold mx-auto mb-3 opacity-50" />
                <p className="text-sm text-brand-text/60">Run a global scan to detect anomalies, orphaned checkout locks, or wallet discrepancies.</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleRunReconciliation}
            disabled={reconciling}
            className="w-full h-14 bg-red-500/10 text-red-600 font-bold text-[12px] uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center relative z-10"
          >
            {reconciling ? <Loader2 className="animate-spin" size={20} /> : 'Initiate Global Audit'}
          </button>
        </div>

        {/* Financial Audit Logs */}
        <div className="bg-white dark:bg-[#111] p-8 rounded-[30px] border border-brand-text/10 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif text-brand-text dark:text-white">Security Audit Log</h2>
            <Clock size={20} className="text-brand-text/40" />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 max-h-[300px]">
            {auditLogs.length > 0 ? (
              <div className="space-y-4">
                {auditLogs.map((log: any) => (
                  <div key={log._id} className="p-4 rounded-xl border border-brand-text/5 bg-brand-bg/30 text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[10px] uppercase tracking-widest text-brand-gold">{log.action}</span>
                      <span className="text-[9px] uppercase tracking-widest text-brand-text/40">{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-brand-text/80"><span className="font-bold text-brand-text/50">Actor:</span> {log.actor}</span>
                      <span className="text-brand-text/80"><span className="font-bold text-brand-text/50">Entity:</span> {log.entityType}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-brand-text/40 text-sm">
                No audit logs found.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

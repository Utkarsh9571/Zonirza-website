'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Coins, 
  Ruler, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Gem,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPricingPage() {
  const [factors, setFactors] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPricingFactors();
  }, []);

  const fetchPricingFactors = async () => {
    try {
      const res = await fetch('/api/admin/pricing-rules');
      const data = await res.json();
      if (data.success) {
        setFactors(data.data || {});
      } else {
        setError(data.message || 'Failed to fetch pricing rules');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching pricing rules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const res = await fetch('/api/admin/pricing-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factors),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to save pricing rules');
      }
    } catch (err: any) {
      setError(err.message || 'Network error saving pricing rules');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateMetalRate = (metal: string, val: number) => {
    setFactors({
      ...factors,
      metalRates: {
        ...(factors?.metalRates || {}),
        [metal]: val
      }
    });
  };

  const updateStonePrice = (stone: string, val: number) => {
    setFactors({
      ...factors,
      stonePrices: {
        ...(factors?.stonePrices || {}),
        [stone]: val
      }
    });
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Opening Pricing Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Merchandising Operations</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Pricing Engine <span className="not-italic text-brand-text/20 dark:text-white/20">& Rates</span>
          </h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-3 px-10 py-4 bg-brand-gold text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium transition-all hover:scale-105 active:scale-95"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : (success ? <ShieldCheck size={18} /> : <Save size={18} />)}
          <span>{success ? 'Vault Locked' : (saving ? 'Syncing...' : 'Preserve Rates')}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center space-x-3">
          <AlertCircle className="text-red-500" size={18} />
          <p className="text-xs text-red-600 dark:text-red-400 font-bold">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center space-x-3">
          <ShieldCheck className="text-green-500" size={18} />
          <p className="text-xs text-green-600 dark:text-green-400 font-bold">Pricing rules preserved. Live catalog updated instantly!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Metal Rates Configuration */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Coins size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Base Metal Rates</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Base cost per gram (₹)</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Gold 24K (per gram)</label>
                <input 
                  type="number" 
                  value={factors?.metalRates?.gold24k ?? 6500}
                  onChange={(e) => updateMetalRate('gold24k', parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Silver (per gram)</label>
                <input 
                  type="number" 
                  value={factors?.metalRates?.silver ?? 100}
                  onChange={(e) => updateMetalRate('silver', parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Platinum (per gram)</label>
                <input 
                  type="number" 
                  value={factors?.metalRates?.platinum ?? 4000}
                  onChange={(e) => updateMetalRate('platinum', parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Sizing Offsets */}
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Ruler size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Category Sizing Offsets</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Weight adjustments (grams per unit)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Rings (per size)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={factors?.ringsOffset ?? 0.12}
                  onChange={(e) => setFactors({ ...factors, ringsOffset: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Chains (per inch)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={factors?.chainsOffset ?? 0.25}
                  onChange={(e) => setFactors({ ...factors, chainsOffset: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Bracelets (per size)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={factors?.braceletsOffset ?? 0.15}
                  onChange={(e) => setFactors({ ...factors, braceletsOffset: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Bangles (per size)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={factors?.banglesOffset ?? 0.15}
                  onChange={(e) => setFactors({ ...factors, banglesOffset: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stone Rates & Tax */}
        <div className="space-y-8">
          {/* Diamond Quality Prices */}
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Diamond Quality Matrix</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Rate per carat (₹)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">EF-VVS</label>
                <input 
                  type="number" 
                  value={factors?.stonePrices?.['EF-VVS'] ?? 85000}
                  onChange={(e) => updateStonePrice('EF-VVS', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">GH-VS</label>
                <input 
                  type="number" 
                  value={factors?.stonePrices?.['GH-VS'] ?? 65000}
                  onChange={(e) => updateStonePrice('GH-VS', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">GHI-VS</label>
                <input 
                  type="number" 
                  value={factors?.stonePrices?.['GHI-VS'] ?? 55000}
                  onChange={(e) => updateStonePrice('GHI-VS', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">FG-SI</label>
                <input 
                  type="number" 
                  value={factors?.stonePrices?.['FG-SI'] ?? 45000}
                  onChange={(e) => updateStonePrice('FG-SI', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="col-span-2 space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">IJ-SI</label>
                <input 
                  type="number" 
                  value={factors?.stonePrices?.['IJ-SI'] ?? 35000}
                  onChange={(e) => updateStonePrice('IJ-SI', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
            </div>
          </div>

          {/* GST rate */}
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Percent size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Tax Configuration</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Government GST percentage</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">GST Rate (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={factors?.gstPercentage ?? 3}
                  onChange={(e) => setFactors({ ...factors, gstPercentage: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  Percent,
  ChevronDown,
  ChevronUp,
  Settings
} from 'lucide-react';

interface PricingFactorsType {
  metalRates?: Record<string, number>;
  diamondPrices?: Record<string, number>;
  gemstonePrices?: Record<string, number>;
  stonePrices?: Record<string, number>;
  purityMultipliers?: Record<string, number>;
  gstPercentage?: number;
  ringsOffset?: number;
  chainsOffset?: number;
  braceletsOffset?: number;
  banglesOffset?: number;
  sizeWeightOffset?: number;
}

export default function AdminPricingPage() {
  const [factors, setFactors] = useState<PricingFactorsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error fetching pricing rules';
      setError(msg);
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error saving pricing rules';
      setError(msg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateMetalRate = (metal: string, val: number) => {
    setFactors((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        metalRates: {
          ...(prev.metalRates || {}),
          [metal]: val
        }
      };
    });
  };

  const updateDiamondPrice = (grade: string, val: number) => {
    setFactors((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        diamondPrices: {
          ...(prev.diamondPrices || {}),
          [grade]: val
        }
      };
    });
  };

  const updateGemstonePrice = (stone: string, val: number) => {
    setFactors((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        gemstonePrices: {
          ...(prev.gemstonePrices || {}),
          [stone]: val
        }
      };
    });
  };

  const updatePurityMultiplier = (purity: string, val: number) => {
    setFactors((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        purityMultipliers: {
          ...(prev.purityMultipliers || {}),
          [purity]: val
        }
      };
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
    <div className="space-y-12 max-w-5xl pb-24">
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
          className="flex items-center space-x-3 px-10 py-4 bg-brand-gold text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
          <div className="bg-white dark:bg-[#1a1614] rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
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
                  className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Silver (per gram)</label>
                <input 
                  type="number" 
                  value={factors?.metalRates?.silver ?? 100}
                  onChange={(e) => updateMetalRate('silver', parseFloat(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Platinum (per gram)</label>
                <input 
                  type="number" 
                  value={factors?.metalRates?.platinum ?? 4000}
                  onChange={(e) => updateMetalRate('platinum', parseFloat(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Tax Configuration */}
          <div className="bg-white dark:bg-[#1a1614] rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
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
                  className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Diamond Quality Prices */}
          <div className="bg-white dark:bg-[#1a1614] rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Diamond Price Matrix</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Rate per carat (₹)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {['EF-VVS', 'GH-VS', 'GHI-VS', 'FG-SI', 'IJ-SI', 'Diamond-Standard'].map((grade) => (
                <div key={grade} className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">{grade}</label>
                  <input 
                    type="number" 
                    value={factors?.diamondPrices?.[grade] ?? factors?.stonePrices?.[grade] ?? 40000}
                    onChange={(e) => updateDiamondPrice(grade, parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gemstone Rates */}
          <div className="bg-white dark:bg-[#1a1614] rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Gem size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Gemstone Price Matrix</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Rate per carat (₹)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {['ruby', 'emerald', 'sapphire', 'moissanite', 'cz', 'default'].map((stone) => (
                <div key={stone} className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">{stone}</label>
                  <input 
                    type="number" 
                    value={factors?.gemstonePrices?.[stone] ?? 5000}
                    onChange={(e) => updateGemstonePrice(stone, parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings collapsible block */}
      <div className="border border-brand-text/15 dark:border-white/15 rounded-[40px] overflow-hidden bg-white dark:bg-[#1a1614] shadow-md">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-10 py-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center space-x-4 text-brand-text dark:text-white">
            <Settings size={20} className="text-brand-gold" />
            <span className="text-[13px] font-black uppercase tracking-[0.2em]">Advanced Settings</span>
          </div>
          {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showAdvanced && (
          <div className="p-10 border-t border-brand-text/10 dark:border-white/10 space-y-8 animate-in slide-in-from-top-4 duration-300">
            {/* Category Offsets */}
            <div className="space-y-6">
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                <Ruler size={16} /> Category Sizing Offsets (g/unit)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-text/60">Rings</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={factors?.ringsOffset ?? 0.12}
                    onChange={(e) => setFactors({ ...factors, ringsOffset: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-text/60">Chains</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={factors?.chainsOffset ?? 0.25}
                    onChange={(e) => setFactors({ ...factors, chainsOffset: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-text/60">Bracelets</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={factors?.braceletsOffset ?? 0.15}
                    onChange={(e) => setFactors({ ...factors, braceletsOffset: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-text/60">Bangles</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={factors?.banglesOffset ?? 0.15}
                    onChange={(e) => setFactors({ ...factors, banglesOffset: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Purity Multipliers */}
            <div className="space-y-6 pt-8 border-t border-brand-text/5">
              <h4 className="text-[12px] font-bold uppercase tracking-widest text-brand-gold flex items-center gap-2">
                <Coins size={16} /> Gold Purity Multipliers
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {['24K', '22K', '18K', '14K', '9K'].map((purity) => (
                  <div key={purity} className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-text/60">{purity}</label>
                    <input 
                      type="number" 
                      step="0.001"
                      value={factors?.purityMultipliers?.[purity] ?? 0.75}
                      onChange={(e) => updatePurityMultiplier(purity, parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Formula Explanations */}
      <div className="bg-white dark:bg-[#1a1614] rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
        <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
            <Ruler size={24} />
          </div>
          <div>
            <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Live Category Weight Formulas</h3>
            <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Active mathematical models scaling the product weights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Rings */}
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-brand-text/10 space-y-4">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">RINGS</h4>
              <p className="text-[9px] text-brand-text/50 uppercase tracking-widest">Weight Scales by Ring Size</p>
            </div>
            <code className="text-[11px] block bg-white dark:bg-[#12100e] p-4 rounded-xl border font-mono">
              Weight = Base Weight + (Size - 12) × {factors?.ringsOffset ?? 0.12}g
            </code>
            <div className="text-[10px] space-y-1">
              <p className="font-bold text-brand-text/70">Examples (Base: 3.04g):</p>
              <ul className="list-disc list-inside space-y-0.5 text-brand-text/60">
                <li>Size 12 (Base): 3.04g</li>
                <li>Size 13: 3.16g</li>
                <li>Size 14: 3.28g</li>
              </ul>
            </div>
            <p className="text-[9px] text-brand-text/50 uppercase leading-relaxed">Adjusts from ring size 12 baseline. Prevents under-pricing of large ring sizes.</p>
          </div>

          {/* Bangles */}
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-brand-text/10 space-y-4">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">BANGLES</h4>
              <p className="text-[9px] text-brand-text/50 uppercase tracking-widest">Weight Scales by Diameter Steps</p>
            </div>
            <code className="text-[11px] block bg-white dark:bg-[#12100e] p-4 rounded-xl border font-mono">
              Weight = Base Weight + ((Size - 2.4) / 0.2) × {factors?.banglesOffset ?? 0.15}g
            </code>
            <div className="text-[10px] space-y-1">
              <p className="font-bold text-brand-text/70">Examples (Base: 10.00g):</p>
              <ul className="list-disc list-inside space-y-0.5 text-brand-text/60">
                <li>Size 2.4 (Base): 10.00g</li>
                <li>Size 2.6: 10.15g</li>
                <li>Size 2.8: 10.30g</li>
              </ul>
            </div>
            <p className="text-[9px] text-brand-text/50 uppercase leading-relaxed">Adjusts from bangle size 2.4 baseline. Sizes scale in steps of 0.2 units.</p>
          </div>

          {/* Chains */}
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-brand-text/10 space-y-4">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">CHAINS</h4>
              <p className="text-[9px] text-brand-text/50 uppercase tracking-widest">Weight Scales by Length Inches</p>
            </div>
            <code className="text-[11px] block bg-white dark:bg-[#12100e] p-4 rounded-xl border font-mono">
              Weight = Base Weight + (Length - 20) × {factors?.chainsOffset ?? 0.25}g
            </code>
            <div className="text-[10px] space-y-1">
              <p className="font-bold text-brand-text/70">Examples (Base: 8.00g):</p>
              <ul className="list-disc list-inside space-y-0.5 text-brand-text/60">
                <li>Length 18: 7.50g</li>
                <li>Length 20 (Base): 8.00g</li>
                <li>Length 22: 8.50g</li>
              </ul>
            </div>
            <p className="text-[9px] text-brand-text/50 uppercase leading-relaxed">Adjusts from chain size 20 inches baseline. Scaled linearly per inch offset.</p>
          </div>

          {/* Bracelets */}
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-brand-text/10 space-y-4">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">BRACELETS</h4>
              <p className="text-[9px] text-brand-text/50 uppercase tracking-widest">Weight Scales by Index Steps</p>
            </div>
            <code className="text-[11px] block bg-white dark:bg-[#12100e] p-4 rounded-xl border font-mono">
              Weight = Base Weight + (IndexDifference × {factors?.braceletsOffset ?? 0.15}g)
            </code>
            <div className="text-[10px] space-y-1">
              <p className="font-bold text-brand-text/70">Examples (Base: 6.00g):</p>
              <ul className="list-disc list-inside space-y-0.5 text-brand-text/60">
                <li>Size S (index -1): 5.85g</li>
                <li>Size M (index 0): 6.00g</li>
                <li>Size L (index 1): 6.15g</li>
              </ul>
            </div>
            <p className="text-[9px] text-brand-text/50 uppercase leading-relaxed">S/M/L offsets map to index steps of −1, 0, +1 relative to Medium (M).</p>
          </div>

          {/* Pendants */}
          <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-brand-text/10 space-y-4">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">PENDANTS</h4>
              <p className="text-[9px] text-brand-text/50 uppercase tracking-widest">Static Base Weight</p>
            </div>
            <code className="text-[11px] block bg-white dark:bg-[#12100e] p-4 rounded-xl border font-mono">
              Weight = Base Weight (Static)
            </code>
            <div className="text-[10px] space-y-1">
              <p className="font-bold text-brand-text/70">Examples (Base: 2.50g):</p>
              <ul className="list-disc list-inside space-y-0.5 text-brand-text/60">
                <li>Any size: 2.50g</li>
              </ul>
            </div>
            <p className="text-[9px] text-brand-text/50 uppercase leading-relaxed">No sizing or scaling formulas apply. Static pricing based on pure base weight.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

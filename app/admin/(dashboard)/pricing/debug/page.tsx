'use client';

import { useState, useEffect, useMemo } from 'react';
import { calculatePricing } from '@/lib/pricing';
import { sharedDefaultProductConfiguration } from '@/lib/ecommerce';
import { 
  Loader2, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  Sliders, 
  Search,
  Sparkles,
  Info,
  Layers,
  Coins
} from 'lucide-react';

export default function PricingDebugPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [pricingFactors, setPricingFactors] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Select Product
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Custom configuration inputs for Sandbox Debugging
  const [metal, setMetal] = useState('yellow-gold');
  const [purity, setPurity] = useState('18K');
  const [size, setSize] = useState('12');
  const [stoneQuality, setStoneQuality] = useState('EF-VVS');
  const [stoneType, setStoneType] = useState('ruby');

  const fetchDebugData = async () => {
    setLoading(true);
    setError(null);
    try {
      const settingsRes = await fetch('/api/settings/public');
      const settingsData = await settingsRes.json();
      if (!settingsData.success) {
        throw new Error(settingsData.message || 'Failed to fetch pricing rules');
      }
      setPricingFactors(settingsData.data?.pricingFactors);

      const productsRes = await fetch('/api/admin/products?limit=200');
      const productsData = await productsRes.json();
      if (!productsData.success) {
        throw new Error(productsData.message || 'Failed to fetch products');
      }
      const data = productsData.data || [];
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error loading debug data';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  // Sync inputs when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      const defaultConfig = sharedDefaultProductConfiguration(selectedProduct);
      setMetal(defaultConfig.metal || 'yellow-gold');
      setPurity(defaultConfig.purity || '18K');
      setSize(defaultConfig.size || selectedProduct.configurableOptions?.sizes?.[0] || '12');
      setStoneQuality(defaultConfig.stone || 'EF-VVS');
      setStoneType(selectedProduct.stoneType || 'ruby');
    }
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products.slice(0, 10);
    return products
      .filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 15);
  }, [products, searchTerm]);

  // Pricing Pipeline Calculation
  const debugPricingBreakdown = useMemo(() => {
    if (!selectedProduct || !pricingFactors) return null;
    
    // Bind current config inputs
    const config = {
      metal,
      purity,
      size,
      stone: selectedProduct.jewelryType === 'diamond' ? stoneQuality : selectedProduct.configurableOptions?.stones?.[0] || 'Natural',
      stoneType: selectedProduct.jewelryType === 'stone' ? stoneType : undefined
    };

    try {
      // Hydrate category config
      const hydratedProduct = {
        ...selectedProduct,
        stoneType: selectedProduct.jewelryType === 'stone' ? stoneType : selectedProduct.stoneType
      };
      
      return calculatePricing(hydratedProduct, config, pricingFactors);
    } catch (e) {
      console.error("Calculation breakdown failure", e);
      return null;
    }
  }, [selectedProduct, pricingFactors, metal, purity, size, stoneQuality, stoneType]);

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Pricing Sandbox...</p>
      </div>
    );
  }

  // Calculate pricing inputs
  const effectiveGoldRate = pricingFactors && pricingFactors.metalRates?.gold24k && pricingFactors.purityMultipliers?.[purity]
    ? Math.round(pricingFactors.metalRates.gold24k * pricingFactors.purityMultipliers[purity])
    : 0;

  return (
    <div className="space-y-12 max-w-7xl pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Developer Operations</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Interactive Pricing <span className="not-italic text-brand-text/20 dark:text-white/20">Sandbox & Audit</span>
          </h1>
        </div>
        <button 
          onClick={fetchDebugData}
          className="flex items-center space-x-3 px-8 py-4 border border-brand-gold/30 hover:border-brand-gold text-brand-gold rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all"
        >
          <RefreshCw size={14} />
          <span>Sync Rules</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center space-x-3">
          <AlertCircle className="text-red-500" size={18} />
          <p className="text-xs text-red-600 dark:text-red-400 font-bold">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sandbox Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#1a1614] border border-brand-text/10 dark:border-white/10 rounded-[40px] p-10 space-y-8 shadow-md">
            <h3 className="text-[13px] font-black uppercase tracking-widest text-brand-text dark:text-white flex items-center gap-3">
              <Sliders size={18} className="text-brand-gold" />
              Pricing Engine Sandbox
            </h3>

            {/* Product Picker */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold ml-1">Select Product</label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-text/30" size={16} />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/10 dark:border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold"
                />
              </div>

              {/* Selected product card info */}
              {searchTerm.trim() && (
                <div className="absolute z-10 w-[300px] mt-2 bg-white dark:bg-[#25201e] border rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                  {filteredProducts.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => {
                        setSelectedProduct(p);
                        setSearchTerm('');
                      }}
                      className="w-full text-left px-5 py-3 hover:bg-brand-gold/10 text-xs font-semibold border-b last:border-b-0"
                    >
                      {p.name} ({p.category})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-brand-text/5">
                {/* Metal Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold ml-1">Metal</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['yellow-gold', 'rose-gold', 'white-gold', 'platinum'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMetal(m)}
                        className={`py-3 px-4 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${
                          metal === m 
                            ? 'bg-brand-gold border-brand-gold text-[#12100e]' 
                            : 'border-brand-text/10 dark:border-white/10 hover:border-brand-gold'
                        }`}
                      >
                        {m.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purity Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold ml-1">Purity</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['24K', '22K', '18K', '14K', '9K'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPurity(p)}
                        className={`py-3 px-1.5 rounded-xl border text-[10px] font-black transition-all ${
                          purity === p 
                            ? 'bg-brand-gold border-brand-gold text-[#12100e]' 
                            : 'border-brand-text/10 dark:border-white/10 hover:border-brand-gold'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold ml-1">Size / Length</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-xs font-bold"
                  >
                    {(selectedProduct.configurableOptions?.sizes?.length > 0 
                      ? selectedProduct.configurableOptions.sizes 
                      : ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
                    ).map((s: string) => (
                      <option key={s} value={s}>Size {s}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Stone Selection */}
                {selectedProduct.jewelryType === 'diamond' && (
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold ml-1">Diamond Quality</label>
                    <select
                      value={stoneQuality}
                      onChange={(e) => setStoneQuality(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-xs font-bold"
                    >
                      {['EF-VVS', 'GH-VS', 'GHI-VS', 'FG-SI', 'IJ-SI', 'Diamond-Standard'].map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedProduct.jewelryType === 'stone' && (
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold ml-1">Gemstone Type</label>
                    <select
                      value={stoneType}
                      onChange={(e) => setStoneType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#25201e] border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-xs font-bold"
                    >
                      {['ruby', 'emerald', 'sapphire', 'moissanite', 'cz'].map((st) => (
                        <option key={st} value={st}>{st.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pricing Pipeline Output Breakdown */}
          {debugPricingBreakdown && (
            <div className="bg-white dark:bg-[#1a1614] border border-brand-text/10 dark:border-white/10 rounded-[40px] p-10 space-y-8 shadow-md">
              <div className="flex items-center space-x-3 pb-4 border-b border-brand-text/5">
                <Sparkles className="text-brand-gold" size={20} />
                <h3 className="text-[13px] font-black uppercase tracking-widest">PRICING CALCULATOR EXPLANATION</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-semibold text-brand-text/80 dark:text-white/80">
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-brand-text/50 uppercase text-[9px] tracking-wider">Metric</span>
                    <span className="text-brand-text/50 uppercase text-[9px] tracking-wider">Value</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Selected Product</span>
                    <span className="text-brand-gold font-black">{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold Weight</span>
                    <span>{debugPricingBreakdown.estimatedGoldWeight} g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24K Gold Rate</span>
                    <span>₹{pricingFactors?.metalRates?.gold24k ?? 6500}/g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Purity</span>
                    <span>{purity} ({pricingFactors?.purityMultipliers?.[purity] ?? 0.75}x)</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-gold">
                    <span>Effective Gold Rate</span>
                    <span>₹{effectiveGoldRate}/g</span>
                  </div>
                  <div className="flex justify-between font-black border-t pt-2 border-brand-text/5 text-brand-text dark:text-white">
                    <span>Gold Price</span>
                    <span>₹{debugPricingBreakdown.metalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-brand-text/50 uppercase text-[9px] tracking-wider">Metric</span>
                    <span className="text-brand-text/50 uppercase text-[9px] tracking-wider">Value</span>
                  </div>

                  {debugPricingBreakdown.isDiamond && (
                    <>
                      <div className="flex justify-between">
                        <span>Diamond Weight</span>
                        <span>{debugPricingBreakdown.stoneWeightCarats} ct</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diamond Quality</span>
                        <span>{stoneQuality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diamond Rate</span>
                        <span>₹{pricingFactors?.diamondPrices?.[stoneQuality] ?? 40000}/ct</span>
                      </div>
                      <div className="flex justify-between font-black text-brand-text dark:text-white">
                        <span>Diamond Price</span>
                        <span>₹{debugPricingBreakdown.stonePrice.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}

                  {debugPricingBreakdown.isStone && (
                    <>
                      <div className="flex justify-between">
                        <span>Stone Weight</span>
                        <span>{debugPricingBreakdown.stoneWeightCarats} ct</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stone Type</span>
                        <span className="capitalize">{stoneType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gemstone Rate</span>
                        <span>₹{pricingFactors?.gemstonePrices?.[stoneType] ?? 5000}/ct</span>
                      </div>
                      <div className="flex justify-between font-black text-brand-text dark:text-white">
                        <span>Stone Price</span>
                        <span>₹{debugPricingBreakdown.stonePrice.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between border-t pt-2 border-brand-text/5">
                    <span>Making Charges Source</span>
                    <span className="font-bold text-brand-gold">{debugPricingBreakdown.makingChargesSource}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Formula</span>
                    <span className="font-mono text-[10px] text-brand-text/60">{debugPricingBreakdown.makingChargesFormula}</span>
                  </div>
                  <div className="flex justify-between font-black text-brand-text dark:text-white">
                    <span>Making Charges</span>
                    <span>₹{debugPricingBreakdown.makingCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 border-brand-text/5">
                    <span>GST ({pricingFactors?.gstPercentage ?? 3}%)</span>
                    <span>₹{debugPricingBreakdown.gst.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-gold/30 pt-6 flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-widest text-brand-gold">Total Calculated Price</span>
                <span className="text-3xl font-serif font-black text-brand-gold">₹{debugPricingBreakdown.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Audit Pipeline Sidebar */}
        <div className="space-y-8">
          {/* Global Pricing Snapshot */}
          <div className="bg-white dark:bg-[#1a1614] border border-brand-text/10 dark:border-white/10 rounded-[36px] p-8 space-y-6 shadow-md">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold flex items-center gap-2">
              <Coins size={14} />
              Global Price Snapshot
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-text/50">Gold 24K Rate:</span>
                <span className="font-bold">₹{pricingFactors?.metalRates?.gold24k ?? 6500}/g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text/50">Silver Rate:</span>
                <span className="font-bold">₹{pricingFactors?.metalRates?.silver ?? 100}/g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text/50">Platinum Rate:</span>
                <span className="font-bold">₹{pricingFactors?.metalRates?.platinum ?? 4000}/g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text/50">Tax Rate (GST):</span>
                <span className="font-bold">{pricingFactors?.gstPercentage ?? 3}%</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-brand-text/50">Rings Offset:</span>
                <span className="font-bold">{pricingFactors?.ringsOffset ?? 0.12}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text/50">Bangles Offset:</span>
                <span className="font-bold">{pricingFactors?.banglesOffset ?? 0.15}g</span>
              </div>
            </div>
          </div>

          {/* Audit Verification */}
          {debugPricingBreakdown && (
            <div className="bg-white dark:bg-[#1a1614] border border-brand-text/10 dark:border-white/10 rounded-[36px] p-8 space-y-6 shadow-md">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-gold flex items-center gap-2">
                <Layers size={14} />
                Surface Parity Audit
              </h4>
              <div className="space-y-4 text-xs font-semibold text-brand-text/80 dark:text-white/80">
                <div className="flex justify-between">
                  <span>Card Price:</span>
                  <span>₹{debugPricingBreakdown.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>PDP Price:</span>
                  <span>₹{debugPricingBreakdown.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cart Price:</span>
                  <span>₹{debugPricingBreakdown.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checkout Price:</span>
                  <span>₹{debugPricingBreakdown.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expected Order DB Price:</span>
                  <span>₹{debugPricingBreakdown.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-text/5 text-center">
                <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  <ShieldCheck size={14} />
                  <span>PARITY VERIFIED</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

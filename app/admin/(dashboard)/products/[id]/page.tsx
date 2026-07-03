'use client';

import { useState, useEffect, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminImageUploader from '@/components/admin/AdminImageUploader';
import { 
  Save, 
  ArrowLeft,
  Plus, 
  X, 
  Image as ImageIcon, 
  Diamond, 
  Layers, 
  Coins, 
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveProductImage } from '@/lib/imageResolver';

interface ProductEditorProps {
  params: Promise<{ id: string }>;
}

interface ProductFormData {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  basePrice: number;
  makingCharges: number;
  baseWeight: number;
  diamondWeightCarats?: number;
  stockStatus: string;
  isActive: boolean;
  images: string[];
  productVideos: string[];
  enableCardVideoPreview: boolean;
  cardPreviewVideo: string;
  cardPreviewThumbnail: string;
  variantImages: Record<string, string>;
  specs: Record<string, string>;
  readyToShipVariants?: string[];
  configurableOptions: {
    metals: string[];
    purities: string[];
    stones: string[];
    sizes: string[];
    customizations: string[];
    [key: string]: string[];
  };
  pricingOverrides: {
    makingCharges: number | string;
    sizeWeightOffset: number | string;
    stonePrices: Record<string, number>;
  };
  jewelryType?: string;
  defaultMetal?: string;
  stoneType?: string;
  [key: string]: unknown; // to allow dynamic properties from server safely
}

function ProductEditorContent({ params }: ProductEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const returnUrl = returnTo ? `/admin/products?${returnTo}` : '/admin/products';

  const { id } = use(params);
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    category: '',
    tags: [],
    basePrice: 0,
    makingCharges: 0,
    baseWeight: 0,
    diamondWeightCarats: 0,
    stockStatus: 'in-stock',
    isActive: true,
    images: [],
    productVideos: [],
    enableCardVideoPreview: false,
    cardPreviewVideo: '',
    cardPreviewThumbnail: '',
    variantImages: {},
    specs: {},
    configurableOptions: {
      metals: [],
      purities: [],
      stones: [],
      sizes: [],
      customizations: []
    },
    pricingOverrides: {
      makingCharges: '',
      sizeWeightOffset: '',
      stonePrices: {}
    }
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data.success) {
          // Ensure all fields exist for the form
          const product = data.data;
          setFormData({
            ...product,
            productVideos: product.productVideos || [],
            enableCardVideoPreview: product.enableCardVideoPreview || false,
            cardPreviewVideo: product.cardPreviewVideo || '',
            cardPreviewThumbnail: product.cardPreviewThumbnail || '',
            variantImages: product.variantImages || {},
            specs: product.specs || {},
            readyToShipVariants: product.readyToShipVariants || [],
            configurableOptions: {
              metals: product.configurableOptions?.metals || [],
              purities: product.configurableOptions?.purities || [],
              stones: product.configurableOptions?.stones || [],
              sizes: product.configurableOptions?.sizes || [],
              customizations: product.configurableOptions?.customizations || []
            },
            pricingOverrides: {
              makingCharges: product.pricingOverrides?.makingCharges ?? '',
              sizeWeightOffset: product.pricingOverrides?.sizeWeightOffset ?? '',
              stonePrices: product.pricingOverrides?.stonePrices || {}
            },
            diamondWeightCarats: product.diamondWeightCarats || 0
          });
        } else {
          setError('Failed to load product data.');
        }
      } catch {
        setError('An error occurred while fetching the product.');
      } finally {
        setLoading(false);
      }
    };

    if (!isNew) {
      fetchProduct();
    }
  }, [id, isNew]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // Basic Validation
    if (!formData.name || !formData.slug || !formData.category) {
      setError('Name, Slug, and Category are mandatory.');
      setSaving(false);
      return;
    }

    // Auto-derive Gold Purity options based on jewelry composition
    let purityOptions = [];
    const currentJType = formData.jewelryType || 'gold';
    if (currentJType === 'diamond') {
      purityOptions = ['9K', '14K', '18K'];
    } else if (currentJType === 'stone') {
      purityOptions = ['9K', '14K', '18K', '22K'];
    } else {
      purityOptions = ['18K', '22K'];
    }

    // Clean specs to prevent validation errors (e.g. Stone weight on Diamond product)
    const cleanedSpecs = { ...(formData.specs || {}) };
    if (currentJType === 'gold') {
      delete cleanedSpecs.diamondWeight;
      delete cleanedSpecs.diamondCount;
      delete cleanedSpecs.diamondQuality;
      delete cleanedSpecs.stoneName;
      delete cleanedSpecs.stoneWeight;
      delete cleanedSpecs.stoneCount;
    } else if (currentJType === 'diamond') {
      delete cleanedSpecs.stoneName;
      delete cleanedSpecs.stoneWeight;
      delete cleanedSpecs.stoneCount;
    } else if (currentJType === 'stone') {
      delete cleanedSpecs.diamondWeight;
      delete cleanedSpecs.diamondCount;
      delete cleanedSpecs.diamondQuality;
    }

    const payload = {
      ...formData,
      specs: cleanedSpecs,
      goldPurityOptions: purityOptions,
      configurableOptions: {
        ...(formData.configurableOptions || {}),
        purities: purityOptions
      }
    };

    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Masterpiece preserved in the vault.');
        if (isNew) {
          router.push(`/admin/products/${data.data._id}`);
        } else {
          // Refresh state with updated saved product
          setFormData({
            ...data.data,
            productVideos: data.data.productVideos || [],
            enableCardVideoPreview: data.data.enableCardVideoPreview || false,
            cardPreviewVideo: data.data.cardPreviewVideo || '',
            cardPreviewThumbnail: data.data.cardPreviewThumbnail || '',
            variantImages: data.data.variantImages || {},
            specs: data.data.specs || {},
            readyToShipVariants: data.data.readyToShipVariants || [],
            configurableOptions: {
              metals: data.data.configurableOptions?.metals || [],
              purities: data.data.configurableOptions?.purities || [],
              stones: data.data.configurableOptions?.stones || [],
              sizes: data.data.configurableOptions?.sizes || [],
              customizations: data.data.configurableOptions?.customizations || []
            },
            pricingOverrides: {
              makingCharges: data.data.pricingOverrides?.makingCharges ?? '',
              sizeWeightOffset: data.data.pricingOverrides?.sizeWeightOffset ?? '',
              stonePrices: data.data.pricingOverrides?.stonePrices || {}
            },
            diamondWeightCarats: data.data.diamondWeightCarats || 0
          });
        }
      } else {
        setError(data.message || 'The vault rejected the update.');
      }
    } catch {
      setError('A secure connection could not be established.');
    } finally {
      setSaving(false);
    }
  };

  const updateConfigOption = (key: string, value: string[]) => {
    setFormData((prev: ProductFormData) => ({
      ...prev,
      configurableOptions: {
        ...prev.configurableOptions,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Preparing Atelier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Link 
            href={returnUrl}
            className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-brand-text/70 hover:text-brand-gold transition-colors font-bold mb-4"
          >
            <ArrowLeft size={14} />
            <span>Return to Vault</span>
          </Link>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            {isNew ? 'Create New' : 'Refine'} <span className="not-italic text-brand-text/20 dark:text-white/20">Masterpiece</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {!isNew && (
            <Link 
              href={`/product/${formData.slug}`}
              target="_blank"
              className="flex items-center space-x-2 px-6 py-4 bg-slate-100 dark:bg-white/5 text-brand-text/60 dark:text-white/60 rounded-2xl border border-transparent hover:border-brand-gold/20 transition-all text-[12px] font-bold uppercase tracking-widest"
            >
              <ExternalLink size={16} />
              <span>Preview</span>
            </Link>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-3 px-10 py-4 bg-brand-gold hover:bg-[#B4925A] text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-500 shadow-premium disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isNew ? 'Initialize' : 'Preserve'}</span>
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-4xl flex items-center space-x-4 text-red-500 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={20} />
          <p className="text-[12px] font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-4xl flex items-center space-x-4 text-emerald-500 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <p className="text-[12px] font-bold uppercase tracking-widest">{success}</p>
        </div>
      )}

      {/* Editor Tabs */}
      <div className="flex items-center space-x-2 p-2 bg-white dark:bg-white/10 rounded-3xl border border-brand-text/15 dark:border-white/15 max-w-fit overflow-x-auto shadow-sm">
        {[
          { id: 'basic', label: 'Identity', icon: Settings },
          { id: 'pricing', label: 'Value & Inventory', icon: Coins },
          { id: 'media', label: 'Media Gallery', icon: ImageIcon },
          { id: 'jewelry', label: 'Variant Setup', icon: Layers },
          { id: 'specs', label: 'Jewellery Details', icon: FileText },
          { id: 'variants', label: 'Visual Variants', icon: Diamond },
          { id: 'availability', label: 'Variant Availability', icon: CheckCircle2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-500 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-brand-gold text-[#12100e] shadow-soft" 
                : "text-brand-text/70 hover:text-brand-text dark:hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'basic' && (
          <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-10 animate-in fade-in duration-700 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Masterpiece Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Secure Slug</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Collection Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                >
                  <option value="">Select Category</option>
                  <option value="rings">Rings</option>
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="chains">Chains</option>
                  <option value="pendants">Pendants</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="bangles">Bangles</option>
                  <option value="mangalsutras">Mangalsutras</option>
                  <option value="nose-pin">Nose Pins</option>
                  <option value="anklets">Anklets</option>
                  <option value="brooches">Brooches</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Default Metal</label>
                <select 
                  value={formData.defaultMetal || ''}
                  onChange={(e) => setFormData({...formData, defaultMetal: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                >
                  <option value="">System Default (Yellow Gold)</option>
                  <option value="yellow-gold">Yellow Gold</option>
                  <option value="rose-gold">Rose Gold</option>
                  <option value="white-gold">White Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Visibility</label>
                <div className="flex items-center space-x-6 h-15">
                  <button 
                    onClick={() => setFormData({...formData, isActive: true})}
                    className={cn(
                      "flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500",
                      formData.isActive !== false ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-white/2 border-white/5 text-brand-text/20"
                    )}
                  >
                    <Eye size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Live</span>
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, isActive: false})}
                    className={cn(
                      "flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500",
                      formData.isActive === false ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-white/2 border-white/5 text-brand-text/20"
                    )}
                  >
                    <EyeOff size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Archive</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">The Story (Description)</label>
              <textarea 
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-4xl py-6 px-8 text-[14px] leading-relaxed text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
              />
            </div>

            {/* Material Composition Section */}
            <div className="pt-10 border-t border-brand-text/10 dark:border-white/10 space-y-6">
              <h3 className="text-lg font-serif font-bold text-brand-text dark:text-white">Material Composition</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Jewelry Type</label>
                  <select
                    value={formData.jewelryType || 'gold'}
                    onChange={(e) => {
                      const type = e.target.value;
                      setFormData({
                        ...formData,
                        jewelryType: type,
                        hasDiamond: type === 'diamond',
                        hasStone: type === 'stone',
                        stoneType: type === 'stone' ? (formData.stoneType || 'Ruby') : ''
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all"
                  >
                    <option value="gold">Gold Jewelry (Plain Gold)</option>
                    <option value="diamond">Diamond Jewelry</option>
                    <option value="stone">Stone Jewelry (Gemstones)</option>
                  </select>
                </div>

                {formData.jewelryType === 'diamond' && (
                  <>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Diamond Weight (ct)</label>
                      <input
                        type="text"
                        placeholder="e.g. 0.45"
                        value={formData.specs?.diamondWeight || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          specs: { ...(formData.specs || {}), diamondWeight: e.target.value }
                        })}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Diamond Count</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 or 24"
                        value={formData.specs?.diamondCount || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          specs: { ...(formData.specs || {}), diamondCount: e.target.value }
                        })}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all"
                      />
                    </div>
                  </>
                )}

                {formData.jewelryType === 'stone' && (
                  <>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Stone Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Emerald, Ruby"
                        value={formData.stoneType || formData.specs?.stoneName || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          stoneType: e.target.value,
                          specs: { ...(formData.specs || {}), stoneName: e.target.value }
                        })}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Stone Weight (ct)</label>
                      <input
                        type="text"
                        placeholder="e.g. 1.2"
                        value={formData.specs?.stoneWeight || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          specs: { ...(formData.specs || {}), stoneWeight: e.target.value }
                        })}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Stone Count</label>
                      <input
                        type="text"
                        placeholder="e.g. 1"
                        value={formData.specs?.stoneCount || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          specs: { ...(formData.specs || {}), stoneCount: e.target.value }
                        })}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-10 animate-in fade-in duration-700 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Computed Base Price (₹)</label>
                <input 
                  type="number" 
                  value={formData.basePrice}
                  disabled
                  className="w-full bg-slate-100 dark:bg-white/10 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text/60 transition-all shadow-inner cursor-not-allowed"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Making Charges (₹)</label>
                <input 
                  type="number" 
                  value={formData.makingCharges}
                  onChange={(e) => setFormData({...formData, makingCharges: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Base Weight (g)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.baseWeight}
                  onChange={(e) => setFormData({...formData, baseWeight: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Diamond Weight (ct)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.diamondWeightCarats}
                  onChange={(e) => setFormData({...formData, diamondWeightCarats: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-text dark:text-white transition-all shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Inventory Lifecycle</label>
              <div className="flex items-center space-x-6 h-15">
                <button 
                  onClick={() => setFormData({...formData, stockStatus: 'in-stock'})}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl border transition-all duration-500",
                    formData.stockStatus === 'in-stock' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-white/2 border-white/5 text-brand-text/20"
                  )}
                >
                  <CheckCircle2 size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Available</span>
                </button>
                <button 
                  onClick={() => setFormData({...formData, stockStatus: 'out-of-stock'})}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl border transition-all duration-500",
                    formData.stockStatus === 'out-of-stock' ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-white/2 border-white/5 text-brand-text/20"
                  )}
                >
                  <AlertCircle size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Sold Out</span>
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-brand-text/5 mt-8 space-y-6">
              <div className="space-y-1">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-text dark:text-white flex items-center"><Coins size={14} className="mr-2 text-brand-gold" /> Product-Level Pricing Overrides</h4>
                <p className="text-[9px] text-brand-text/50 uppercase tracking-widest">Leave empty to use global pricing settings.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Override Making Charges (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 5000"
                    value={formData.pricingOverrides?.makingCharges ?? ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      pricingOverrides: { ...(formData.pricingOverrides || {}), makingCharges: e.target.value ? parseFloat(e.target.value) : '' }
                    })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] font-bold shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Override Size-Weight Offset (g/size)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="e.g. 0.2"
                    value={formData.pricingOverrides?.sizeWeightOffset ?? ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      pricingOverrides: { ...(formData.pricingOverrides || {}), sizeWeightOffset: e.target.value ? parseFloat(e.target.value) : '' }
                    })}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] font-bold shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-10 animate-in fade-in duration-700 shadow-md">
            <div className="space-y-6">
              <AdminImageUploader 
                images={formData.images} 
                onChange={(newImages) => setFormData({...formData, images: newImages})} 
                category={formData.category} 
              />
            </div>

            {/* Video Assets Section */}
            <div className="space-y-6 pt-10 border-t border-brand-text/10 dark:border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold flex items-center gap-2">
                  <Video size={14} /> Product Videos
                </label>
                <button 
                  onClick={() => setFormData({...formData, productVideos: [...(formData.productVideos || []), '']})}
                  className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center space-x-2"
                >
                  <Plus size={14} />
                  <span>Add Video</span>
                </button>
              </div>
              <p className="text-[9px] text-brand-text/40 italic mt-0">Add URLs for product videos to show in the PDP gallery.</p>
              
              <div className="grid grid-cols-1 gap-4">
                {(formData.productVideos || []).map((vid: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl group border border-brand-text/10 hover:border-brand-gold/20 transition-all shadow-sm">
                    <Video className="text-brand-text/40" size={20} />
                    <input 
                      type="url" 
                      value={vid}
                      onChange={(e) => {
                        const newVideos = [...formData.productVideos];
                        newVideos[idx] = e.target.value;
                        setFormData({...formData, productVideos: newVideos});
                      }}
                      placeholder="https://..."
                      className="flex-1 bg-transparent border-none text-[13px] text-brand-text dark:text-white focus:ring-0"
                    />
                    <button 
                      onClick={() => {
                        const newVideos = formData.productVideos.filter((_: string, i: number) => i !== idx);
                        setFormData({...formData, productVideos: newVideos});
                      }}
                      className="p-2 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Video Preview Settings */}
            <div className="space-y-6 pt-10 border-t border-brand-text/10 dark:border-white/10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Product Card Autoplay</label>
                <p className="text-[9px] text-brand-text/40 italic">Enable cinematic video preview when user hovers or scrolls to the product card.</p>
              </div>

              <div className="flex items-center space-x-6 h-15">
                <button 
                  onClick={() => setFormData({...formData, enableCardVideoPreview: true})}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500",
                    formData.enableCardVideoPreview ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-white/2 border-white/5 text-brand-text/20"
                  )}
                >
                  <Eye size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Enabled</span>
                </button>
                <button 
                  onClick={() => setFormData({...formData, enableCardVideoPreview: false})}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500",
                    !formData.enableCardVideoPreview ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-white/2 border-white/5 text-brand-text/20"
                  )}
                >
                  <EyeOff size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Disabled</span>
                </button>
              </div>

              {formData.enableCardVideoPreview && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-brand-gold/20">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 flex items-center gap-2"><Video size={12}/> Preview Video URL</label>
                    <input 
                      type="url" 
                      value={formData.cardPreviewVideo || ''}
                      onChange={(e) => setFormData({...formData, cardPreviewVideo: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-[#1A1A1A] border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] shadow-inner"
                    />
                    <p className="text-[8px] text-brand-text/40 ml-2">Must be muted WebM/MP4 under 3MB</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 flex items-center gap-2"><ImageIcon size={12}/> Fallback Thumbnail URL</label>
                    <input 
                      type="url" 
                      value={formData.cardPreviewThumbnail || ''}
                      onChange={(e) => setFormData({...formData, cardPreviewThumbnail: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-white dark:bg-[#1A1A1A] border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-4 text-[13px] shadow-inner"
                    />
                    <p className="text-[8px] text-brand-text/40 ml-2">Shown while loading or low power mode</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jewelry' && (
          <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-12 animate-in fade-in duration-700 shadow-md">
            {(() => {
              const category = (formData.category || '').toLowerCase();
              let sizeLabel = 'Available Sizes';
              let sizePlaceholder = 'e.g. 12, 14, 16';
              let isSizeRelevant = true;

              if (category === 'rings') {
                sizeLabel = 'Ring Sizes (Available Sizes)';
                sizePlaceholder = 'e.g. 6, 7, 8, 9, 10';
              } else if (category === 'bangles') {
                sizeLabel = 'Bangle Sizes (Available Sizes)';
                sizePlaceholder = 'e.g. 2.2, 2.4, 2.6';
              } else if (['chains', 'bracelets', 'mangalsutras', 'anklets', 'necklaces'].includes(category)) {
                sizeLabel = 'Length Options / Chain Sizes (Available Sizes)';
                sizePlaceholder = 'e.g. 16 inches, 18 inches, 20 inches';
              } else {
                isSizeRelevant = false;
                sizeLabel = 'Sizes (Not typical for ' + (formData.category || 'this category') + ')';
                sizePlaceholder = 'Sizes are not standard for this category';
              }

              const sections = [
                { id: 'metals', label: 'Metals (Options)', placeholder: 'e.g. Yellow Gold, Rose Gold' },
                { id: 'purities', label: 'Purity Levels', placeholder: 'e.g. 18K, 14K, 22K' },
                { id: 'stones', label: 'Stone Grades', placeholder: 'e.g. VVS-EF, SI-GH' },
                { id: 'sizes', label: sizeLabel, placeholder: sizePlaceholder, isHighlighted: isSizeRelevant, isOptional: !isSizeRelevant },
                { id: 'customizations', label: 'Customization Options', placeholder: 'e.g. Engraving, Special Polish' },
              ];

              return sections.map((section) => (
                <div key={section.id} className={cn("space-y-6", section.isOptional && "opacity-60 hover:opacity-100 transition-opacity")}>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold flex items-center justify-between">
                    <span>{section.label}</span>
                    {section.isHighlighted && <span className="text-[8px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Category Specific</span>}
                    {section.isOptional && <span className="text-[8px] bg-slate-100 dark:bg-white/5 text-brand-text/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Optional</span>}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {formData.configurableOptions[section.id]?.map((opt: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 px-4 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/20">
                        <span className="text-[11px] font-bold text-brand-gold">{opt}</span>
                        <button onClick={() => {
                          const newOpts = formData.configurableOptions[section.id].filter((_: string, i: number) => i !== idx);
                          updateConfigOption(section.id, newOpts);
                        }}><X size={12} /></button>
                      </div>
                    ))}
                    <input 
                      type="text" 
                      placeholder={section.placeholder}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && !formData.configurableOptions[section.id].includes(val)) {
                            updateConfigOption(section.id, [...formData.configurableOptions[section.id], val]);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="bg-transparent border-none text-[13px] text-brand-text dark:text-white focus:ring-0 min-w-50"
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-12 animate-in fade-in duration-700 shadow-md">
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Product Specifications</label>
              <p className="text-[11px] text-brand-text/70 leading-relaxed uppercase tracking-widest">
                Define the detailed specifications that will appear in the Jewellery Details section on the storefront.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 'dimensions', label: 'Dimensions (HxW)', placeholder: 'e.g. 15mm x 12mm' },
                  { id: 'finish', label: 'Metal Finish', placeholder: 'e.g. High Polish, Matte' },
                  { id: 'certification', label: 'Certification', placeholder: 'e.g. IGI Certified, SGL' },
                  { id: 'occasion', label: 'Occasion', placeholder: 'e.g. Wedding, Everyday, Party' },
                  { id: 'craftsmanship', label: 'Craftsmanship', placeholder: 'e.g. Handcrafted' },
                  { id: 'settingType', label: 'Setting Type', placeholder: 'e.g. Prong, Bezel, Pave' },
                  { id: 'careInstructions', label: 'Care Instructions', placeholder: 'e.g. Store in a dry place' },
                  { id: 'sku', label: 'Base SKU', placeholder: 'e.g. ZON-RN-001' }
                ].map((spec) => (
                  <div key={spec.id} className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">{spec.label}</label>
                    <input 
                      type="text" 
                      value={formData.specs[spec.id] || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        specs: {
                          ...formData.specs,
                          [spec.id]: e.target.value
                        }
                      })}
                      placeholder={spec.placeholder}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/15 dark:border-white/15 rounded-2xl py-3 px-6 text-[13px] text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'variants' && (
          <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-10 animate-in fade-in duration-700 shadow-md">
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Variant-Specific Images</label>
              <p className="text-[11px] text-brand-text/70 leading-relaxed uppercase tracking-widest">
                Map specific metal variants to their corresponding high-resolution images.
              </p>
              <div className="grid grid-cols-1 gap-6">
                {formData.configurableOptions.metals.map((metal: string) => (
                  <div key={metal} className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 p-6 bg-slate-50 dark:bg-white/5 rounded-4xl border border-brand-text/15 dark:border-white/10 shadow-sm">
                    <span className="text-[13px] font-bold text-brand-text dark:text-white">{metal}</span>
                    <select 
                      value={formData.variantImages[metal.toLowerCase().replace(/ /g, '-')] || ''}
                      onChange={(e) => {
                        const key = metal.toLowerCase().replace(/ /g, '-');
                        setFormData({
                          ...formData,
                          variantImages: {
                            ...formData.variantImages,
                            [key]: e.target.value
                          }
                        });
                      }}
                      className="bg-white dark:bg-black/20 border border-brand-text/10 dark:border-white/20 rounded-xl py-3 px-4 text-[12px] text-brand-text dark:text-white"
                    >
                      <option value="">Select Primary Image</option>
                      {formData.images.map((img: string) => (
                        <option key={img} value={img}>{img}</option>
                      ))}
                    </select>
                    {formData.variantImages[metal.toLowerCase().replace(/ /g, '-')] && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-brand-gold/20 shadow-premium relative">
                        <Image 
                          src={resolveProductImage(formData.variantImages[metal.toLowerCase().replace(/ /g, '-')])} 
                          alt={`${metal} variant preview`}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 p-10 space-y-10 animate-in fade-in duration-700 shadow-md">
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Ready to Ship Whitelist</label>
              <p className="text-[11px] text-brand-text/70 leading-relaxed uppercase tracking-widest">
                Select combinations that are in stock and ready to ship within 1–3 business days. Unchecked variants will default to &ldquo;Made to Order&rdquo; (10–14 days delivery).
              </p>
              
              {(() => {
                const metals = formData.configurableOptions?.metals?.length ? formData.configurableOptions.metals : ['Yellow Gold', 'Rose Gold', 'White Gold'];
                
                let purities = formData.configurableOptions?.purities || [];
                if (purities.length === 0) {
                  const currentJType = formData.jewelryType || 'gold';
                  if (currentJType === 'diamond') {
                    purities = ['9K', '14K', '18K'];
                  } else if (currentJType === 'stone') {
                    purities = ['9K', '14K', '18K', '22K'];
                  } else {
                    purities = ['18K', '22K'];
                  }
                }

                const sizes = formData.configurableOptions?.sizes?.length ? formData.configurableOptions.sizes : ['base'];

                const combinations: { comboId: string; label: string }[] = [];
                for (const purity of purities) {
                  for (const metal of metals) {
                    for (const size of sizes) {
                      const displaySize = size === 'base' ? '' : size;
                      const comboId = `${purity}-${metal}-${displaySize || 'base'}`.toLowerCase().replace(/\s+/g, '-');
                      combinations.push({
                        comboId,
                        label: `${purity} ${metal} ${displaySize ? `(Size ${displaySize})` : ''}`
                      });
                    }
                  }
                }

                if (combinations.length === 0) {
                  return (
                    <div className="p-8 text-center border border-dashed border-brand-text/10 rounded-2xl">
                      <p className="text-[11px] uppercase tracking-widest text-brand-text/40">No configurable variants available. Please set up Metals, Purities, or Sizes first.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {combinations.map((combo) => {
                      const isChecked = (formData.readyToShipVariants || []).includes(combo.comboId);
                      return (
                        <label 
                          key={combo.comboId} 
                          className={cn(
                            "flex items-center space-x-3 p-4 rounded-xl border cursor-pointer select-none transition-all duration-300",
                            isChecked 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300" 
                              : "bg-slate-50 dark:bg-white/5 border-brand-text/10 dark:border-white/5 hover:border-brand-gold/30 text-brand-text"
                          )}
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const newWhitelist = e.target.checked 
                                ? [...(formData.readyToShipVariants || []), combo.comboId]
                                : (formData.readyToShipVariants || []).filter((id: string) => id !== combo.comboId);
                              setFormData({ ...formData, readyToShipVariants: newWhitelist });
                            }}
                            className="rounded border-gray-300 dark:border-white/10 text-brand-gold focus:ring-brand-gold bg-transparent"
                          />
                          <div className="flex flex-col">
                            <span className="text-[12px] font-bold uppercase tracking-wider">{combo.label}</span>
                            <span className="text-[8px] uppercase tracking-widest text-brand-text/50 dark:text-white/40">{combo.comboId}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductEditor({ params }: ProductEditorProps) {
  return (
    <Suspense fallback={
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Editor...</p>
      </div>
    }>
      <ProductEditorContent params={params} />
    </Suspense>
  );
}

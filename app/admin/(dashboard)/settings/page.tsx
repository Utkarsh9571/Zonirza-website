'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Loader2,
  Shield,
  Globe,
  Coins,
  Share2,
  AlertTriangle,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Type,
  Search as SearchIcon,
  Megaphone,
  ExternalLink,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) setSettings(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Opening Terminal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">System Architecture</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Command <span className="not-italic text-brand-text/20 dark:text-white/20">Settings</span>
          </h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-3 px-10 py-4 bg-brand-gold text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium transition-all hover:scale-105 active:scale-95"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : (success ? <Shield size={18} /> : <Save size={18} />)}
          <span>{success ? 'Vault Locked' : (saving ? 'Syncing...' : 'Preserve Changes')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Core Configuration */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Store Identity</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Global branding & support</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Display Name</label>
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Support Hotline</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={16} />
                  <input 
                    type="text" 
                    value={settings.supportPhone}
                    onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[14px] font-bold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Support Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={16} />
                  <input 
                    type="email" 
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[14px] font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 rounded-[40px] border border-red-500/10 p-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="text-red-500" size={24} />
                <h3 className="text-[14px] font-black uppercase tracking-widest text-red-900">Maintenance Portal</h3>
              </div>
              <button 
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={cn(
                  "w-14 h-8 rounded-full transition-all duration-500 relative",
                  settings.maintenanceMode ? "bg-red-500" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-500 shadow-md",
                  settings.maintenanceMode ? "left-7" : "left-1"
                )} />
              </button>
            </div>
            <p className="text-[11px] text-red-800/60 uppercase tracking-widest leading-relaxed font-bold">
              Activating maintenance mode will restrict storefront access to administrative personnel only.
            </p>
          </div>
        </div>

        {/* Financial & Social */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Coins size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Pricing Logic</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Global tax & logistics</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">GST Rate (%)</label>
                <input 
                  type="number" 
                  value={settings?.pricingFactors?.gstPercentage ?? 0}
                  onChange={(e) => setSettings({
                    ...settings, 
                    pricingFactors: { ...(settings?.pricingFactors || {}), gstPercentage: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Shipping Base</label>
                <input 
                  type="number" 
                  value={settings?.pricingFactors?.shippingBaseCharge ?? 0}
                  onChange={(e) => setSettings({
                    ...settings, 
                    pricingFactors: { ...(settings?.pricingFactors || {}), shippingBaseCharge: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="col-span-2 space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Free Delivery Threshold (₹)</label>
                <input 
                  type="number" 
                  value={settings?.pricingFactors?.freeShippingThreshold ?? 0}
                  onChange={(e) => setSettings({
                    ...settings, 
                    pricingFactors: { ...(settings?.pricingFactors || {}), freeShippingThreshold: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
            </div>

            {/* Advanced Pricing Matrix */}
            <div className="pt-8 border-t border-brand-text/5 mt-8 space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-brand-text dark:text-white">Advanced Pricing Matrix</h4>
              
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Size Weight Offset (g per size)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={settings?.pricingFactors?.sizeWeightOffset ?? 0.15}
                  onChange={(e) => setSettings({
                    ...settings, 
                    pricingFactors: { ...(settings?.pricingFactors || {}), sizeWeightOffset: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">VVS1 Diamond (₹)</label>
                  <input 
                    type="number" 
                    value={settings?.pricingFactors?.stonePrices?.['VVS1'] ?? 50000}
                    onChange={(e) => setSettings({
                      ...settings, 
                      pricingFactors: { 
                        ...(settings?.pricingFactors || {}), 
                        stonePrices: { ...(settings?.pricingFactors?.stonePrices || {}), 'VVS1': parseInt(e.target.value) }
                      }
                    })}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">18K Purity Multiplier</label>
                  <input 
                    type="number" 
                    step="0.001"
                    value={settings?.pricingFactors?.purityMultipliers?.['18K'] ?? 0.750}
                    onChange={(e) => setSettings({
                      ...settings, 
                      pricingFactors: { 
                        ...(settings?.pricingFactors || {}), 
                        purityMultipliers: { ...(settings?.pricingFactors?.purityMultipliers || {}), '18K': parseFloat(e.target.value) }
                      }
                    })}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-3 px-4 text-[13px] font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Share2 size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Luxury Presence</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Social & communication</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <Share2 className="text-pink-600" size={20} />
                <input 
                  type="text" 
                  value={settings?.socialLinks?.instagram || ''}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: { ...(settings?.socialLinks || {}), instagram: e.target.value }
                  })}
                  placeholder="@zoniraz_jewels"
                  className="flex-1 bg-transparent border-b border-brand-text/10 py-2 text-[13px] focus:border-brand-gold transition-colors"
                />
              </div>
              <div className="flex items-center space-x-6">
                <Share2 className="text-blue-600" size={20} />
                <input 
                  type="text" 
                  value={settings?.socialLinks?.facebook || ''}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: { ...(settings?.socialLinks || {}), facebook: e.target.value }
                  })}
                  placeholder="ZonirazJewelersOfficial"
                  className="flex-1 bg-transparent border-b border-brand-text/10 py-2 text-[13px] focus:border-brand-gold transition-colors"
                />
              </div>
              <div className="flex items-center space-x-6">
                <MessageSquare className="text-emerald-500" size={20} />
                <input 
                  type="text" 
                  value={settings?.socialLinks?.whatsapp || ''}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: { ...(settings?.socialLinks || {}), whatsapp: e.target.value }
                  })}
                  placeholder="+91 98XXX XXXXX"
                  className="flex-1 bg-transparent border-b border-brand-text/10 py-2 text-[13px] focus:border-brand-gold transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Showroom & SEO */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 p-10 space-y-8 shadow-md">
            <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Operations Hub</h3>
                <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Physical assets & hours</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Showroom Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-brand-text/20" size={16} />
                  <textarea 
                    value={settings?.address || ''}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[14px] font-medium"
                    rows={2}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Business Hours</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={16} />
                  <input 
                    type="text" 
                    value={settings?.businessHours || ''}
                    onChange={(e) => setSettings({...settings, businessHours: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[14px] font-medium"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Footer Narrative</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={16} />
                  <input 
                    type="text" 
                    value={settings?.footerText || ''}
                    onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[14px] font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#12100e] rounded-[48px] p-10 space-y-8 shadow-2xl">
            <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <SearchIcon size={24} />
              </div>
              <div>
                <h3 className="text-[14px] font-black uppercase tracking-widest text-white">Discovery & SEO</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Global indexing control</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Global Meta Title</label>
                <input 
                  type="text" 
                  value={settings?.seo?.defaultTitle || ''}
                  onChange={(e) => setSettings({...settings, seo: { ...settings.seo, defaultTitle: e.target.value }})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[14px] text-white font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Meta Description</label>
                <textarea 
                  value={settings?.seo?.defaultDescription || ''}
                  onChange={(e) => setSettings({...settings, seo: { ...settings.seo, defaultDescription: e.target.value }})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[13px] text-white/70"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Broadcasts & Announcements */}
        <div className="md:col-span-2">
          <div className="bg-brand-gold/5 rounded-[48px] border border-brand-gold/10 p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-[24px] bg-brand-gold text-white flex items-center justify-center shadow-premium">
                  <Megaphone size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-text italic">Active <span className="not-italic text-brand-text/30">Announcements</span></h3>
                  <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-black">Global banner broadcast</p>
                </div>
              </div>

              <div className="flex-1 w-full max-w-xl space-y-6">
                <div className="flex items-center space-x-4">
                  <input 
                    type="text" 
                    placeholder="Enter broadcast message..."
                    value={settings?.announcement?.text || ''}
                    onChange={(e) => setSettings({...settings, announcement: { ...settings.announcement, text: e.target.value }})}
                    className="flex-1 bg-white border border-brand-text/10 rounded-2xl py-4 px-6 text-[14px] font-bold"
                  />
                  <button 
                    onClick={() => setSettings({...settings, announcement: { ...settings.announcement, isActive: !settings.announcement.isActive }})}
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                      settings?.announcement?.isActive ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                    )}
                  >
                    {settings?.announcement?.isActive ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={14} />
                    <input 
                      type="text" 
                      placeholder="Redirect URL (optional)"
                      value={settings?.announcement?.link || ''}
                      onChange={(e) => setSettings({...settings, announcement: { ...settings.announcement, link: e.target.value }})}
                      className="w-full bg-white/50 border border-brand-text/10 rounded-2xl py-4 pl-12 pr-6 text-[12px]"
                    />
                  </div>
                  <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/40 w-32">Real-time update enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

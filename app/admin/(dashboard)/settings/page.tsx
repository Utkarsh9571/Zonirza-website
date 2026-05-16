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
  MessageSquare
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
                  value={settings.pricingFactors.gstPercentage}
                  onChange={(e) => setSettings({
                    ...settings, 
                    pricingFactors: { ...settings.pricingFactors, gstPercentage: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Shipping Base</label>
                <input 
                  type="number" 
                  value={settings.pricingFactors.shippingBaseCharge}
                  onChange={(e) => setSettings({
                    ...settings, 
                    pricingFactors: { ...settings.pricingFactors, shippingBaseCharge: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
              </div>
              <div className="col-span-2 space-y-3">
                <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Free Delivery Threshold (₹)</label>
                <input 
                  type="number" 
                  value={settings.pricingFactors.freeShippingThreshold}
                  onChange={(e) => setSettings({
                    ...settings, 
                    pricingFactors: { ...settings.pricingFactors, freeShippingThreshold: parseFloat(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                />
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
                  value={settings.socialLinks.instagram}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                  })}
                  placeholder="@zoniraz_jewels"
                  className="flex-1 bg-transparent border-b border-brand-text/10 py-2 text-[13px] focus:border-brand-gold transition-colors"
                />
              </div>
              <div className="flex items-center space-x-6">
                <Share2 className="text-blue-600" size={20} />
                <input 
                  type="text" 
                  value={settings.socialLinks.facebook}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                  })}
                  placeholder="ZonirazJewelersOfficial"
                  className="flex-1 bg-transparent border-b border-brand-text/10 py-2 text-[13px] focus:border-brand-gold transition-colors"
                />
              </div>
              <div className="flex items-center space-x-6">
                <MessageSquare className="text-emerald-500" size={20} />
                <input 
                  type="text" 
                  value={settings.socialLinks.whatsapp}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: { ...settings.socialLinks, whatsapp: e.target.value }
                  })}
                  placeholder="+91 98XXX XXXXX"
                  className="flex-1 bg-transparent border-b border-brand-text/10 py-2 text-[13px] focus:border-brand-gold transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

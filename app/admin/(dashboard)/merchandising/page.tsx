'use client';

import { useState, useEffect } from 'react';
import { 
  Monitor, 
  Save, 
  Loader2, 
  Image as ImageIcon, 
  Layout, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Trash2, 
  Link as LinkIcon,
  Search,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminMerchandisingPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/merchandising');
      const data = await res.json();
      if (data.success) setContent(data.data);
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
      const res = await fetch('/api/admin/merchandising', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
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
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Opening Gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Visual Merchandising</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Storefront <span className="not-italic text-brand-text/20 dark:text-white/20">Curation</span>
          </h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-3 px-10 py-4 bg-brand-gold text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] shadow-premium transition-all hover:scale-105 active:scale-95"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : (success ? <CheckCircle2 size={18} /> : <Save size={18} />)}
          <span>{success ? 'Published' : (saving ? 'Syncing...' : 'Deploy Content')}</span>
        </button>
      </div>

      <div className="flex space-x-2 p-2 bg-slate-50 dark:bg-white/5 rounded-[32px] w-max border border-brand-text/5">
        {[
          { id: 'hero', icon: Sparkles, label: 'Hero Section' },
          { id: 'trending', icon: TrendingUp, label: 'Trending' },
          { id: 'banners', icon: ImageIcon, label: 'Banners' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center space-x-3 px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-white dark:bg-white/10 text-brand-gold shadow-sm border border-brand-gold/20" 
                : "text-brand-text/40 hover:text-brand-text"
            )}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 p-10 space-y-8 shadow-md">
              <div className="flex items-center space-x-4 border-b border-brand-text/5 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-[14px] font-black uppercase tracking-widest text-brand-text dark:text-white">Hero Configuration</h3>
                  <p className="text-[10px] text-brand-text/40 uppercase tracking-widest">Main storefront spotlight</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Main Heading</label>
                  <input 
                    type="text" 
                    value={content.hero.title}
                    onChange={(e) => setContent({...content, hero: {...content.hero, title: e.target.value}})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-serif italic"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Subtitle Narrative</label>
                  <textarea 
                    value={content.hero.subtitle}
                    onChange={(e) => setContent({...content, hero: {...content.hero, subtitle: e.target.value}})}
                    className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[13px] leading-relaxed"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">CTA Label</label>
                    <input 
                      type="text" 
                      value={content.hero.buttonText}
                      onChange={(e) => setContent({...content, hero: {...content.hero, buttonText: e.target.value}})}
                      className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[12px] font-bold uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">CTA Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={14} />
                      <input 
                        type="text" 
                        value={content.hero.buttonLink}
                        onChange={(e) => setContent({...content, hero: {...content.hero, buttonLink: e.target.value}})}
                        className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[12px] font-medium"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Backdrop Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20" size={14} />
                    <input 
                      type="text" 
                      value={content.hero.imageUrl}
                      onChange={(e) => setContent({...content, hero: {...content.hero, imageUrl: e.target.value}})}
                      className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 pl-12 pr-6 text-[12px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#12100e] rounded-[48px] overflow-hidden aspect-[9/16] relative group shadow-2xl border-4 border-white/5">
              <img src={content.hero.imageUrl} className="w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-110" alt="Preview" />
              <div className="absolute inset-0 p-8 flex flex-col justify-center space-y-4">
                <h4 className="text-2xl font-serif text-white italic leading-tight">{content.hero.title}</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-widest">{content.hero.subtitle}</p>
                <div className="pt-4">
                  <span className="px-6 py-3 bg-brand-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest">{content.hero.buttonText}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] text-white/60 font-black uppercase tracking-widest border border-white/10">
                Live Preview
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trending' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.trendingCollections.map((coll: any, index: number) => (
              <div key={index} className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 p-8 space-y-6 shadow-md relative group">
                <button 
                  onClick={() => {
                    const newColls = [...content.trendingCollections];
                    newColls.splice(index, 1);
                    setContent({...content, trendingCollections: newColls});
                  }}
                  className="absolute top-6 right-6 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-brand-text/5">
                    {coll.imageUrl ? (
                      <img src={coll.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-text/10">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Collection Name"
                      value={coll.title}
                      onChange={(e) => {
                        const newColls = [...content.trendingCollections];
                        newColls[index].title = e.target.value;
                        setContent({...content, trendingCollections: newColls});
                      }}
                      className="w-full bg-transparent border-b border-brand-text/10 py-2 text-[14px] font-bold focus:border-brand-gold transition-colors"
                    />
                    <input 
                      type="text" 
                      placeholder="Image URL"
                      value={coll.imageUrl}
                      onChange={(e) => {
                        const newColls = [...content.trendingCollections];
                        newColls[index].imageUrl = e.target.value;
                        setContent({...content, trendingCollections: newColls});
                      }}
                      className="w-full bg-transparent border-b border-brand-text/10 py-2 text-[12px] focus:border-brand-gold transition-colors"
                    />
                    <input 
                      type="text" 
                      placeholder="Link (e.g. /category/rings)"
                      value={coll.link}
                      onChange={(e) => {
                        const newColls = [...content.trendingCollections];
                        newColls[index].link = e.target.value;
                        setContent({...content, trendingCollections: newColls});
                      }}
                      className="w-full bg-transparent border-b border-brand-text/10 py-2 text-[12px] focus:border-brand-gold transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setContent({
                ...content, 
                trendingCollections: [...content.trendingCollections, { title: '', imageUrl: '', link: '' }]
              })}
              className="h-full min-h-[300px] border-2 border-dashed border-brand-text/10 rounded-[40px] flex flex-col items-center justify-center space-y-4 text-brand-text/20 hover:text-brand-gold hover:border-brand-gold/40 hover:bg-brand-gold/[0.02] transition-all"
            >
              <Plus size={32} />
              <span className="text-[10px] uppercase tracking-widest font-black">Add Trending Item</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-8">
            {content.promoBanners.map((banner: any, index: number) => (
              <div key={index} className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 p-10 shadow-md flex flex-col md:flex-row gap-10 relative group">
                <button 
                  onClick={() => {
                    const newBanners = [...content.promoBanners];
                    newBanners.splice(index, 1);
                    setContent({...content, promoBanners: newBanners});
                  }}
                  className="absolute top-8 right-8 p-3 bg-red-500/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="w-full md:w-1/3 aspect-video rounded-[32px] overflow-hidden bg-slate-100 border border-brand-text/5 shadow-inner">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-text/10">
                      <ImageIcon size={48} />
                    </div>
                  )}
                </div>

                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div className="space-y-3 col-span-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Banner Title</label>
                    <input 
                      type="text" 
                      value={banner.title}
                      onChange={(e) => {
                        const newBanners = [...content.promoBanners];
                        newBanners[index].title = e.target.value;
                        setContent({...content, promoBanners: newBanners});
                      }}
                      className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[14px] font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Image Source</label>
                    <input 
                      type="text" 
                      value={banner.imageUrl}
                      onChange={(e) => {
                        const newBanners = [...content.promoBanners];
                        newBanners[index].imageUrl = e.target.value;
                        setContent({...content, promoBanners: newBanners});
                      }}
                      className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[12px]"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Destination Link</label>
                    <input 
                      type="text" 
                      value={banner.link}
                      onChange={(e) => {
                        const newBanners = [...content.promoBanners];
                        newBanners[index].link = e.target.value;
                        setContent({...content, promoBanners: newBanners});
                      }}
                      className="w-full bg-slate-50 border border-brand-text/15 rounded-2xl py-4 px-6 text-[12px]"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setContent({
                ...content, 
                promoBanners: [...content.promoBanners, { title: '', imageUrl: '', link: '', subtitle: '' }]
              })}
              className="w-full py-10 border-2 border-dashed border-brand-text/10 rounded-[48px] flex flex-col items-center justify-center space-y-4 text-brand-text/20 hover:text-brand-gold hover:border-brand-gold/40 hover:bg-brand-gold/[0.02] transition-all"
            >
              <Plus size={32} />
              <span className="text-[10px] uppercase tracking-widest font-black">Add Promotional Banner</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

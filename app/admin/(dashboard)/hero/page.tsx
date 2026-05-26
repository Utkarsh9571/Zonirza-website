'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, GripVertical, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CTA {
  label: string;
  link: string;
}

interface HeroSlide {
  _id?: string;
  title: string;
  subtitle: string;
  videoDesktop: string;
  videoMobile: string;
  posterImage: string;
  primaryCTA: CTA;
  secondaryCTA: CTA;
  isActive: boolean;
  order: number;
}

export default function AdminHeroCMS() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const defaultSlide: HeroSlide = {
    title: 'New Luxury Collection',
    subtitle: 'Discover timeless elegance.',
    videoDesktop: '',
    videoMobile: '',
    posterImage: '',
    primaryCTA: { label: 'Explore Now', link: '/products' },
    secondaryCTA: { label: '', link: '' },
    isActive: true,
    order: slides.length
  };

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hero-slides');
      const data = await res.json();
      if (data.success) {
        setSlides(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;
    setIsSaving(true);
    try {
      const method = editingSlide._id ? 'PATCH' : 'POST';
      const url = editingSlide._id ? `/api/admin/hero-slides/${editingSlide._id}` : '/api/admin/hero-slides';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide)
      });
      
      if (res.ok) {
        setEditingSlide(null);
        fetchSlides();
      } else {
        const error = await res.json();
        alert('Failed to save slide: ' + error.message);
      }
    } catch (error) {
      console.error('Failed to save slide:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSlides();
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  const toggleStatus = async (slide: HeroSlide) => {
    try {
      const res = await fetch(`/api/admin/hero-slides/${slide._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !slide.isActive })
      });
      if (res.ok) fetchSlides();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Content Management</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Cinematic Hero
          </h1>
        </div>
        <button 
          onClick={() => setEditingSlide(defaultSlide)}
          className="flex items-center space-x-3 px-8 py-4 bg-brand-gold hover:bg-[#B4925A] text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-500 shadow-premium active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Slide</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Slide List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/60 dark:text-white/60 mb-4">Current Slides</h2>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-brand-gold" size={24} />
            </div>
          ) : slides.length === 0 ? (
            <div className="bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl p-8 text-center">
              <p className="text-xs text-brand-text/40 font-bold uppercase tracking-widest">No slides found</p>
            </div>
          ) : (
            slides.map((slide, idx) => (
              <div 
                key={slide._id} 
                className={cn(
                  "bg-white dark:bg-[#1A1A1A] border rounded-2xl p-4 transition-all flex flex-col gap-4 shadow-sm",
                  editingSlide?._id === slide._id ? "border-brand-gold ring-1 ring-brand-gold" : "border-brand-text/10 dark:border-white/10 hover:border-brand-gold/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="cursor-move text-brand-text/20 hover:text-brand-gold">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-brand-text dark:text-white truncate" dangerouslySetInnerHTML={{ __html: slide.title }} />
                    <p className="text-[10px] text-brand-text/50 uppercase tracking-widest truncate">Order: {slide.order}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => toggleStatus(slide)}
                      className={cn(
                        "w-8 h-4 rounded-full relative transition-colors duration-500",
                        slide.isActive ? "bg-emerald-500" : "bg-red-500"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-2 h-2 bg-white rounded-full transition-all duration-500",
                        slide.isActive ? "left-5" : "left-1"
                      )} />
                    </button>
                    <button onClick={() => setEditingSlide(slide)} className="p-1.5 text-brand-text/40 hover:text-brand-gold">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(slide._id!)} className="p-1.5 text-brand-text/40 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Media Preview Strip */}
                <div className="flex items-center gap-2 px-6">
                  {slide.videoDesktop ? <Video size={12} className="text-emerald-500" /> : <Video size={12} className="text-red-500" />}
                  <span className="text-[9px] text-brand-text/40">Desktop</span>
                  <div className="w-px h-3 bg-brand-text/10" />
                  {slide.videoMobile ? <Video size={12} className="text-emerald-500" /> : <Video size={12} className="text-red-500" />}
                  <span className="text-[9px] text-brand-text/40">Mobile</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Col: Editor */}
        <div className="lg:col-span-2">
          {editingSlide ? (
            <div className="bg-white dark:bg-[#1A1A1A] border border-brand-text/10 dark:border-white/10 rounded-[32px] p-6 md:p-8 shadow-premium relative">
              <button 
                onClick={() => setEditingSlide(null)}
                className="absolute top-6 right-6 p-2 bg-brand-text/5 rounded-full text-brand-text/40 hover:text-brand-text"
              >
                <X size={16} />
              </button>
              
              <h2 className="text-xl font-serif font-bold text-brand-text dark:text-white mb-6">
                {editingSlide._id ? 'Edit Slide' : 'Create New Slide'}
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Headline (HTML allowed)</label>
                    <input 
                      type="text" 
                      required
                      value={editingSlide.title}
                      onChange={(e) => setEditingSlide({...editingSlide, title: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold outline-none" 
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Subtitle</label>
                    <textarea 
                      rows={2}
                      required
                      value={editingSlide.subtitle}
                      onChange={(e) => setEditingSlide({...editingSlide, subtitle: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold outline-none" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60 flex items-center gap-2"><Video size={12}/> Desktop Video URL (WebM/MP4)</label>
                    <input 
                      type="url" 
                      required
                      value={editingSlide.videoDesktop}
                      onChange={(e) => setEditingSlide({...editingSlide, videoDesktop: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold outline-none" 
                    />
                    <p className="text-[9px] text-brand-text/40 italic">Recommended: 1920x1080, &lt; 5MB</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60 flex items-center gap-2"><Video size={12}/> Mobile Video URL (WebM/MP4)</label>
                    <input 
                      type="url" 
                      required
                      value={editingSlide.videoMobile}
                      onChange={(e) => setEditingSlide({...editingSlide, videoMobile: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold outline-none" 
                    />
                    <p className="text-[9px] text-brand-text/40 italic">Recommended: 1080x1920, &lt; 3MB</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60 flex items-center gap-2"><ImageIcon size={12}/> Fallback Poster Image URL</label>
                    <input 
                      type="url" 
                      required
                      value={editingSlide.posterImage}
                      onChange={(e) => setEditingSlide({...editingSlide, posterImage: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold outline-none" 
                    />
                    <p className="text-[9px] text-brand-text/40 italic">Shown while video loads or if autoplay fails</p>
                  </div>

                  {/* Primary CTA */}
                  <div className="space-y-2 p-4 bg-brand-bg dark:bg-black/20 rounded-2xl border border-brand-text/5 dark:border-white/5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold mb-2 block">Primary CTA</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Label" required
                        value={editingSlide.primaryCTA.label}
                        onChange={(e) => setEditingSlide({...editingSlide, primaryCTA: { ...editingSlide.primaryCTA, label: e.target.value }})}
                        className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-lg py-2 px-3 text-xs outline-none" 
                      />
                      <input 
                        type="text" placeholder="Link (e.g. /products)" required
                        value={editingSlide.primaryCTA.link}
                        onChange={(e) => setEditingSlide({...editingSlide, primaryCTA: { ...editingSlide.primaryCTA, link: e.target.value }})}
                        className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-lg py-2 px-3 text-xs outline-none" 
                      />
                    </div>
                  </div>

                  {/* Secondary CTA */}
                  <div className="space-y-2 p-4 bg-brand-bg dark:bg-black/20 rounded-2xl border border-brand-text/5 dark:border-white/5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60 mb-2 block">Secondary CTA (Optional)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Label"
                        value={editingSlide.secondaryCTA?.label || ''}
                        onChange={(e) => setEditingSlide({...editingSlide, secondaryCTA: { ...editingSlide.secondaryCTA, link: editingSlide.secondaryCTA?.link || '', label: e.target.value }})}
                        className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-lg py-2 px-3 text-xs outline-none" 
                      />
                      <input 
                        type="text" placeholder="Link"
                        value={editingSlide.secondaryCTA?.link || ''}
                        onChange={(e) => setEditingSlide({...editingSlide, secondaryCTA: { ...editingSlide.secondaryCTA, label: editingSlide.secondaryCTA?.label || '', link: e.target.value }})}
                        className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-lg py-2 px-3 text-xs outline-none" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2 max-w-xs">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Display Order</label>
                    <input 
                      type="number" 
                      required
                      value={editingSlide.order}
                      onChange={(e) => setEditingSlide({...editingSlide, order: parseInt(e.target.value)})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold outline-none" 
                    />
                  </div>

                </div>

                <div className="pt-6 flex items-center gap-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-brand-gold hover:bg-[#B4925A] text-[#12100e] px-8 py-4 rounded-xl font-bold text-[12px] uppercase tracking-[0.2em] transition-all"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    <span>Save Slide</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingSlide(null)}
                    className="px-6 py-4 rounded-xl text-brand-text/60 hover:text-brand-text font-bold text-xs uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-brand-text/20 dark:border-white/20 rounded-[32px] bg-brand-bg/50 dark:bg-white/2">
              <Video className="text-brand-text/20 mb-4" size={48} />
              <p className="text-brand-text/50 font-serif italic text-lg">Select a slide to edit or create a new one.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

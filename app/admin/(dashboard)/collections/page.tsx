'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  Image as ImageIcon,
  Tag,
  CheckCircle2,
  XCircle,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Collection = { _id: string; name: string; slug: string; image: string; description?: string; tags: string[]; isActive: boolean; productCount?: number };

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '', 
    image: '', 
    description: '',
    tags: [] as string[],
    isActive: true
  });
  const [tagInput, setTagInput] = useState('');

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/collections');
      const data = await res.json();
      if (data.success) setCollections(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCollection ? 'PATCH' : 'POST';
    const url = editingCollection ? `/api/admin/collections/${editingCollection._id}` : '/api/admin/collections';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingCollection(null);
        setFormData({ name: '', slug: '', image: '', description: '', tags: [], isActive: true });
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Editorial Vault</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Collections <span className="not-italic text-brand-text/20 dark:text-white/20">({collections.length})</span>
          </h1>
        </div>
        <button 
          onClick={() => {
            setEditingCollection(null);
            setFormData({ name: '', slug: '', image: '', description: '', tags: [], isActive: true });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-8 py-4 bg-brand-gold text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-widest shadow-premium"
        >
          <Sparkles size={18} />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-brand-gold animate-spin" size={40} />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Curating Gallery...</p>
          </div>
        ) : collections.map((col) => (
          <div key={col._id} className="bg-white dark:bg-white/10 rounded-[48px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-md group flex flex-col md:flex-row">
            <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-slate-100 overflow-hidden">
              {col.image ? (
                <img src={col.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={col.name} />
              ) : (
                <ImageIcon size={40} className="text-brand-text/10" />
              )}
              <div className="absolute top-6 left-6">
                <div className={cn(
                  "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg backdrop-blur-md",
                  col.isActive ? "bg-emerald-500/80 text-white border-emerald-400" : "bg-red-500/80 text-white border-red-400"
                )}>
                  {col.isActive ? 'Live' : 'Hidden'}
                </div>
              </div>
            </div>
            <div className="flex-1 p-10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-brand-text dark:text-white">{col.name}</h3>
                  <button 
                    onClick={() => {
                      setEditingCollection(col);
                      setFormData({ ...col });
                      setIsModalOpen(true);
                    }}
                    className="p-3 bg-brand-bg dark:bg-white/5 rounded-2xl text-brand-text/40 hover:text-brand-gold transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <p className="text-[12px] text-brand-text/40 dark:text-white/40 line-clamp-2 leading-relaxed uppercase tracking-widest font-medium">
                  {col.description || 'An editorial curation for the discerning collector.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {col.tags.map((tag: string) => (
                    <span key={tag} className="flex items-center space-x-1 px-3 py-1 bg-brand-gold/5 text-brand-gold border border-brand-gold/10 rounded-full text-[9px] font-bold uppercase tracking-widest">
                      <Tag size={8} />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-brand-text/5 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-brand-gold">
                  <Package size={14} />
                  <span className="text-[12px] font-black">{col.productCount} Items Linked</span>
                </div>
                <span className="text-[10px] text-brand-text/20 uppercase tracking-[0.3em] font-bold">/{col.slug}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1614] rounded-[48px] shadow-2xl p-12 border border-brand-text/15 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-brand-text italic mb-10">
              {editingCollection ? 'Refine' : 'Incept'} <span className="not-italic text-brand-text/20">Collection</span>
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Slug</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Image URL</label>
                  <input 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                    required
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Editorial Tags (Mapping)</label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="Add tag..."
                    />
                    <button type="button" onClick={addTag} className="p-4 bg-brand-bg rounded-2xl text-brand-gold"><Plus size={20} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="flex items-center space-x-2 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-bold">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(tag)}><XCircle size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                    rows={4}
                  />
                </div>
              </div>
              <div className="md:col-span-2 pt-6">
                <button 
                  type="submit"
                  className="w-full bg-brand-gold text-[#12100e] py-5 rounded-3xl font-bold text-[13px] uppercase tracking-[0.4em] shadow-premium"
                >
                  {editingCollection ? 'Preserve Curation' : 'Initialize Curation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

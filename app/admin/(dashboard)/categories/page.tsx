'use client';

import { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  Image as ImageIcon,
  ChevronRight,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCategory ? 'PATCH' : 'POST';
    const url = editingCategory ? `/api/admin/categories/${editingCategory._id}` : '/api/admin/categories';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', image: '', description: '' });
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Classification Hub</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Categories <span className="not-italic text-brand-text/20 dark:text-white/20">({categories.length})</span>
          </h1>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', image: '', description: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-8 py-4 bg-brand-gold text-[#12100e] rounded-2xl font-bold text-[12px] uppercase tracking-widest shadow-premium"
        >
          <Plus size={18} />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-brand-gold animate-spin" size={40} />
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-brand-text/40">Loading Atelier...</p>
          </div>
        ) : categories.map((cat) => (
          <div key={cat._id} className="bg-white dark:bg-white/10 rounded-[40px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-md group">
            <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
              {cat.image ? (
                <img src={cat.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={cat.name} />
              ) : (
                <ImageIcon size={40} className="text-brand-text/10" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <button 
                  onClick={() => {
                    setEditingCategory(cat);
                    setFormData({ name: cat.name, slug: cat.slug, image: cat.image, description: cat.description || '' });
                    setIsModalOpen(true);
                  }}
                  className="p-3 bg-white rounded-full text-brand-text hover:text-brand-gold transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold text-brand-text dark:text-white">{cat.name}</h3>
                <div className="flex items-center space-x-2 text-brand-gold">
                  <Package size={14} />
                  <span className="text-[12px] font-black">{cat.productCount}</span>
                </div>
              </div>
              <p className="text-[12px] text-brand-text/40 dark:text-white/40 line-clamp-2 leading-relaxed uppercase tracking-widest font-medium">
                {cat.description || 'No description provided for this collection.'}
              </p>
              <div className="pt-4 border-t border-brand-text/5 flex items-center justify-between">
                <span className="text-[10px] text-brand-text/20 uppercase tracking-[0.3em] font-bold">/{cat.slug}</span>
                <ChevronRight size={16} className="text-brand-gold" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1614] rounded-[40px] shadow-2xl p-10 border border-brand-text/15">
            <h2 className="text-2xl font-serif font-bold text-brand-text italic mb-8">
              {editingCategory ? 'Refine' : 'Initialize'} <span className="not-italic text-brand-text/20">Category</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Display Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                  placeholder="e.g. Bridal Rings"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">URL Slug</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                  placeholder="e.g. bridal-rings"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Cover Image URL</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                  placeholder="/images/categories/rings.jpg"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-brand-text/20 rounded-2xl py-4 px-6 text-[14px]"
                  rows={3}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-brand-gold text-[#12100e] py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest shadow-premium mt-4"
              >
                {editingCategory ? 'Update Collection' : 'Create Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

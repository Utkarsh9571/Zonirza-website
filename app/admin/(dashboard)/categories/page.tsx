'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Loader2,
  Image as ImageIcon,
  ChevronRight,
  Package,
  Check
} from 'lucide-react';

type Category = { _id: string; name: string; slug: string; image: string; description?: string; productCount?: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<any>({ name: '', slug: '', image: '', description: '', config: {} });
  const [modalTab, setModalTab] = useState<'basic' | 'visibility' | 'weight' | 'charges'>('basic');

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

  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setFormData({ name: '', slug: '', image: '', description: '', config: {} });
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
            setFormData({ name: '', slug: '', image: '', description: '', config: {} });
            setModalTab('basic');
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
                    setFormData({ 
                      name: cat.name, 
                      slug: cat.slug, 
                      image: cat.image, 
                      description: cat.description || '',
                      config: (cat as any).config || {} 
                    });
                    setModalTab('basic');
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
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1a1614] rounded-[40px] shadow-2xl p-10 border border-brand-text/15">
            <h2 className="text-2xl font-serif font-bold text-brand-text italic mb-6">
              {editingCategory ? 'Refine' : 'Initialize'} <span className="not-italic text-brand-text/20">Category</span>
            </h2>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-brand-text/10 mb-6 overflow-x-auto pb-2">
              {[
                { id: 'basic', label: 'Basic Info' },
                { id: 'visibility', label: 'Variant Visibility' },
                { id: 'weight', label: 'Weight Rules' },
                { id: 'charges', label: 'Making Charges' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModalTab(tab.id as any)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap border-b-2 transition-colors ${
                    modalTab === tab.id 
                      ? 'border-brand-gold text-brand-gold' 
                      : 'border-transparent text-brand-text/40 hover:text-brand-text/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {modalTab === 'basic' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="e.g. Bridal Rings"
                      required
                    />
                  </div>
                  {!editingCategory && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Configuration Template</label>
                      <select
                        onChange={(e) => {
                          const t = e.target.value;
                          let newConfig: any = {};
                          if (t === 'ring') {
                            newConfig = { variantVisibility: { size: true, metal: true, purity: true, diamondQuality: true }, weightRules: { baseSize: 12, sizeIncrementWeight: 0.12 }, makingCharges: { type: 'percentage', value: 15 } };
                          } else if (t === 'chain') {
                            newConfig = { variantVisibility: { length: true, metal: true, purity: true }, weightRules: { baseLength: 20, lengthIncrementWeight: 0.25 }, makingCharges: { type: 'percentage', value: 12 } };
                          } else if (t === 'pendant') {
                            newConfig = { variantVisibility: { metal: true, purity: true, diamondQuality: true }, weightRules: {}, makingCharges: { type: 'fixed', value: 3500 } };
                          } else if (t === 'coin') {
                            newConfig = { variantVisibility: { metal: true, purity: true }, weightRules: {}, makingCharges: { type: 'fixed', value: 500 } };
                          }
                          setFormData({ ...formData, config: newConfig });
                        }}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      >
                        <option value="">Blank Canvas (Custom)</option>
                        <option value="ring">Ring Template</option>
                        <option value="chain">Chain Template</option>
                        <option value="pendant">Pendant Template</option>
                        <option value="coin">Gold Coin Template</option>
                      </select>
                      <p className="text-[9px] text-brand-text/40 ml-2 italic">Pre-populates visibility, weight rules, and making charges.</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">URL Slug</label>
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="e.g. bridal-rings"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Cover Image URL</label>
                    <input 
                      type="text" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="/images/categories/rings.jpg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {modalTab === 'visibility' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-[11px] text-brand-text/60 mb-4">Toggle which variant selectors should be visible on the product page for this category.</p>
                  
                  {['size', 'length', 'width', 'metal', 'purity', 'diamondQuality', 'diamondWeight', 'stone', 'gender', 'deliveryMode'].map(field => {
                    const isChecked = formData.config?.variantVisibility?.[field] ?? false;
                    return (
                      <label key={field} className="flex items-center space-x-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-brand-gold border-brand-gold text-white' : 'border-brand-text/30 group-hover:border-brand-gold'}`}>
                          {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={isChecked}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              config: {
                                ...formData.config,
                                variantVisibility: {
                                  ...(formData.config?.variantVisibility || {}),
                                  [field]: e.target.checked
                                }
                              }
                            });
                          }}
                        />
                        <span className="text-[12px] font-bold text-brand-text uppercase tracking-widest">{field.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {modalTab === 'weight' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Base Size</label>
                    <input 
                      type="number" step="0.1"
                      value={formData.config?.weightRules?.baseSize || ''}
                      onChange={(e) => setFormData({
                        ...formData, config: { ...formData.config, weightRules: { ...formData.config?.weightRules, baseSize: parseFloat(e.target.value) } }
                      })}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="e.g. 12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Size Increment Wt (g)</label>
                    <input 
                      type="number" step="0.01"
                      value={formData.config?.weightRules?.sizeIncrementWeight || ''}
                      onChange={(e) => setFormData({
                        ...formData, config: { ...formData.config, weightRules: { ...formData.config?.weightRules, sizeIncrementWeight: parseFloat(e.target.value) } }
                      })}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="e.g. 0.12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Base Length</label>
                    <input 
                      type="number" step="0.1"
                      value={formData.config?.weightRules?.baseLength || ''}
                      onChange={(e) => setFormData({
                        ...formData, config: { ...formData.config, weightRules: { ...formData.config?.weightRules, baseLength: parseFloat(e.target.value) } }
                      })}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="e.g. 20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Length Increment Wt (g)</label>
                    <input 
                      type="number" step="0.01"
                      value={formData.config?.weightRules?.lengthIncrementWeight || ''}
                      onChange={(e) => setFormData({
                        ...formData, config: { ...formData.config, weightRules: { ...formData.config?.weightRules, lengthIncrementWeight: parseFloat(e.target.value) } }
                      })}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="e.g. 0.25"
                    />
                  </div>
                </div>
              )}

              {modalTab === 'charges' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Charge Type</label>
                    <select
                      value={formData.config?.makingCharges?.type || 'percentage'}
                      onChange={(e) => setFormData({
                        ...formData, config: { ...formData.config, makingCharges: { ...formData.config?.makingCharges, type: e.target.value } }
                      })}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Value</label>
                    <input 
                      type="number" step="0.01"
                      value={formData.config?.makingCharges?.value || ''}
                      onChange={(e) => setFormData({
                        ...formData, config: { ...formData.config, makingCharges: { ...formData.config?.makingCharges, value: parseFloat(e.target.value) } }
                      })}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/10 rounded-2xl py-4 px-6 text-[14px]"
                      placeholder="e.g. 15 for 15%"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-brand-gold text-[#12100e] py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest shadow-premium mt-4 hover:opacity-90 transition-opacity"
              >
                {editingCategory ? 'Save Configuration' : 'Create Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

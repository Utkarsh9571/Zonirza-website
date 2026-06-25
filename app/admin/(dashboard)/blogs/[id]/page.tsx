'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Loader2, Upload } from 'lucide-react';

export default function BlogAdminForm({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: '',
    seoTitle: '',
    seoDescription: '',
    author: '',
    isFeatured: false,
    isPublished: false,
    coverImage: '',
    heroImage: ''
  });

  useEffect(() => {
    if (!isNew) fetchBlog();
  }, [isNew]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`);
      const data = await res.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isNew ? '/api/admin/blogs' : `/api/admin/blogs/${id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          router.push(`/admin/blogs/${data.data._id}`);
        } else {
          alert('Saved successfully');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'hero') => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!formData.slug) {
      alert('Please enter a slug first. It is required for blog image folders.');
      return;
    }

    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('category', formData.slug);
    data.append('type', 'blog');

    if (type === 'cover') setUploadingCover(true);
    else setUploadingHero(true);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const resData = await res.json();
      if (resData.success && resData.data.length > 0) {
        const url = resData.data[0].url;
        setFormData({ ...formData, [type === 'cover' ? 'coverImage' : 'heroImage']: url });
      } else {
        alert(resData.error || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      if (type === 'cover') setUploadingCover(false);
      else setUploadingHero(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blogs" className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-gold/10 hover:text-brand-gold transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-brand-text dark:text-white">
            {isNew ? 'Create Blog Metadata' : 'Edit Blog Metadata'}
          </h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-gold text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center space-x-2 hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          <span>Save Metadata</span>
        </button>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-3xl p-8 space-y-6 border border-brand-text/10 dark:border-white/10 shadow-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-3 px-4 text-[13px] text-brand-text dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Slug (Required for images)</label>
            <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-3 px-4 text-[13px] text-brand-text dark:text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Excerpt</label>
          <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={3} className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-3 px-4 text-[13px] text-brand-text dark:text-white" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Category</label>
            <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-3 px-4 text-[13px] text-brand-text dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">Author</label>
            <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-3 px-4 text-[13px] text-brand-text dark:text-white" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">SEO Title</label>
            <input type="text" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-3 px-4 text-[13px] text-brand-text dark:text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold">SEO Description</label>
            <input type="text" value={formData.seoDescription} onChange={e => setFormData({...formData, seoDescription: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/20 dark:border-white/20 rounded-2xl py-3 px-4 text-[13px] text-brand-text dark:text-white" />
          </div>
        </div>

        <div className="flex items-center space-x-6 pt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold" />
            <span className="text-[13px] font-medium text-brand-text dark:text-white">Published</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold" />
            <span className="text-[13px] font-medium text-brand-text dark:text-white">Featured</span>
          </label>
        </div>

        <div className="pt-8 border-t border-brand-text/10 dark:border-white/10 space-y-6">
          <h3 className="text-[12px] uppercase tracking-[0.3em] font-black text-brand-text dark:text-white">Assets</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Cover Image</label>
                <label className="cursor-pointer text-[10px] bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-full font-bold uppercase tracking-widest hover:bg-brand-gold/20 flex items-center space-x-2">
                  {uploadingCover ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  <span>Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, 'cover')} disabled={uploadingCover} />
                </label>
              </div>
              {formData.coverImage ? (
                <img src={formData.coverImage} className="w-full h-40 object-cover rounded-2xl" alt="Cover" />
              ) : (
                <div className="w-full h-40 bg-slate-100 dark:bg-white/5 rounded-2xl border-2 border-dashed border-brand-text/20 flex items-center justify-center text-[11px] text-brand-text/50">No cover image</div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">Hero Image</label>
                <label className="cursor-pointer text-[10px] bg-brand-gold/10 text-brand-gold px-3 py-1.5 rounded-full font-bold uppercase tracking-widest hover:bg-brand-gold/20 flex items-center space-x-2">
                  {uploadingHero ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  <span>Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => uploadImage(e, 'hero')} disabled={uploadingHero} />
                </label>
              </div>
              {formData.heroImage ? (
                <img src={formData.heroImage} className="w-full h-40 object-cover rounded-2xl" alt="Hero" />
              ) : (
                <div className="w-full h-40 bg-slate-100 dark:bg-white/5 rounded-2xl border-2 border-dashed border-brand-text/20 flex items-center justify-center text-[11px] text-brand-text/50">No hero image</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

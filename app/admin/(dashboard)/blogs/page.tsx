'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog metadata?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) fetchBlogs();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-brand-text dark:text-white">Blog Metadata</h1>
        <Link 
          href="/admin/blogs/new"
          className="bg-brand-gold text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center space-x-2 hover:bg-brand-gold/90 transition-colors"
        >
          <Plus size={16} />
          <span>New Blog</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-sm border border-brand-text/10 dark:border-white/10">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-white/5 border-b border-brand-text/10 dark:border-white/10">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-brand-text/50 dark:text-white/50 uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-[10px] font-bold text-brand-text/50 dark:text-white/50 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-brand-text/50 dark:text-white/50 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-brand-text/50 dark:text-white/50 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-text/10 dark:divide-white/10">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-[13px] font-medium text-brand-text dark:text-white">{blog.title}</td>
                <td className="px-6 py-4 text-[13px] text-brand-text/70 dark:text-white/70">{blog.category || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center space-x-3">
                  <Link href={`/admin/blogs/${blog._id}`} className="text-brand-text/50 hover:text-brand-gold transition-colors">
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => deleteBlog(blog._id)} className="text-brand-text/50 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-brand-text/50">No blog metadata entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function QuotesDashboard() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes?status=${filter}`);
      const data = await res.json();
      if (data.success) {
        setQuotes(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const statusColors: Record<string, string> = {
    'Pending Review': 'bg-amber-100 text-amber-800',
    'In Consultation': 'bg-blue-100 text-blue-800',
    'Quoted': 'bg-purple-100 text-purple-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Converted To Order': 'bg-emerald-100 text-emerald-800',
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-brand-text dark:text-white">Custom Quotes</h1>
          <p className="text-sm text-brand-text/60 mt-2">Manage customer customization requests and quotes</p>
        </div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['All', 'Pending Review', 'In Consultation', 'Quoted', 'Approved', 'Rejected', 'Converted To Order'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
              filter === status 
                ? 'bg-brand-gold text-white shadow-md' 
                : 'bg-white dark:bg-[#1a1614] text-brand-text/60 border border-brand-text/10 hover:border-brand-gold'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-white/5 rounded-4xl border border-brand-text/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 text-center text-brand-text/50">Loading requests...</div>
        ) : quotes.length === 0 ? (
          <div className="p-20 text-center text-brand-text/50">No quote requests found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-text/5 bg-slate-50/50 dark:bg-black/20">
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-text/40">Request ID / Date</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-text/40">Customer</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-text/40">Product</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-text/40">Status</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-black text-brand-text/40 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote._id} className="border-b border-brand-text/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="text-xs font-mono font-bold text-brand-gold">{quote._id.slice(-6).toUpperCase()}</div>
                    <div className="text-xs text-brand-text/50 mt-1">{new Date(quote.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-sm font-bold text-brand-text dark:text-white">{quote.customerInfo?.name || 'Guest'}</div>
                    <div className="text-xs text-brand-text/50 mt-1">{quote.customerInfo?.email}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-brand-gold/20 bg-white">
                        <img src={quote.product?.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-brand-text dark:text-white line-clamp-1">{quote.product?.name || 'Unknown Product'}</div>
                        <div className="text-[10px] uppercase tracking-widest text-brand-text/50 mt-1">
                          {quote.configuration.metal} • {quote.configuration.purity}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[quote.status]}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <Link href={`/admin/quotes/${quote._id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-gold text-white hover:bg-brand-gold/90 transition-colors shadow-sm">
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

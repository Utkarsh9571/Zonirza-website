'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MessageSquare, IndianRupee, Image as ImageIcon, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, [id]);

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/admin/quotes/${id}`);
      const data = await res.json();
      if (data.success) {
        setQuote(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: quote.status,
          adminNotes: quote.adminNotes,
          quotedPrice: quote.quotedPrice,
          quotedMakingCharges: quote.quotedMakingCharges
        })
      });
      if (res.ok) {
        alert('Quote updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading quote details...</div>;
  if (!quote) return <div className="p-20 text-center">Quote not found.</div>;

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-center bg-white dark:bg-[#1a1614] p-6 rounded-[32px] border border-brand-text/10 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/admin/quotes" className="p-3 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-text/10">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-serif text-brand-text dark:text-white flex items-center">
              Quote Request <span className="ml-3 px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold tracking-widest uppercase rounded-full">#{quote._id.slice(-6).toUpperCase()}</span>
            </h1>
            <p className="text-xs text-brand-text/50 mt-1 flex items-center"><Calendar size={12} className="mr-1" /> {new Date(quote.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-3 bg-brand-gold text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-md hover:bg-brand-gold/90 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Updates</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customer & Request Info */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-white/5 rounded-[32px] border border-brand-text/10 p-8 space-y-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold flex items-center">
              <MessageSquare size={16} className="mr-2" /> Customer Consultation Request
            </h2>
            <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-2xl p-6 text-sm text-brand-text dark:text-white leading-relaxed italic">
              "{quote.customizationNotes}"
            </div>
            
            {quote.inspirationImages?.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-brand-text/10">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/60 flex items-center">
                  <ImageIcon size={14} className="mr-2" /> Attached Inspirations ({quote.inspirationImages.length})
                </h3>
                <div className="flex flex-wrap gap-4">
                  {quote.inspirationImages.map((img: string, idx: number) => (
                    <a key={idx} href={img} target="_blank" rel="noreferrer" className="w-24 h-24 rounded-xl border border-brand-gold/20 overflow-hidden block hover:opacity-80 transition-opacity">
                      <img src={img} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {quote.complexity && (
            <div className="bg-brand-gold/5 dark:bg-brand-gold/10 rounded-[32px] border border-brand-gold/20 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse mr-2"></span>
                  AI Estimation Assistant
                </h2>
                <span className="px-3 py-1 bg-brand-gold text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-premium">
                  {quote.complexity}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-[#1a1614] p-5 rounded-2xl border border-brand-gold/20">
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-text/50 mb-1">Estimated Range</p>
                  <p className="text-xl font-serif text-brand-gold">
                    ₹ {quote.estimation?.estimatedPriceMin?.toLocaleString()} – ₹ {quote.estimation?.estimatedPriceMax?.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-brand-text/40 mt-2 italic">Based on base weight + bespoke variance buffer.</p>
                </div>
                <div className="bg-white dark:bg-[#1a1614] p-5 rounded-2xl border border-brand-gold/20 flex flex-col justify-center">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-brand-text/60 font-bold text-[10px] uppercase tracking-widest">Base Gold Wt:</span>
                    <span className="font-mono text-brand-text dark:text-white font-bold">{quote.estimation?.estimatedGoldWeight}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text/60 font-bold text-[10px] uppercase tracking-widest">Rule Surcharges:</span>
                    <span className="font-mono text-brand-gold font-bold">+ ₹ {quote.estimation?.estimatedSurcharges?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {quote.productionInsights?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Production Insights</h3>
                  {quote.productionInsights.map((insight: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-2 text-sm text-brand-text dark:text-white bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5">
                      <span className="text-brand-gold mt-0.5">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-white/5 rounded-[32px] border border-brand-text/10 p-8 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-6">Base Product Configuration</h2>
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 rounded-2xl border border-brand-text/10 overflow-hidden bg-slate-50 dark:bg-black/20 shrink-0">
                <img src={quote.product?.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4 w-full">
                <h3 className="text-lg font-bold text-brand-text dark:text-white">{quote.product?.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5">
                    <p className="text-[9px] uppercase tracking-widest text-brand-text/50">Metal</p>
                    <p className="text-sm font-bold text-brand-text dark:text-white mt-1">{quote.configuration.metal}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5">
                    <p className="text-[9px] uppercase tracking-widest text-brand-text/50">Purity</p>
                    <p className="text-sm font-bold text-brand-text dark:text-white mt-1">{quote.configuration.purity}</p>
                  </div>
                  {quote.configuration.size && (
                    <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5">
                      <p className="text-[9px] uppercase tracking-widest text-brand-text/50">Size</p>
                      <p className="text-sm font-bold text-brand-text dark:text-white mt-1">{quote.configuration.size}</p>
                    </div>
                  )}
                  {quote.configuration.stone && (
                    <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5">
                      <p className="text-[9px] uppercase tracking-widest text-brand-text/50">Stone</p>
                      <p className="text-sm font-bold text-brand-text dark:text-white mt-1">{quote.configuration.stone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Workflow & Admin Tools */}
        <div className="space-y-8">
          
          <div className="bg-white dark:bg-white/5 rounded-[32px] border border-brand-text/10 p-8 space-y-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">Workflow Status</h2>
            <select 
              value={quote.status}
              onChange={(e) => setQuote({ ...quote, status: e.target.value })}
              className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-4 text-sm font-bold text-brand-text dark:text-white"
            >
              <option value="Pending Review">Pending Review</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Quoted">Quoted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Converted To Order">Converted To Order</option>
            </select>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-[32px] border border-brand-text/10 p-8 space-y-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold flex items-center">
              <IndianRupee size={16} className="mr-2" /> Finalize Quote Pricing
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-text/60">Estimated Final Price (₹)</label>
                <input 
                  type="number"
                  value={quote.quotedPrice || ''}
                  onChange={(e) => setQuote({ ...quote, quotedPrice: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl py-3 px-4 text-sm font-bold text-brand-text dark:text-white"
                  placeholder="e.g. 150000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-text/60">Custom Making Charges (₹)</label>
                <input 
                  type="number"
                  value={quote.quotedMakingCharges || ''}
                  onChange={(e) => setQuote({ ...quote, quotedMakingCharges: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl py-3 px-4 text-sm font-bold text-brand-text dark:text-white"
                  placeholder="e.g. 25000"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-[32px] border border-brand-text/10 p-8 space-y-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">Customer Contact</h2>
            <div className="space-y-3 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-brand-text/5 text-sm">
              <p><strong>Name:</strong> {quote.customerInfo?.name}</p>
              <p><strong>Email:</strong> {quote.customerInfo?.email}</p>
              <p><strong>Phone:</strong> {quote.customerInfo?.phone}</p>
            </div>
            <a href={`mailto:${quote.customerInfo?.email}`} className="block w-full text-center py-3 border border-brand-gold text-brand-gold font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-brand-gold hover:text-white transition-colors">
              Email Customer
            </a>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-[32px] border border-brand-text/10 p-8 space-y-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">Internal Jeweler Notes</h2>
            <textarea 
              rows={5}
              value={quote.adminNotes || ''}
              onChange={(e) => setQuote({ ...quote, adminNotes: e.target.value })}
              placeholder="Private notes. The customer cannot see this."
              className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-4 text-sm font-mono text-brand-text dark:text-white focus:ring-1 focus:ring-brand-gold"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

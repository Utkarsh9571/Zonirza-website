'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, ShieldAlert, CheckCircle2, MessageSquare, IndianRupee } from 'lucide-react';
import { Button } from '@/components/new-ui/Button';

export default function RulesDashboard() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('restriction');
  const [isActive, setIsActive] = useState(true);
  
  // Scope
  const [categories, setCategories] = useState('');
  const [productIds, setProductIds] = useState('');
  
  // Triggers
  const [metals, setMetals] = useState('');
  const [purities, setPurities] = useState('');
  const [stones, setStones] = useState('');
  const [sizes, setSizes] = useState('');
  
  // Result
  const [message, setMessage] = useState('');
  const [surcharge, setSurcharge] = useState(0);
  const [surchargeType, setSurchargeType] = useState('fixed');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/rules');
      const data = await res.json();
      if (data.success) {
        setRules(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingRule(null);
    setName('');
    setType('restriction');
    setIsActive(true);
    setCategories('');
    setProductIds('');
    setMetals('');
    setPurities('');
    setStones('');
    setSizes('');
    setMessage('');
    setSurcharge(0);
    setSurchargeType('fixed');
  };

  const openEditModal = (rule: any) => {
    setEditingRule(rule);
    setName(rule.name);
    setType(rule.type);
    setIsActive(rule.isActive);
    setCategories(rule.scope?.categories?.join(', ') || '');
    setProductIds(rule.scope?.productIds?.join(', ') || '');
    setMetals(rule.trigger?.metals?.join(', ') || '');
    setPurities(rule.trigger?.purities?.join(', ') || '');
    setStones(rule.trigger?.stones?.join(', ') || '');
    setSizes(rule.trigger?.sizes?.join(', ') || '');
    setMessage(rule.result?.message || '');
    setSurcharge(rule.result?.surcharge || 0);
    setSurchargeType(rule.result?.surchargeType || 'fixed');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name,
      type,
      isActive,
      scope: {
        categories: categories.split(',').map(s => s.trim()).filter(Boolean),
        productIds: productIds.split(',').map(s => s.trim()).filter(Boolean),
      },
      trigger: {
        metals: metals.split(',').map(s => s.trim()).filter(Boolean),
        purities: purities.split(',').map(s => s.trim()).filter(Boolean),
        stones: stones.split(',').map(s => s.trim()).filter(Boolean),
        sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
      },
      result: {
        message,
        surcharge: type === 'surcharge' ? Number(surcharge) : undefined,
        surchargeType: type === 'surcharge' ? surchargeType : undefined,
      }
    };

    const url = editingRule ? `/api/admin/rules/${editingRule._id}` : '/api/admin/rules';
    const method = editingRule ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchRules();
        resetForm();
      } else {
        alert('Failed to save rule.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    try {
      const res = await fetch(`/api/admin/rules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRules();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading rules engine...</div>;

  return (
    <div className="max-w-7xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex justify-between items-center bg-white dark:bg-[#1a1614] p-6 rounded-[32px] border border-brand-text/10 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif text-brand-text dark:text-white">Configuration Rules Engine</h1>
          <p className="text-xs text-brand-text/50 mt-1 uppercase tracking-widest font-bold">Intelligent constraints & triggers</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="rounded-full shadow-premium px-6">
          <Plus size={16} className="mr-2" /> New Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => (
          <div key={rule._id} className="bg-white dark:bg-[#1a1614] rounded-[32px] border border-brand-text/10 p-6 flex flex-col hover:border-brand-gold/30 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                {rule.type === 'restriction' && <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0"><ShieldAlert size={14} /></div>}
                {rule.type === 'consultation' && <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><MessageSquare size={14} /></div>}
                {rule.type === 'surcharge' && <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0"><IndianRupee size={14} /></div>}
                <div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-brand-text/50">{rule.type}</span>
                  <h3 className="text-sm font-bold text-brand-text dark:text-white leading-tight">{rule.name}</h3>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => openEditModal(rule)} className="p-2 text-brand-text/40 hover:text-brand-gold transition-colors"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(rule._id)} className="p-2 text-brand-text/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5">
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 mb-1">Triggers If</p>
                <div className="text-xs font-mono text-brand-text/80 space-y-1">
                  {rule.trigger?.metals?.length > 0 && <p><span className="text-brand-text/40">Metal:</span> {rule.trigger.metals.join(', ')}</p>}
                  {rule.trigger?.purities?.length > 0 && <p><span className="text-brand-text/40">Purity:</span> {rule.trigger.purities.join(', ')}</p>}
                  {rule.trigger?.stones?.length > 0 && <p><span className="text-brand-text/40">Stone:</span> {rule.trigger.stones.join(', ')}</p>}
                  {rule.trigger?.sizes?.length > 0 && <p><span className="text-brand-text/40">Size:</span> {rule.trigger.sizes.join(', ')}</p>}
                  {(!rule.trigger?.metals?.length && !rule.trigger?.purities?.length && !rule.trigger?.stones?.length && !rule.trigger?.sizes?.length) && <p className="text-brand-text/30 italic">No specific triggers set</p>}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5">
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40 mb-1">Result</p>
                {rule.type === 'surcharge' ? (
                  <p className="text-xs font-bold text-brand-text dark:text-white">
                    + {rule.result?.surchargeType === 'percentage' ? `${rule.result?.surcharge}%` : `₹ ${rule.result?.surcharge}`}
                  </p>
                ) : (
                  <p className="text-xs text-brand-text/80 italic line-clamp-2">"{rule.result?.message || 'No message provided'}"</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-brand-text/10 flex justify-between items-center">
              <div className="flex items-center space-x-1 text-[9px] uppercase tracking-widest font-bold">
                <span className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-brand-text/50">{rule.isActive ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="text-[9px] uppercase tracking-widest font-bold text-brand-text/40">
                {(rule.scope?.categories?.length > 0 || rule.scope?.productIds?.length > 0) ? 'Specific Scope' : 'Global Scope'}
              </div>
            </div>
          </div>
        ))}
        {rules.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-brand-text/10 rounded-[32px]">
            <p className="text-brand-text/50 font-serif italic text-lg mb-2">No rules configured</p>
            <p className="text-xs uppercase tracking-widest font-bold text-brand-text/30">Create a rule to intelligently restrict combinations.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-text/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-[#1a1614] rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-premium animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-serif text-brand-text dark:text-white mb-6">{editingRule ? 'Edit Rule' : 'Create New Rule'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Rule Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g., No 22K for Diamonds" className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Rule Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm">
                    <option value="restriction">Restriction (Prevents checkout)</option>
                    <option value="consultation">Consultation (Forces quote request)</option>
                    <option value="surcharge">Surcharge (Alters price)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-brand-text/10 pt-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-4">Rule Scope (Optional)</h3>
                <p className="text-[10px] text-brand-text/50 mb-4">Leave empty to apply to all products.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Categories (Comma separated)</label>
                    <input value={categories} onChange={e => setCategories(e.target.value)} placeholder="e.g., Rings, Necklaces" className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Product IDs (Comma separated)</label>
                    <input value={productIds} onChange={e => setProductIds(e.target.value)} placeholder="Specific product IDs" className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-text/10 pt-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-4">Trigger Conditions</h3>
                <p className="text-[10px] text-brand-text/50 mb-4">Rule activates if ANY of the selected variants match the comma-separated lists below.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Metals</label>
                    <input value={metals} onChange={e => setMetals(e.target.value)} placeholder="e.g., Gold, Platinum" className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Purities</label>
                    <input value={purities} onChange={e => setPurities(e.target.value)} placeholder="e.g., 22K, 18K" className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Stones</label>
                    <input value={stones} onChange={e => setStones(e.target.value)} placeholder="e.g., Oversized Diamond" className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Sizes</label>
                    <input value={sizes} onChange={e => setSizes(e.target.value)} placeholder="e.g., Custom, 14+" className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-text/10 pt-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-4">Rule Result</h3>
                {type === 'surcharge' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Surcharge Amount</label>
                      <input type="number" required value={surcharge} onChange={e => setSurcharge(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Surcharge Type</label>
                      <select value={surchargeType} onChange={e => setSurchargeType(e.target.value)} className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm">
                        <option value="fixed">Fixed Amount (₹)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Display Message</label>
                    <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="e.g., This combination requires bespoke consultation." className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 rounded-xl p-3 text-sm" rows={3} />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 rounded text-brand-gold" id="isActive" />
                <label htmlFor="isActive" className="text-sm font-bold text-brand-text">Rule is Active</label>
              </div>

              <div className="flex justify-end space-x-4 border-t border-brand-text/10 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-brand-text/50 hover:text-brand-text">Cancel</button>
                <Button type="submit" className="rounded-full shadow-premium px-8">Save Rule</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

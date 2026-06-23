'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminFranchiseLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/franchise-leads?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, notes: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/franchise-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'contacted': return <CheckCircle2 className="text-emerald-500" size={14} />;
      case 'rejected': return <XCircle className="text-red-500" size={14} />;
      default: return <AlertCircle className="text-amber-500" size={14} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Expansion Pipeline</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Franchise <span className="not-italic text-brand-text/20 dark:text-white/20">Leads</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20 group-focus-within:text-brand-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search prospects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-white/5 border border-brand-text/10 rounded-2xl py-3 pl-12 pr-6 text-sm w-64 focus:ring-1 focus:ring-brand-gold/50 transition-all"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-white/5 border border-brand-text/10 rounded-2xl py-3 px-6 text-sm focus:ring-1 focus:ring-brand-gold/50 transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[48px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-premium">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-text/5">
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Prospect</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Location</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Investment</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Status</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Date</th>
              <th className="p-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-text/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-brand-gold mb-4" size={32} />
                  <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Retrieving Dossiers...</p>
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">No leads found in this sector.</p>
                </td>
              </tr>
            ) : filteredLeads.map((lead) => (
              <tr key={lead._id} className="group hover:bg-brand-gold/2 transition-colors">
                <td className="p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xs">
                      {lead.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-brand-text dark:text-white">{lead.name}</p>
                      <p className="text-[11px] text-brand-text/40">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center space-x-2 text-brand-text/60">
                    <MapPin size={14} className="text-brand-gold" />
                    <span className="text-[12px] font-medium">{lead.city}</span>
                  </div>
                </td>
                <td className="p-8">
                  <span className="text-[12px] font-bold text-brand-text/80">{lead.investmentRange}</span>
                </td>
                <td className="p-8">
                  <div className={cn(
                    "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    lead.status === 'contacted' ? "bg-emerald-500/10 text-emerald-600" :
                    lead.status === 'rejected' ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                  )}>
                    {getStatusIcon(lead.status)}
                    <span>{lead.status}</span>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center space-x-2 text-brand-text/40">
                    <Clock size={14} />
                    <span className="text-[12px]">{new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <button 
                    onClick={() => {
                      setSelectedLead(lead);
                      setIsModalOpen(true);
                    }}
                    className="p-3 bg-brand-gold/5 text-brand-gold rounded-xl hover:bg-brand-gold hover:text-white transition-all"
                  >
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedLead && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1614] rounded-[48px] shadow-2xl overflow-hidden border border-brand-text/15">
            <div className="p-10 space-y-8">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-black">Lead Profile</p>
                  <h2 className="text-3xl font-serif font-bold text-brand-text dark:text-white italic">{selectedLead.name}</h2>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  selectedLead.status === 'contacted' ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" :
                  selectedLead.status === 'rejected' ? "border-red-500/20 text-red-500 bg-red-500/5" :
                  "border-amber-500/20 text-amber-500 bg-amber-500/5"
                )}>
                  {selectedLead.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-brand-text/60">
                    <Mail size={16} className="text-brand-gold" />
                    <span className="text-[13px]">{selectedLead.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-brand-text/60">
                    <Phone size={16} className="text-brand-gold" />
                    <span className="text-[13px]">{selectedLead.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-brand-text/60">
                    <MapPin size={16} className="text-brand-gold" />
                    <span className="text-[13px]">{selectedLead.city}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/30">Investment Range</p>
                    <p className="text-[13px] font-bold text-brand-text">{selectedLead.investmentRange}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/30">Background</p>
                    <p className="text-[13px] font-bold text-brand-text line-clamp-1">{selectedLead.businessBackground}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Message Body</label>
                <div className="bg-slate-50 dark:bg-white/5 border border-brand-text/5 rounded-3xl p-6 text-[13px] text-brand-text/70 leading-relaxed italic">
                  &ldquo;{selectedLead.message}&rdquo;
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Administrative Notes</label>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/15 rounded-3xl p-6 text-[13px]"
                  placeholder="Internal notes about this prospect..."
                  rows={3}
                  defaultValue={selectedLead.adminNotes}
                  id="adminNotes"
                />
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button 
                  disabled={updating}
                  onClick={() => handleUpdateStatus(selectedLead._id, 'contacted', (document.getElementById('adminNotes') as HTMLTextAreaElement).value)}
                  className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-colors flex items-center justify-center"
                >
                  {updating ? <Loader2 className="animate-spin" size={16} /> : 'Mark Contacted'}
                </button>
                <button 
                  disabled={updating}
                  onClick={() => handleUpdateStatus(selectedLead._id, 'rejected', (document.getElementById('adminNotes') as HTMLTextAreaElement).value)}
                  className="flex-1 bg-white border border-red-500/20 text-red-500 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center justify-center"
                >
                  Reject Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

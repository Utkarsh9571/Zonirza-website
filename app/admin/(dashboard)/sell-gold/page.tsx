'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  CalendarCheck,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Inquiry = { _id: string; fullName: string; phone: string; email?: string; city: string; branch: string; jewelleryType?: string; approximateWeight?: number; knowsPurity?: boolean; purity?: string; preferredContactMethod: string; preferredVisitDate?: string; status: string; adminNotes?: string; notes?: string; imageUrls?: string[]; createdAt: string };

export default function AdminSellGoldLeadsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sell-gold/inquiries?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) setInquiries(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: string, notes: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/sell-gold/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredInquiries = inquiries.filter(inq => 
    inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (inq.email && inq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    inq.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-500" size={14} />;
      case 'closed': return <XCircle className="text-red-500" size={14} />;
      case 'contacted': return <Phone className="text-blue-500" size={14} />;
      case 'scheduled': return <CalendarCheck className="text-purple-500" size={14} />;
      case 'visited': return <Building2 className="text-indigo-500" size={14} />;
      default: return <AlertCircle className="text-amber-500" size={14} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">Sell Old Gold Program</p>
          <h1 className="text-4xl font-serif font-bold text-brand-text dark:text-white italic">
            Sell Gold <span className="not-italic text-brand-text/20 dark:text-white/20">Leads</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/20 group-focus-within:text-brand-gold transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="visited">Visited Store</option>
            <option value="completed">Completed (Sold)</option>
            <option value="closed">Closed / Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-[48px] border border-brand-text/15 dark:border-white/15 overflow-hidden shadow-premium">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-text/5">
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Customer</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Location</th>
              <th className="p-8 text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Details</th>
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
                  <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Retrieving Leads...</p>
                </td>
              </tr>
            ) : filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">No leads found.</p>
                </td>
              </tr>
            ) : filteredInquiries.map((inq) => (
              <tr key={inq._id} className="group hover:bg-brand-gold/2 transition-colors">
                <td className="p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xs">
                      {inq.fullName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-brand-text dark:text-white">{inq.fullName}</p>
                      <p className="text-[11px] text-brand-text/40">{inq.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center space-x-2 text-brand-text/60">
                    <MapPin size={14} className="text-brand-gold" />
                    <span className="text-[12px] font-medium">{inq.city}</span>
                  </div>
                  <div className="text-[10px] text-brand-text/40 mt-1 uppercase tracking-wider">{inq.branch} Branch</div>
                </td>
                <td className="p-8">
                  <div className="text-[12px] font-bold text-brand-text/80">
                    {inq.jewelleryType || 'Mixed'} &middot; {inq.approximateWeight ? `${inq.approximateWeight}g` : 'Unweighed'}
                  </div>
                  <div className="text-[10px] text-brand-text/50 uppercase tracking-widest mt-1">
                    {inq.knowsPurity ? inq.purity : 'Purity Check Required'}
                  </div>
                </td>
                <td className="p-8">
                  <div className={cn(
                    "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    inq.status === 'completed' ? "bg-emerald-500/10 text-emerald-600" :
                    inq.status === 'closed' ? "bg-red-500/10 text-red-600" : 
                    inq.status === 'visited' ? "bg-indigo-500/10 text-indigo-600" :
                    inq.status === 'scheduled' ? "bg-purple-500/10 text-purple-600" :
                    inq.status === 'contacted' ? "bg-blue-500/10 text-blue-600" :
                    "bg-amber-500/10 text-amber-600"
                  )}>
                    {getStatusIcon(inq.status)}
                    <span>{inq.status}</span>
                  </div>
                </td>
                <td className="p-8">
                  <div className="flex items-center space-x-2 text-brand-text/40">
                    <Clock size={14} />
                    <span className="text-[12px]">{new Date(inq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                  </div>
                </td>
                <td className="p-8 text-right">
                  <button 
                    onClick={() => {
                      setSelectedInquiry(inq);
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
      {isModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#12100e]/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1614] rounded-[48px] shadow-2xl overflow-hidden border border-brand-text/15">
            <div className="p-10 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-black">Sell Gold Lead Profile</p>
                  <h2 className="text-3xl font-serif font-bold text-brand-text dark:text-white italic">{selectedInquiry.fullName}</h2>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                  selectedInquiry.status === 'completed' ? "border-emerald-500/20 text-emerald-500 bg-emerald-500/5" :
                  selectedInquiry.status === 'closed' ? "border-red-500/20 text-red-500 bg-red-500/5" :
                  selectedInquiry.status === 'visited' ? "border-indigo-500/20 text-indigo-500 bg-indigo-500/5" :
                  selectedInquiry.status === 'scheduled' ? "border-purple-500/20 text-purple-500 bg-purple-500/5" :
                  selectedInquiry.status === 'contacted' ? "border-blue-500/20 text-blue-500 bg-blue-500/5" :
                  "border-amber-500/20 text-amber-500 bg-amber-500/5"
                )}>
                  {selectedInquiry.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-brand-text/60">
                    <Phone size={16} className="text-brand-gold" />
                    <span className="text-[13px]">{selectedInquiry.phone}</span>
                  </div>
                  {selectedInquiry.email && (
                    <div className="flex items-center space-x-3 text-brand-text/60">
                      <Mail size={16} className="text-brand-gold" />
                      <span className="text-[13px]">{selectedInquiry.email}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-brand-text/60">
                    <MapPin size={16} className="text-brand-gold" />
                    <span className="text-[13px]">{selectedInquiry.city}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/30">Preferred Contact</p>
                    <p className="text-[13px] font-bold text-brand-gold uppercase">{selectedInquiry.preferredContactMethod}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/30">Branch Allocation</p>
                    <p className="text-[13px] font-bold text-brand-text uppercase">{selectedInquiry.branch}</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-gold/5 border border-brand-gold/20 rounded-3xl p-6 grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/40">Jewellery Type</p>
                    <p className="text-[13px] font-bold text-brand-text">{selectedInquiry.jewelleryType || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/40">Expected Purity</p>
                    <p className="text-[13px] font-bold text-brand-text">{selectedInquiry.knowsPurity ? selectedInquiry.purity : 'Requires Check'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/40">Weight (approx)</p>
                    <p className="text-[13px] font-bold text-brand-text">{selectedInquiry.approximateWeight ? `${selectedInquiry.approximateWeight}g` : 'Unknown'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-widest font-black text-brand-text/40">Preferred Visit Date</p>
                    <p className="text-[13px] font-bold text-brand-text">
                      {selectedInquiry.preferredVisitDate ? new Date(selectedInquiry.preferredVisitDate).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
              </div>

              {selectedInquiry.imageUrls && selectedInquiry.imageUrls.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Uploaded Images</label>
                  <div className="flex flex-wrap gap-4">
                    {selectedInquiry.imageUrls.map((url: string, i: number) => (
                      <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-brand-text/10">
                        <Image src={url} alt="Customer upload" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInquiry.notes && (
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Customer Notes</label>
                  <div className="bg-slate-50 dark:bg-white/5 border border-brand-text/5 rounded-3xl p-6 text-[13px] text-brand-text/70 leading-relaxed italic">
                    &ldquo;{selectedInquiry.notes}&rdquo;
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2">Update Status & Admin Notes</label>
                
                <select 
                  className="w-full bg-white dark:bg-white/5 border border-brand-text/15 rounded-2xl py-3 px-6 text-sm mb-4"
                  id="updateStatus"
                  defaultValue={selectedInquiry.status}
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted (In Progress)</option>
                  <option value="scheduled">Scheduled for Store Visit</option>
                  <option value="visited">Visited Store</option>
                  <option value="completed">Completed (Gold Bought)</option>
                  <option value="closed">Closed / Rejected</option>
                </select>

                <textarea 
                  className="w-full bg-slate-50 dark:bg-white/5 border border-brand-text/15 rounded-3xl p-6 text-[13px]"
                  placeholder="Internal notes about valuation, pricing offered, or follow-ups..."
                  rows={3}
                  defaultValue={selectedInquiry.adminNotes}
                  id="adminNotes"
                />
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button 
                  disabled={updating}
                  onClick={() => handleUpdateStatus(
                    selectedInquiry._id, 
                    (document.getElementById('updateStatus') as HTMLSelectElement).value,
                    (document.getElementById('adminNotes') as HTMLTextAreaElement).value
                  )}
                  className="flex-1 bg-brand-gold text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#B38B36] transition-colors flex items-center justify-center"
                >
                  {updating ? <Loader2 className="animate-spin" size={16} /> : 'Save Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

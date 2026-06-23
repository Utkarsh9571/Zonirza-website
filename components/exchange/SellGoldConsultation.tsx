'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function SellGoldConsultation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    jewelleryType: '',
    approximateWeight: '',
    knowsPurity: false,
    purity: '',
    preferredVisitDate: '',
    preferredContactMethod: 'call',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phoneTrimmed)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (starts with 6-9)';
    }

    const emailTrimmed = formData.email.trim();
    if (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.city.trim()) newErrors.city = 'City is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        approximateWeight: formData.approximateWeight ? Number(formData.approximateWeight) : undefined,
      };

      const res = await fetch('/api/sell-gold/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit inquiry.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <section id="sell-consultation-section" className="py-24 bg-white dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-[#FAF9F6] dark:bg-[#12100e] border border-brand-gold/20 rounded-[40px] p-12 text-center shadow-premium"
          >
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} />
            </div>
            <h3 className="text-3xl font-serif font-bold text-brand-text dark:text-white mb-4">Inquiry Received</h3>
            <p className="text-brand-text/70 dark:text-white/70 mb-8">
              Thank you for choosing Zoniraz. One of our experts will contact you shortly to schedule your physical evaluation at our Alwar branch.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="text-sm font-bold text-brand-gold hover:text-[#B38B36] uppercase tracking-widest"
            >
              Submit Another Inquiry
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="sell-consultation-section" className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Content */}
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black mb-4">Get Started</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-text dark:text-white leading-tight">
                Request a <span className="italic text-brand-gold">Valuation</span>
              </h2>
            </div>
            
            <p className="text-brand-text/70 dark:text-white/70 text-lg leading-relaxed max-w-md">
              Please provide some details about the gold you wish to sell. This helps our experts prepare for your visit and ensure a smooth, secure transaction.
            </p>

            <div className="bg-[#8B1D2F]/5 border border-[#8B1D2F]/20 rounded-3xl p-8 max-w-md">
              <div className="flex items-start space-x-4">
                <MapPin className="text-[#8B1D2F] shrink-0 mt-1" size={24} />
                <div className="space-y-2">
                  <h4 className="font-bold text-[#8B1D2F] uppercase tracking-widest text-xs">Alwar Branch Only</h4>
                  <p className="text-sm text-brand-text/60 dark:text-white/60">
                    Selling gold requires a physical purity check. This service is exclusively available at our Alwar boutique. We do not offer online buybacks or courier pickups.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-[#FAF9F6] dark:bg-[#12100e] border border-brand-text/10 dark:border-white/10 rounded-[40px] p-8 md:p-12 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none ${
                      errors.fullName ? "border-red-500" : "border-brand-text/10 dark:border-white/10"
                    }`} 
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none ${
                      errors.phone ? "border-red-500" : "border-brand-text/10 dark:border-white/10"
                    }`} 
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Email (Optional)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none ${
                      errors.email ? "border-red-500" : "border-brand-text/10 dark:border-white/10"
                    }`} 
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Your City *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className={`w-full bg-white dark:bg-white/5 border rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none ${
                      errors.city ? "border-red-500" : "border-brand-text/10 dark:border-white/10"
                    }`} 
                  />
                  {errors.city && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.city}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Jewellery Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bangles, Coins, Mixed"
                    value={formData.jewelleryType}
                    onChange={(e) => setFormData({...formData, jewelleryType: e.target.value})}
                    className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Approx. Weight (g)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 50"
                    value={formData.approximateWeight}
                    onChange={(e) => setFormData({...formData, approximateWeight: e.target.value})}
                    className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 border border-brand-text/10 dark:border-white/10 rounded-2xl bg-white dark:bg-white/5">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.knowsPurity}
                    onChange={(e) => setFormData({...formData, knowsPurity: e.target.checked})}
                    className="w-4 h-4 text-brand-gold rounded focus:ring-brand-gold accent-brand-gold"
                  />
                  <span className="text-sm font-medium text-brand-text dark:text-white">I know the exact purity of my gold</span>
                </label>
                
                {formData.knowsPurity && (
                  <div className="pt-2">
                    <select 
                      value={formData.purity}
                      onChange={(e) => setFormData({...formData, purity: e.target.value})}
                      className="w-full bg-[#FAF9F6] dark:bg-[#12100e] border border-brand-text/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none"
                    >
                      <option value="">Select Purity</option>
                      <option value="24K">24 Karat (99.9%)</option>
                      <option value="22K">22 Karat (91.6%)</option>
                      <option value="18K">18 Karat (75.0%)</option>
                      <option value="14K">14 Karat (58.3%)</option>
                      <option value="Other">Other / Not Sure</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Preferred Contact Method *</label>
                  <select 
                    required
                    value={formData.preferredContactMethod}
                    onChange={(e) => setFormData({...formData, preferredContactMethod: e.target.value})}
                    className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none"
                  >
                    <option value="call">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Preferred Visit Date (Optional)</label>
                  <input 
                    type="date"
                    value={formData.preferredVisitDate}
                    onChange={(e) => setFormData({...formData, preferredVisitDate: e.target.value})}
                    className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/60 dark:text-white/60">Additional Notes</label>
                <textarea 
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-white dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-brand-gold transition-all outline-none resize-none" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-gold text-white py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-[#B38B36] transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

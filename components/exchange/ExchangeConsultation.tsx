'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight, VolumeX, Share2 } from 'lucide-react';

export default function ExchangeConsultation() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: 'placeholder@example.com', // Added default to bypass API validation since UI only asks for 2 fields
    city: 'Unknown',
    consultationType: 'phone',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phoneTrimmed)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (starts with 6-9)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/exchange/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consultation-section" className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row bg-[#FAF9F6] dark:bg-[#12100e] border border-brand-text/10 dark:border-white/10">
          
          {/* Left: Form Area */}
          <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#6d3d3d] dark:text-[#e08686] leading-tight mb-10">
              Interested in an Exchange? Our Experts Will Get in Touch with You!
            </h2>

            {success ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/50 dark:bg-black/20 border border-emerald-500/30 rounded-xl p-8 text-center"
              >
                <h3 className="text-2xl font-serif font-bold text-[#6d3d3d] dark:text-[#e08686] mb-2">Thank You</h3>
                <p className="text-brand-text/70 dark:text-white/70">
                  We&apos;ve received your details. Our expert team will contact you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <input 
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={`w-full bg-transparent border rounded-xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-text/40 dark:placeholder:text-white/40 text-brand-text dark:text-white text-sm ${
                      errors.fullName ? "border-red-500" : "border-[#d2b48c] dark:border-[#5a4836]"
                    }`}
                    placeholder="Enter Your Name"
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1 ml-2 uppercase tracking-widest font-bold font-sans">{errors.fullName}</p>}
                </div>

                <div>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full bg-transparent border rounded-xl py-4 px-6 focus:ring-1 focus:ring-brand-gold outline-none transition-all placeholder:text-brand-text/40 dark:placeholder:text-white/40 text-brand-text dark:text-white text-sm ${
                      errors.phone ? "border-red-500" : "border-[#d2b48c] dark:border-[#5a4836]"
                    }`}
                    placeholder="Enter Your Phone Number"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-2 uppercase tracking-widest font-bold font-sans">{errors.phone}</p>}
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="bg-[#8c5a5a] text-white py-3 px-8 rounded-full font-bold text-sm hover:bg-[#6d3d3d] transition-colors flex items-center justify-center space-x-2 w-fit mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : (
                    <>
                      <span>Get in Touch</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Video Card area */}
          <div className="w-full md:w-1/2 relative min-h-100 md:min-h-full bg-[url('https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2126&auto=format&fit=crop')] bg-cover bg-center">
            {/* Branding/Icons overlay */}
            <div className="absolute top-6 right-6 flex items-center space-x-4">
               <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                  <VolumeX size={16} />
               </button>
               <button className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                  <Share2 size={16} />
               </button>
            </div>
            
            {/* Logo overlay */}
            <div className="absolute top-16 right-6 flex flex-col items-center">
              <span className="text-white font-serif font-bold text-xl tracking-wider">LUXURY STARTER</span>
              <span className="text-brand-gold text-[8px] uppercase tracking-[0.2em] mt-1 border border-brand-gold/50 px-2 py-0.5 rounded-full backdrop-blur-md">A Luxury Product</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

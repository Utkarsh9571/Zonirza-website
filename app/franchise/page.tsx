'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function FranchisePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', city: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Header Banner */}
      <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000"
          alt="Franchise Opportunity"
          fill
          className="object-cover opacity-20 grayscale"
        />
        <div className="relative z-10 text-center px-6">
          <p className="text-brand-gold text-[11px] uppercase tracking-[0.5em] font-bold mb-6 italic">Partner with Us</p>
          <h1 className="text-5xl md:text-8xl font-serif text-brand-text font-light tracking-tight italic leading-tight">
            Franchise Inquiry
          </h1>
          <div className="w-24 h-[1px] bg-brand-gold mx-auto mt-12"></div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-brand-text italic mb-6">Become a Partner</h2>
            <p className="text-brand-text/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Join the ZONIRAZ family and bring exquisite craftsmanship to your city. Please fill out the form below and our team will get in touch.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 md:p-16 rounded-card shadow-premium border border-brand-text/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-brand-gold font-bold ml-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full bg-brand-accent/20 border border-brand-text/5 rounded-2xl px-6 py-4 text-brand-text focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-text/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-brand-gold font-bold ml-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-brand-accent/20 border border-brand-text/5 rounded-2xl px-6 py-4 text-brand-text focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-text/20"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-brand-gold font-bold ml-1">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className="w-full bg-brand-accent/20 border border-brand-text/5 rounded-2xl px-6 py-4 text-brand-text focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-text/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-brand-gold font-bold ml-1">City</label>
                <input
                  type="text"
                  required
                  placeholder="City of Interest"
                  className="w-full bg-brand-accent/20 border border-brand-text/5 rounded-2xl px-6 py-4 text-brand-text focus:outline-none focus:border-brand-gold transition-colors placeholder:text-brand-text/20"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-brand-gold font-bold ml-1">Message</label>
              <textarea
                required
                rows={5}
                placeholder="Your message or inquiry details..."
                className="w-full bg-brand-accent/20 border border-brand-text/5 rounded-3xl px-6 py-4 text-brand-text focus:outline-none focus:border-brand-gold transition-colors resize-none placeholder:text-brand-text/20"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-luxury w-full !py-5 flex items-center justify-center disabled:opacity-50 shadow-premium"
              >
                {status === 'loading' ? (
                  <span className="flex items-center space-x-3">
                    <span className="w-4 h-4 border-2 border-brand-white/30 border-t-brand-white rounded-full animate-spin"></span>
                    <span>Sending Inquiry...</span>
                  </span>
                ) : (
                  'Submit Inquiry'
                )}
              </button>
            </div>

            {status === 'success' && (
              <div className="p-6 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
                Thank you! Your inquiry has been sent successfully. Our team will contact you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-center text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-500">
                Something went wrong. Please try again or contact us directly.
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

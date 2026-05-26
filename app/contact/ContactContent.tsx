"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, ChevronRight, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/public');
        const data = await res.json();
        if (data.success) setSettings(data.data);
      } catch (err) {
        console.error('Contact page settings fetch error:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowPopup(true);
        setFormData({ name: '', mobile: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-bg pt-32 pb-24 font-serif text-brand-text">
      {/* HEADER SECTION */}
      <div className="max-w-[1400px] mx-auto px-6 text-center mb-16">
        <nav className="flex items-center justify-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold mb-8">
          <Link href="/" className="hover:text-brand-text transition-colors">Home</Link>
          <ChevronRight size={10} />
          <span className="text-brand-text/50">Help & Contact</span>
        </nav>
        <h1 className="text-5xl md:text-6xl text-brand-text mb-12">Help & Contact</h1>
        
        <div className="max-w-4xl mx-auto text-left bg-[#FDF9F6] dark:bg-brand-accent p-8 md:p-12 rounded-[40px] border border-brand-gold/10 mb-20">
          <h2 className="text-2xl mb-6 text-brand-text border-b border-brand-gold/20 pb-4 inline-block">About Zoniraz Jewellers</h2>
          <p className="text-sm md:text-base leading-relaxed text-brand-text/80 mb-8 font-sans">
            Zoniraz Jewel house Pvt LTD. is one of the leading Jewellery manufacturer, wholesaler, retailer and exporter in the international Jewels, Gems and Precious stones market. For the last 50 Years we have been serving our loyal customers and delivering them not only qualitative and best designs of Jewellery but also a trustful and responsible brand. Launching our new jewellery brand of real gold and diamond jewellery silver jewellery birthstones. We speak about quality, experience, customer satisfaction, trust, honesty, belief and relationship. Our product gives you royal life experience and a high lifestyle. We believe in trust and honesty in our relationships with our customers, that is why trust is part of our policy. Our strong and elegant designs of jewellery raise grace and build personality and also serve a royal look as most of our designs are derived from Indian culture. We have varied ranges of unique collections of our products to satisfy various demands of different customers.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl mb-4 text-brand-text">Our Mission</h3>
              <p className="text-sm leading-relaxed text-brand-text/70 font-sans">
                Our mission is to serve our customers with maximum satisfaction, and our goal is “ Next Generation Of Jewellery Industry for Customer Support and Satisfaction.” To execute and complete our mission we passionately commence our work at an early stage as well as search for rough diamond. Our diamond jewellery export also has begun and we are satisfying our customers with our excellent designed diamond jewellery.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-4 text-brand-text">Our Vision</h3>
              <p className="text-sm leading-relaxed text-brand-text/70 font-sans">
                Our vision is to grow and reach every customer and become one of the emerging jewellery chains with satisfied and delightful customers. We are consistently making efforts in the path of this vision as well as this is the reason that today 50 years old jewels house Zoniraz website has loyalty and dedication of delivering superior quality, distinctive designs to satisfy our customers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT CHANNELS DESIGN (FROM IMAGE) */}
      <div className="max-w-[1200px] mx-auto px-6 mb-32">
        <h2 className="text-3xl text-center text-brand-text mb-16">Have A Question</h2>
        
        <div className="grid md:grid-cols-2 gap-0 border border-brand-text/5 rounded-[40px] overflow-hidden shadow-premium">
          {/* Call */}
          <div className="p-12 flex flex-col items-center text-center bg-white dark:bg-brand-white border rounded-l-[40px] border-brand-gold hover:bg-brand-bg dark:hover:bg-brand-accent transition-colors group">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 border border-brand-gold  group-hover:bg-brand-gold group-hover:text-white transition-all duration-500">
              <Phone size={28} strokeWidth={1} />
            </div>
            <h3 className="text-2xl text-brand-text mb-4">Call Us At</h3>
            <p className="text-sm font-bold text-brand-gold tracking-widest mb-2 font-sans">{settings?.supportPhone || "1800 572 6599"}</p>
            <p className="text-[10px] text-brand-text/40">{settings?.businessHours || "10 AM - 7 PM (Mon-Sat)"}</p>
          </div>
          
          {/* Write */}
          <div className="p-12 flex flex-col items-center border border-brand-gold rounded-r-[40px] text-center bg-white dark:bg-brand-white hover:bg-brand-bg dark:hover:bg-brand-accent transition-colors group">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8 border border-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-all duration-500">
              <Mail size={28} strokeWidth={1} />
            </div>
            <h3 className="text-2xl text-brand-text mb-4">Write to Us</h3>
            <p className="text-sm font-bold text-brand-gold tracking-tighter font-sans">{settings?.supportEmail || "zonirazjewelhouse@gmail.com"}</p>
          </div>
        </div>
        
        <p className="mt-12 text-center text-xs text-brand-text/80 max-w-2xl mx-auto leading-relaxed italic">
          The toll free number is only applicable for domestic orders within India. For international customers or deliveries please reach us out through whatsapp or email.
        </p>
      </div>

      {/* CONTACT FORM */}
      <div className="max-w-[800px] mx-auto px-6">
        <div className="bg-white dark:bg-brand-white p-10 md:p-16 rounded-[48px] border border-brand-gold shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold"></div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl text-brand-text mb-4">Send Us A Message</h2>
            <p className="text-brand-text/50 text-sm">We'll get back to you within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 font-sans">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-brand-text/60 ml-2">Name *</label>
                <input 
                  required
                  type="text" 
                  placeholder="Enter Name"
                  className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-brand-gold focus:border-brand-gold focus:ring-0 transition-all text-sm outline-none text-brand-text placeholder:text-brand-text/30"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest font-bold text-brand-text/60 ml-2">Mobile *</label>
                <input 
                  required
                  type="tel" 
                  placeholder="Enter Mobile"
                  className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-brand-gold focus:border-brand-gold focus:ring-0 transition-all text-sm outline-none text-brand-text placeholder:text-brand-text/30"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-bold text-brand-text/60 ml-2">Email *</label>
              <input 
                required
                type="email" 
                placeholder="Enter Email"
                className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-brand-gold focus:border-brand-gold focus:ring-0 transition-all text-sm outline-none text-brand-text placeholder:text-brand-text/30"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest font-bold text-brand-text/60 ml-2">Message *</label>
              <textarea 
                required
                rows={4}
                placeholder="Enter Query"
                className="w-full px-6 py-4 rounded-2xl bg-brand-bg border border-brand-gold focus:border-brand-gold focus:ring-0 transition-all text-sm outline-none resize-none text-brand-text placeholder:text-brand-text/30"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full py-5 bg-brand-text text-white dark:text-brand-bg rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-brand-gold transition-all shadow-lg flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Sending...</span>
                </>
              ) : (
                <span>Submit Query</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-[#1c1816]/60 backdrop-blur-sm" onClick={() => setShowPopup(false)}></div>
          <div className="bg-white dark:bg-brand-white rounded-[40px] p-12 text-center max-w-sm w-full relative z-10 shadow-premium animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-green-500" size={40} />
            </div>
            <h3 className="text-2xl text-brand-text mb-4">Message Sent!</h3>
            <p className="text-sm text-brand-text/60 mb-8 leading-relaxed font-sans">
              Thank you for contacting Zoniraz. Our team will review your query and respond shortly.
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              className="w-full py-4 bg-brand-text text-white dark:text-brand-bg rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';
import { cn } from '@/lib/utils';
import { Check, Send, Award, Globe, Users, Briefcase } from 'lucide-react';

export default function FranchiseClientPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    businessBackground: '',
    investmentRange: '',
    experience: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(phoneTrimmed)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number (starts with 6-9)';
    }

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.city.trim()) newErrors.city = 'City / Location is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setFormData({
          name: '', email: '', phone: '', city: '',
          businessBackground: '', investmentRange: '',
          experience: '', message: ''
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      

      {/* Hero Section - Editorial Style */}
      <section className="relative h-[80vh] min-h-150 flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/site/blog-hero.png" // Reusing high-end asset
          alt="Franchise Opportunity"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#1c1816]/50 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-6 max-w-5xl space-y-8">
          <p className="text-white/80 text-xs md:text-sm uppercase tracking-[0.5em] font-black animate-in fade-in slide-in-from-bottom-4 duration-700">
            Business Expansion Opportunity
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#EAE1D5] leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Join the <span className="italic">Zoniraz</span> Legacy
          </h1>
          <p className="text-[#EAE1D5]/70 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Partner with India&apos;s leading luxury jewelry house and bring timeless craftsmanship to your city.
          </p>
        </div>
      </section>

      {/* Brand Pillars */}
      <Section className="py-24!">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Award, title: "Heritage Excellence", desc: "50 years of manufacturing excellence and trust in the international jewels market." },
            { icon: Globe, title: "Global Reach", desc: "A leading exporter and wholesaler with a footprint spanning major jewelry hubs." },
            { icon: Users, title: "Partner Support", desc: "Comprehensive operational support, marketing leverage, and inventory management." }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-brand-white p-12 rounded-[40px] border border-brand-gold shadow-soft space-y-6 group hover:shadow-premium transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-brand-bg dark:bg-brand-accent flex items-center justify-center text-brand-gold group-hover:bg-brand-text group-hover:text-white transition-colors duration-500">
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl font-serif text-brand-text">{item.title}</h3>
              <p className="text-brand-text/80 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Main Inquiry Section */}
      <Section className="pb-32!">
        <div className="bg-white dark:bg-brand-white rounded-[60px] overflow-hidden border border-brand-gold shadow-premium flex flex-col lg:flex-row">
          
          {/* Left Column - Info */}
          <div className="lg:w-2/5 bg-[#3A1C16] p-12 md:p-20 text-[#EAE1D5] space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif leading-tight text-gray-200">Start Your <br/><span className="italic">Journey With Us</span></h2>
              <p className="text-[#EAE1D5]/60 text-sm leading-relaxed">
                We are looking for visionary partners who understand the language of luxury and are committed to maintaining the high standards of the Zoniraz brand.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Briefcase size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Expansion Model</h4>
                  <p className="text-xs text-[#EAE1D5]/50">FOCO & FOFO Models available for Tier 1 & Tier 2 cities.</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Award size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Brand Value</h4>
                  <p className="text-xs text-[#EAE1D5]/50">Access to exclusive collections and established customer loyalty.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8">
               <div className="p-8 rounded-3xl bg-white/5 border border-white/10 italic text-sm text-[#EAE1D5]/70 leading-relaxed">
                 &ldquo;Our franchise partners aren&apos;t just business associates; they are the guardians of our 50-year legacy.&rdquo;
               </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-3/5 p-12 md:p-20 text-brand-text">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4">
                  <Check size={40} />
                </div>
                <h3 className="text-3xl font-serif text-brand-text">Inquiry Received</h3>
                <p className="text-brand-muted max-w-md mx-auto">
                  Thank you for your interest. A luxury brand expansion expert from our team will contact you shortly.
                </p>
                <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-8">
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Enter your name"
                      className={cn(
                        "w-full bg-brand-bg/50 border rounded-lg py-3 px-4 focus:border-brand-gold outline-none transition-all text-sm text-brand-text placeholder:text-brand-text/30",
                        errors.name ? "border-red-500" : "border-brand-gold"
                      )}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="email@example.com"
                      className={cn(
                        "w-full bg-brand-bg/50 border rounded-lg py-3 px-4 focus:border-brand-gold outline-none transition-all text-sm text-brand-text placeholder:text-brand-text/30",
                        errors.email ? "border-red-500" : "border-brand-gold"
                      )}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX"
                      className={cn(
                        "w-full bg-brand-bg/50 border rounded-lg py-3 px-4 focus:border-brand-gold outline-none transition-all text-sm text-brand-text placeholder:text-brand-text/30",
                        errors.phone ? "border-red-500" : "border-brand-gold"
                      )}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">City / Location</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Preferred location"
                      className={cn(
                        "w-full bg-brand-bg/50 border rounded-lg py-3 px-4 focus:border-brand-gold outline-none transition-all text-sm text-brand-text placeholder:text-brand-text/30",
                        errors.city ? "border-red-500" : "border-brand-gold"
                      )}
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                    {errors.city && <p className="text-red-500 text-[10px] mt-1 ml-1 uppercase tracking-widest font-bold font-sans">{errors.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Investment Budget</label>
                    <select 
                      className="w-full bg-brand-bg/50 border rounded-lg border-brand-gold py-3 px-4 focus:border-brand-gold outline-none transition-all text-sm appearance-none text-brand-text placeholder:text-brand-text/30"
                      value={formData.investmentRange}
                      onChange={(e) => setFormData({...formData, investmentRange: e.target.value})}
                    >
                      <option value="" className="dark:bg-brand-white">Select Range</option>
                      <option value="5cr to 10cr" className="dark:bg-brand-white">5cr to 10cr</option>
                      <option value="10cr to 20cr" className="dark:bg-brand-white">10cr to 20cr</option>
                      <option value="20cr to 30cr" className="dark:bg-brand-white">20cr to 30cr</option>
                      <option value="30+cr" className="dark:bg-brand-white">30+cr</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Business Experience</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Retail, Real Estate"
                      className="w-full bg-brand-bg/50 border rounded-lg border-brand-gold py-3 px-4 focus:border-brand-gold outline-none transition-all text-sm text-brand-text placeholder:text-brand-text/30"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-black text-brand-text/40">Additional Details</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your vision for a Zoniraz franchise..."
                    className="w-full bg-brand-bg/50 border rounded-lg border-brand-gold py-3 px-4 focus:border-brand-gold outline-none transition-all text-sm resize-none text-brand-text placeholder:text-brand-text/30"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6! text-xs uppercase tracking-[0.3em] font-black group dark:text-brand-bg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-brand-text/30 text-center uppercase tracking-widest leading-relaxed">
                  By submitting this form, you agree to our <br/> <strong>Franchise Partnership Terms & Privacy Policy</strong>
                </p>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

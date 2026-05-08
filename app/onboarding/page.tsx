'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Diamond, ArrowRight, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/new-ui/Button';
import { Section } from '@/components/new-ui/Section';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
  });

  useEffect(() => {
    setIsMounted(true);
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (session?.user && (session.user as any).onboardingCompleted) {
      router.push('/account');
    }
  }, [status, session, router]);

  if (!isMounted || status === 'loading') return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        // Update session to reflect onboarding completed
        await update();
        router.push('/');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-text/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />

      <Section className="relative z-10 w-full max-w-4xl px-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-[60px] shadow-premium border border-white/50 overflow-hidden flex flex-col md:flex-row h-full md:min-h-[600px] animate-in zoom-in slide-in-from-bottom-12 duration-1000">
          
          {/* Left Panel: Aesthetic Image */}
          <div className="w-full md:w-[40%] relative min-h-[300px] md:min-h-full">
            <Image 
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab60c?auto=format&fit=crop&q=80&w=1000"
              alt="Luxury Jewellery"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-text/20 backdrop-grayscale-[0.5]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white space-y-6">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Diamond size={32} />
              </div>
              <h2 className="text-3xl font-serif italic">The Art of <br /> Elegance</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-80">Refining your journey</p>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="flex-1 p-10 md:p-16 flex flex-col justify-center space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold">Step 01 of 01</p>
              <h1 className="text-4xl font-serif text-brand-text">Welcome, <br /> <span className="italic text-brand-text/60">{session?.user?.email}</span></h1>
              <p className="text-sm text-brand-text/50 max-w-md">Help us tailor our masterpieces to your exquisite style and preference.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/40" size={18} />
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl pl-16 pr-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 ml-4">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/40" size={18} />
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl pl-16 pr-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 ml-4">Gender</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-16 bg-brand-bg/50 border border-brand-text/5 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-brand-gold/30 transition-all appearance-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full !py-7 shadow-premium"
                  disabled={isLoading || !formData.name}
                >
                  {isLoading ? "Curating your Profile..." : "Start Exploring"} <ArrowRight size={18} className="ml-3" />
                </Button>
                
                <p className="text-[10px] text-center text-brand-text/30 uppercase tracking-widest font-medium">
                  Privacy guaranteed • Secure encryption • Editorial excellence
                </p>
              </div>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
}

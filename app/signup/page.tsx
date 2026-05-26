'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/new-ui/Button';
import { Diamond, CheckCircle2 } from 'lucide-react';

export default function SignUpPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for sign-up logic will go here
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Jewelry Background"
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-brand-bg via-brand-bg/90 to-transparent" />
      </div>

      {/* Animated Blobs for depth */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse duration-1000" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-text/5 rounded-full blur-[120px] animate-pulse duration-700" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand Logo / Icon */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-premium border border-brand-text/5">
            <Diamond className="text-brand-gold" size={32} strokeWidth={1} />
          </div>
        </div>

        <AuthCard 
          title="Create Account" 
          subtitle="Join the world of Zoniraz luxury"
          className="max-w-xl"
        >
          {/* Mobile OTP Quick Sign Up */}
          <div className="mb-8 p-6 bg-brand-gold/5 border border-brand-gold/15 rounded-3xl text-center space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-black text-brand-gold">Recommended</p>
            <h4 className="text-sm font-serif text-brand-text font-bold">Instant Registration via Mobile OTP</h4>
            <p className="text-[10px] text-brand-text/50 uppercase tracking-wider max-w-xs mx-auto">No passwords required. Secure your account, Digi Gold wallet, and SIPs in seconds.</p>
            <Link href="/signin" className="block">
              <Button type="button" variant="primary" size="full" className="!py-4 text-[10px] tracking-[0.3em] shadow-soft">
                Register via Mobile OTP
              </Button>
            </Link>
          </div>

          <div className="flex items-center my-6 opacity-30">
            <div className="flex-grow border-t border-brand-text" />
            <span className="px-4 text-[10px] font-black uppercase tracking-widest text-brand-text">or use email signup</span>
            <div className="flex-grow border-t border-brand-text" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AuthInput 
                label="Full Name" 
                type="text" 
                placeholder="Enter your name"
                required
              />
              <AuthInput 
                label="Email Address" 
                type="email" 
                placeholder="name@example.com"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordField 
                label="Password" 
                placeholder="Create password"
                required
              />
              <PasswordField 
                label="Confirm Password" 
                placeholder="Verify password"
                required
              />
            </div>

            <div className="space-y-8">
              <label className="flex items-start space-x-4 cursor-pointer group bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-brand-text/5 hover:border-brand-gold/30 transition-all duration-500 shadow-soft">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 rounded-full border-brand-text/10 text-brand-gold focus:ring-brand-gold cursor-pointer"
                  required
                />
                <span className="text-[11px] leading-relaxed uppercase tracking-widest text-brand-text/70 group-hover:text-brand-text transition-colors">
                  I agree to the <Link href="/terms" className="text-brand-gold font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-brand-gold font-bold">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" variant="primary" size="full" className="shadow-premium !py-6 text-[12px] tracking-[0.4em]">
                Create Account <CheckCircle2 size={18} className="ml-3" />
              </Button>
            </div>

            <div className="pt-8 text-center">
              <p className="text-[12px] text-brand-text/60 uppercase tracking-widest">
                Already have an account?{' '}
                <Link 
                  href="/signin" 
                  className="text-brand-gold font-bold hover:text-brand-text transition-colors ml-2"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}

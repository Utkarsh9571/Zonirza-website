'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/new-ui/Button';
import { Diamond, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for sign-in logic will go here
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Jewelry Background"
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-bg via-brand-bg/90 to-transparent" />
      </div>

      {/* Animated Blobs for depth */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-text/5 rounded-full blur-[120px] animate-pulse duration-700" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand Logo / Icon */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-premium border border-brand-text/5">
            <Diamond className="text-brand-gold" size={32} strokeWidth={1} />
          </div>
        </div>

        <AuthCard 
          title="Welcome Back" 
          subtitle="Sign in to your luxury account"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <AuthInput 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              required
            />
            <div className="space-y-4">
              <PasswordField 
                label="Password" 
                placeholder="Enter your password"
                required
              />
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-full border-brand-text/10 text-brand-gold focus:ring-brand-gold cursor-pointer"
                  />
                  <span className="text-[11px] uppercase tracking-widest text-brand-text/70 group-hover:text-brand-text transition-colors">
                    Remember me
                  </span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-[11px] uppercase tracking-widest text-brand-gold font-bold hover:text-brand-text transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="full" className="shadow-premium !py-6 text-[12px] tracking-[0.4em]">
              Sign In <ArrowRight size={18} className="ml-3" />
            </Button>

            <div className="pt-8 text-center">
              <p className="text-[12px] text-brand-text/60 uppercase tracking-widest">
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  className="text-brand-gold font-bold hover:text-brand-text transition-colors ml-2"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}

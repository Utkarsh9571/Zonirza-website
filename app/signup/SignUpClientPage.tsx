'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/new-ui/Button';
import { Diamond, CheckCircle2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function SignUpClientPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!agree) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Automatically sign in the user
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created, but automatic sign-in failed. Please sign in manually.');
        router.push('/signin');
      } else {
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-brand-bg dark:bg-[#080706]">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Jewelry Background"
          fill
          className="object-cover opacity-20 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-brand-bg via-brand-bg/90 to-transparent dark:from-[#080706] dark:via-[#080706]/95 dark:to-transparent" />
      </div>

      {/* Animated Blobs for depth */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse duration-1000" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-text/5 rounded-full blur-[120px] animate-pulse duration-700" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Brand Logo / Icon */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center shadow-premium border border-brand-text/5">
            <Diamond className="text-brand-gold" size={32} strokeWidth={1} />
          </div>
        </div>

        <AuthCard 
          title="Create Account" 
          subtitle="Join the world of Zoniraz luxury"
          className="max-w-xl"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl">
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AuthInput 
                label="Full Name" 
                type="text" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
              <AuthInput 
                label="Email Address" 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordField 
                label="Password" 
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <PasswordField 
                label="Confirm Password" 
                placeholder="Verify password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-8">
              <label className="flex items-start space-x-4 cursor-pointer group bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-brand-text/5 hover:border-brand-gold/30 transition-all duration-500 shadow-soft">
                <input 
                  type="checkbox" 
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded-full border-brand-text/10 text-brand-gold focus:ring-brand-gold cursor-pointer"
                  required
                  disabled={isLoading}
                />
                <span className="text-[11px] leading-relaxed uppercase tracking-widest text-brand-text/70 group-hover:text-brand-text transition-colors">
                  I agree to the <Link href="/terms" className="text-brand-gold font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-brand-gold font-bold">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" variant="primary" size="full" className="shadow-premium !py-6 text-[12px] tracking-[0.4em]" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"} <CheckCircle2 size={18} className="ml-3" />
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

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/new-ui/Button';
import { Diamond, Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { signIn } from 'next-auth/react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [step, setStep] = useState<'login' | 'forgot-password' | 'forgot-password-sent'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Invalid credentials. Please check your email and password.');
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        const onboardingCompleted = sessionData?.user?.onboardingCompleted;
        const redirectUrl = sessionStorage.getItem('post_auth_redirect') || callbackUrl;
        
        sessionStorage.removeItem('post_auth_redirect');

        if (onboardingCompleted === false) {
          router.push('/onboarding');
        } else {
          router.push(redirectUrl);
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setStep('forgot-password-sent');
      } else {
        setError(data.error || 'Failed to request reset link.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title={
        step === 'login' ? "Sign In" : 
        step === 'forgot-password' ? "Reset Password" : 
        "Check Your Inbox"
      } 
      subtitle={
        step === 'login' ? "Access the world of Zoniraz" : 
        step === 'forgot-password' ? "Request a password recovery link" : 
        "We've sent recovery instructions"
      }
      className="max-w-md w-full bg-white/75 dark:bg-[#0f0d0c]/75 backdrop-blur-3xl shadow-premium border border-white/20 rounded-[40px] p-8 md:p-12 relative transition-colors"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl">
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center leading-relaxed">{error}</p>
        </div>
      )}

      {step === 'login' && (
        <form onSubmit={handleCredentialsLogin} className="space-y-6">
          <div className="relative">
            <AuthInput 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-12"
              disabled={isLoading}
            />
            <Mail size={18} className="absolute left-4 top-[46px] text-brand-gold/60" />
          </div>

          <div className="relative">
            <PasswordField 
              label="Password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="text-right">
            <button 
              type="button"
              onClick={() => {
                setError('');
                setStep('forgot-password');
              }}
              className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="space-y-6">
            <Button 
              type="submit" 
              variant="primary" 
              size="full" 
              className="shadow-premium !py-6 text-[12px] tracking-[0.4em]"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"} <ArrowRight size={18} className="ml-3" />
            </Button>
          </div>
        </form>
      )}

      {step === 'forgot-password' && (
        <form onSubmit={handleRequestResetLink} className="space-y-6">
          <button 
            type="button" 
            onClick={() => {
              setError('');
              setStep('login');
            }}
            className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text mb-4"
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </button>

          <div className="relative">
            <AuthInput 
              label="Email Address" 
              type="email" 
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-12"
              disabled={isLoading}
            />
            <Mail size={18} className="absolute left-4 top-[46px] text-brand-gold/60" />
          </div>

          <div className="space-y-6">
            <Button 
              type="submit" 
              variant="primary" 
              size="full" 
              className="shadow-premium !py-6 text-[12px] tracking-[0.4em]"
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending Link..." : "Request Reset Link"} <ArrowRight size={18} className="ml-3" />
            </Button>
          </div>
        </form>
      )}

      {step === 'forgot-password-sent' && (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-brand-bg dark:bg-brand-bg/50 rounded-full flex items-center justify-center mx-auto shadow-premium border border-brand-gold/5">
            <KeyRound className="text-brand-gold" size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-brand-text dark:text-brand-text/90">{email}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/40 dark:text-brand-text/60 leading-relaxed">
              {successMessage || "We've sent a password reset link to your email."}
            </p>
          </div>
          <button 
            onClick={() => {
              setError('');
              setStep('login');
            }}
            className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline"
          >
            Back to Login
          </button>
        </div>
      )}

      <div className="pt-8 text-center border-t border-brand-text/5 dark:border-white/5 mt-8">
        <p className="text-[12px] text-brand-text/60 dark:text-brand-text/80 uppercase tracking-widest">
          New to Zoniraz?{' '}
          <Link 
            href="/signup" 
            className="text-brand-gold font-bold hover:text-brand-text transition-colors ml-2"
          >
            Create Account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default function SignInClientPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-brand-bg dark:bg-[#080706]">
      {/* Background image & gradient */}
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

      {/* Decorative Blur Blobs */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse duration-1000" />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-text/5 rounded-full blur-[120px] animate-pulse duration-700" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="mb-12">
          <Link href="/">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-brand-bg flex items-center justify-center shadow-premium border border-brand-text/5">
              <Diamond className="text-brand-gold" size={32} strokeWidth={1} />
            </div>
          </Link>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-md bg-white/70 dark:bg-[#0f0d0c]/70 backdrop-blur-3xl border border-white rounded-[40px] p-12 text-center shadow-premium">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-gold animate-pulse">Loading gateway...</p>
          </div>
        }>
          <SignInContent />
        </Suspense>
      </div>
    </div>
  );
}

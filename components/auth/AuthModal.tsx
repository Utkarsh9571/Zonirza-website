'use client';

import React, { useState } from 'react';
import { X, Diamond, ArrowRight, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/new-ui/Button';
import { AuthInput } from './AuthInput';
import { PasswordField } from './PasswordField';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'login' | 'forgot-password' | 'forgot-password-sent';

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const router = useRouter();
  
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

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
        // Successful login! Fetch session details
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        const onboardingCompleted = sessionData?.user?.onboardingCompleted;
        const redirectUrl = sessionStorage.getItem('post_auth_redirect');

        if (onboardingCompleted === false) {
          router.push('/onboarding');
        } else if (redirectUrl) {
          sessionStorage.removeItem('post_auth_redirect');
          router.push(redirectUrl);
        } else {
          window.location.reload();
        }
        onClose();
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-text/40 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto" 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-full max-h-[700px] bg-[#fdfaf5] dark:bg-brand-bg rounded-[40px] shadow-premium flex flex-col md:flex-row overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-700 pointer-events-auto z-10 transition-colors">
        
        {/* Close Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-[60] w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#1a1614] shadow-soft text-brand-text/40 hover:text-brand-gold hover:rotate-90 transition-all duration-500 active:scale-90 touch-safe-hit border border-transparent dark:border-white/10"
        >
          <X size={24} />
        </button>

        {/* LEFT PANEL: Branding */}
        <div className="hidden md:flex w-[45%] bg-[#ffeed0] dark:bg-brand-accent p-12 flex-col items-center justify-center text-center relative overflow-hidden transition-colors">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10 space-y-8">
            <div className="w-48 h-48 mx-auto rounded-full bg-white dark:bg-brand-bg p-4 shadow-premium border border-brand-gold/10 flex items-center justify-center relative transition-colors">
               <div className="absolute inset-4 rounded-full border-2 border-dashed border-brand-gold/20 animate-[spin_20s_linear_infinite]" />
               <Diamond size={64} className="text-brand-gold" strokeWidth={1} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-brand-text italic leading-tight">
                Personalized <br /> <span className="not-italic font-bold text-brand-gold">Curations</span>
              </h2>
              <p className="text-[12px] uppercase tracking-[0.3em] font-bold text-brand-text/50 dark:text-brand-text/70 max-w-[250px] mx-auto leading-relaxed">
                Explore masterpieces tailored to your exquisite taste
              </p>
            </div>

            <div className="pt-8">
               <div className="inline-flex items-center space-x-2 text-brand-gold">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/20" />
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Authentication Panel */}
        <div className="flex-1 bg-white dark:bg-[#0f0d0c] p-8 md:p-16 flex flex-col justify-center relative transition-colors">
          <div>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl">
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center leading-relaxed">{error}</p>
              </div>
            )}
            
            {/* STEP 1: Email + Password Login */}
            {step === 'login' && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Welcome to Zoniraz</h3>
                  <p className="text-sm text-brand-text/60 dark:text-brand-text/80 transition-colors">
                    Access your account using your email and password.
                  </p>
                </div>

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
                    
                    <p className="text-[10px] text-center text-brand-text/40 dark:text-brand-text/60 uppercase tracking-[0.2em] leading-relaxed transition-colors">
                      Don't have an account?{' '}
                      <Link 
                        href="/signup" 
                        onClick={onClose}
                        className="text-brand-gold font-bold hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Forgot Password Request */}
            {step === 'forgot-password' && (
              <div className="space-y-8">
                <button 
                  type="button" 
                  onClick={() => {
                    setError('');
                    setStep('login');
                  }}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Login</span>
                </button>

                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Reset Password</h3>
                  <p className="text-sm text-brand-text/60 dark:text-brand-text/80 transition-colors">
                    Enter your email to receive recovery instructions.
                  </p>
                </div>

                <form onSubmit={handleRequestResetLink} className="space-y-6">
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
              </div>
            )}

            {/* STEP 3: Forgot Password Request Sent */}
            {step === 'forgot-password-sent' && (
              <div className="space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Check Your Inbox</h3>
                  <p className="text-sm text-brand-text/60 dark:text-brand-text/80">
                    We've sent password reset instructions to your email.
                  </p>
                </div>

                <div className="bg-brand-bg/30 dark:bg-white/5 p-10 rounded-[35px] border border-brand-gold/10 text-center space-y-6 transition-colors">
                  <div className="w-20 h-20 bg-white dark:bg-brand-bg rounded-full flex items-center justify-center mx-auto shadow-premium border border-brand-gold/5 transition-colors">
                    <KeyRound className="text-brand-gold" size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-brand-text tracking-wide">{email}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/40 dark:text-brand-text/60 leading-relaxed transition-colors">
                      {successMessage || "Please click the link in the email to set a new password."}
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
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

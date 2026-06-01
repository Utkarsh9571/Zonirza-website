'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { Button } from '@/components/new-ui/Button';
import { Diamond, Phone, Mail, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [step, setStep] = useState<'mobile-input' | 'mobile-otp' | 'email-input' | 'email-sent'>('mobile-input');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  useEffect(() => {
    if (step === 'mobile-otp') {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const handleSendMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: mobile }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStep('mobile-otp');
        setCooldown(60);
        setOtp(['', '', '', '', '', '']);
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('otp', {
        identifier: mobile,
        otp: otpCode,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Invalid OTP. Please check the code and try again.');
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
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || !mobile) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: mobile }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setCooldown(60);
        setError('');
      } else {
        setError(data.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestEmailLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');
    
    try {
      const res = await signIn('email', { 
        email, 
        redirect: false,
        callbackUrl: window.location.origin + '/onboarding'
      });
      
      if (res?.error) {
        setError('Failed to send verification link. Please try again.');
      } else {
        setStep('email-sent');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <AuthCard 
      title={step === 'email-sent' ? "Check Your Inbox" : "Sign In"} 
      subtitle={step === 'email-sent' ? "We've sent an exclusive link" : "Access the world of Zoniraz"}
      className="max-w-md w-full bg-white/75 dark:bg-[#0f0d0c]/75 backdrop-blur-3xl shadow-premium border border-white/20 rounded-[40px] p-8 md:p-12 relative transition-colors"
    >
      {step === 'mobile-input' && (
        <form onSubmit={handleSendMobileOtp} className="space-y-8">
          <div className="relative">
            <AuthInput 
              label="Mobile Number" 
              type="tel" 
              placeholder="+91 99999 88888"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="pl-12"
              disabled={isLoading}
            />
            <Phone size={18} className="absolute left-4 top-[46px] text-brand-gold/60" />
          </div>

          {error && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</p>
          )}

          <div className="space-y-6">
            <Button 
              type="submit" 
              variant="primary" 
              size="full" 
              className="shadow-premium !py-6 text-[12px] tracking-[0.4em]"
              disabled={isLoading || !mobile}
            >
              {isLoading ? "Sending OTP..." : "Verify via Mobile"} <ArrowRight size={18} className="ml-3" />
            </Button>
            
            <div className="text-center pt-2">
              <button 
                type="button"
                onClick={() => {
                  setError('');
                  setStep('email-input');
                }}
                className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline"
              >
                Fallback to Email Login
              </button>
            </div>
          </div>
        </form>
      )}

      {step === 'mobile-otp' && (
        <form onSubmit={handleVerifyMobileOtp} className="space-y-8">
          <button 
            type="button" 
            onClick={() => {
              setError('');
              setStep('mobile-input');
            }}
            className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text mb-4"
          >
            <ArrowLeft size={14} />
            <span>Back to Mobile</span>
          </button>

          <p className="text-sm text-brand-text/60">
            We've sent a 6-digit verification code to <span className="font-bold text-brand-text">{mobile}</span>
          </p>

          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { otpRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-brand-bg/30 dark:bg-white/5 border border-brand-text/10 dark:border-white/10 rounded-2xl focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 transition-all outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</p>
          )}

          <div className="space-y-6">
            <Button 
              type="submit" 
              variant="primary" 
              size="full" 
              className="shadow-premium !py-6 text-[12px] tracking-[0.4em]"
              disabled={isLoading || otp.join('').length < 6}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"} <ShieldCheck size={18} className="ml-3" />
            </Button>
            
            <div className="text-center flex flex-col space-y-2">
              {cooldown > 0 ? (
                <span className="text-[10px] uppercase tracking-widest text-brand-text/40">
                  Resend Code in {cooldown}s
                </span>
              ) : (
                <button 
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline"
                >
                  Resend Verification Code
                </button>
              )}
            </div>
          </div>
        </form>
      )}

      {step === 'email-input' && (
        <form onSubmit={handleRequestEmailLink} className="space-y-8">
          <button 
            type="button" 
            onClick={() => {
              setError('');
              setStep('mobile-input');
            }}
            className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text mb-4"
          >
            <ArrowLeft size={14} />
            <span>Back to Mobile Login</span>
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

          {error && (
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{error}</p>
          )}

          <div className="space-y-6">
            <Button 
              type="submit" 
              variant="primary" 
              size="full" 
              className="shadow-premium !py-6 text-[12px] tracking-[0.4em]"
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending Link..." : "Request Access Link"} <ArrowRight size={18} className="ml-3" />
            </Button>
          </div>
        </form>
      )}

      {step === 'email-sent' && (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-brand-bg dark:bg-brand-bg/50 rounded-full flex items-center justify-center mx-auto shadow-premium border border-brand-gold/5">
            <Mail className="text-brand-gold" size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-brand-text dark:text-brand-text/90">{email}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/40 dark:text-brand-text/60 leading-relaxed">
              Please click the link in the email to verify your identity and enter our collection.
            </p>
          </div>
          <button 
            onClick={() => {
              setError('');
              setStep('email-input');
            }}
            className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline"
          >
            Use a different email
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

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Diamond, ArrowRight, Mail, ShieldCheck, Phone, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/new-ui/Button';
import { AuthInput } from './AuthInput';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'mobile-input' | 'mobile-otp' | 'email-input' | 'email-sent';

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState<AuthStep>('mobile-input');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Ref array for OTP inputs auto-focusing
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  // Focus the first OTP input when reaching the OTP step
  useEffect(() => {
    if (step === 'mobile-otp') {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  if (!isOpen) return null;

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
    // Only allow single digit numeric input
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input on entry
    if (value !== '' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace navigation
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
          <div className={cn(
            "transition-all duration-500 transform",
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}>
            
            {/* STEP 1: Enter Mobile (Primary Login) */}
            {step === 'mobile-input' && (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Welcome to Zoniraz</h3>
                  <p className="text-sm text-brand-text/60 dark:text-brand-text/80 transition-colors">
                    Access your account or register instantly using mobile verification.
                  </p>
                </div>

                <form onSubmit={handleSendMobileOtp} className="space-y-8">
                  <div className="relative">
                    <AuthInput 
                      label="Mobile Number" 
                      type="tel" 
                      placeholder="+91 99999 88888 or 9876543210"
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
                        Fallback to Email login
                      </button>
                    </div>

                    <p className="text-[10px] text-center text-brand-text/40 dark:text-brand-text/60 uppercase tracking-[0.2em] leading-relaxed transition-colors">
                      By continuing, I agree to <span className="text-brand-gold font-bold">Terms of Use</span> & <span className="text-brand-gold font-bold">Privacy Policy</span>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Enter Mobile OTP */}
            {step === 'mobile-otp' && (
              <div className="space-y-10">
                <button 
                  type="button" 
                  onClick={() => {
                    setError('');
                    setStep('mobile-input');
                  }}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Mobile</span>
                </button>

                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Verify Identity</h3>
                  <p className="text-sm text-brand-text/60">
                    We've sent a 6-digit verification code to <span className="font-bold text-brand-text">{mobile}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyMobileOtp} className="space-y-8">
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
                      
                      <button 
                        type="button"
                        onClick={() => {
                          setError('');
                          setStep('mobile-input');
                        }}
                        className="text-[10px] uppercase tracking-widest text-brand-text/40 hover:text-brand-text font-bold"
                      >
                        Change Mobile Number
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: Fallback Email Input */}
            {step === 'email-input' && (
              <div className="space-y-10">
                <button 
                  type="button" 
                  onClick={() => {
                    setError('');
                    setStep('mobile-input');
                  }}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-text/40 hover:text-brand-text"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Mobile Login</span>
                </button>

                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Email Fallback Login</h3>
                  <p className="text-sm text-brand-text/60 dark:text-brand-text/80 transition-colors">
                    Access using a passwordless magic verification link sent to your inbox.
                  </p>
                </div>

                <form onSubmit={handleRequestEmailLink} className="space-y-8">
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
              </div>
            )}

            {/* STEP 4: Email Sent Screen */}
            {step === 'email-sent' && (
              <div className="space-y-10 animate-in fade-in zoom-in duration-700">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Check Your Inbox</h3>
                  <p className="text-sm text-brand-text/60 dark:text-brand-text/80">
                    We've sent an exclusive passwordless magic link to your email.
                  </p>
                </div>

                <div className="bg-brand-bg/30 dark:bg-white/5 p-10 rounded-[35px] border border-brand-gold/10 text-center space-y-6 transition-colors">
                  <div className="w-20 h-20 bg-white dark:bg-brand-bg rounded-full flex items-center justify-center mx-auto shadow-premium border border-brand-gold/5 transition-colors">
                    <Mail className="text-brand-gold" size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-brand-text tracking-wide">{email}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/40 dark:text-brand-text/60 leading-relaxed transition-colors">
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
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

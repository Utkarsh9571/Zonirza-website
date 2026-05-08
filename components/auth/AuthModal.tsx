'use client';

import React, { useState, useEffect } from 'react';
import { X, Diamond, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/new-ui/Button';
import { AuthInput } from './AuthInput';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'email' | 'otp' | 'details';

import { signIn, useSession } from "next-auth/react";

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { data: session } = useSession();
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  // Backdrop remains for visual effect but clicking it no longer closes the modal
  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setEmailSent(true);
        // We stay on email step but show success message
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    // Note: NextAuth Email provider uses magic links, so we'll guide user to check email
    // but we can keep the OTP UI for future custom implementation if needed.
    // For now, we show "Check your email" message.
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    // In real app, save data to DB here
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-text/40 backdrop-blur-md animate-in fade-in duration-500" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-full max-h-[700px] bg-[#fdfaf5] rounded-[40px] shadow-premium flex flex-col md:flex-row overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-700">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-soft text-brand-text/40 hover:text-brand-gold hover:rotate-90 transition-all duration-500"
        >
          <X size={20} />
        </button>

        {/* LEFT PANEL: Branding & Visuals */}
        <div className="hidden md:flex w-[45%] bg-[#fff7e9] p-12 flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Decorative Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-gold/5 rounded-full blur-[80px]" />
          
          <div className="relative z-10 space-y-8">
            <div className="w-48 h-48 mx-auto rounded-full bg-white p-4 shadow-premium border border-brand-gold/10 flex items-center justify-center relative">
               <div className="absolute inset-4 rounded-full border-2 border-dashed border-brand-gold/20 animate-[spin_20s_linear_infinite]" />
               <Diamond size={64} className="text-brand-gold" strokeWidth={1} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-serif text-brand-text italic leading-tight">
                Personalized <br /> <span className="not-italic font-bold text-brand-gold">Curations</span>
              </h2>
              <p className="text-[12px] uppercase tracking-[0.3em] font-bold text-brand-text/50 max-w-[250px] mx-auto leading-relaxed">
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

        {/* RIGHT PANEL: Form */}
        <div className="flex-1 bg-white p-8 md:p-16 flex flex-col justify-center relative">
          <div className={cn(
            "transition-all duration-500 transform",
            isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}>
            {step === 'email' ? (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">
                    {emailSent ? "Check Your Inbox" : "Welcome to Zoniraz!"}
                  </h3>
                  <p className="text-sm text-brand-text/60">
                    {emailSent 
                      ? "We've sent an exclusive access link to your email." 
                      : "Log in or Sign up to get exclusive privileges"}
                  </p>
                </div>

                {emailSent ? (
                  <div className="bg-brand-bg/30 p-10 rounded-[35px] border border-brand-gold/10 text-center space-y-6 animate-in fade-in zoom-in duration-700">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-premium border border-brand-gold/5">
                      <Mail className="text-brand-gold" size={32} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-brand-text tracking-wide">{email}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/40 leading-relaxed">
                        Please click the link in the email to verify your identity and enter our collection.
                      </p>
                    </div>
                    <button 
                      onClick={() => setEmailSent(false)}
                      className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:underline"
                    >
                      Use a different email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRequestOtp} className="space-y-8">
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
                        disabled={isLoading}
                      >
                        {isLoading ? "Preparing Gateway..." : "Request Access Link"} <ArrowRight size={18} className="ml-3" />
                      </Button>
                      
                      <p className="text-[10px] text-center text-brand-text/40 uppercase tracking-[0.2em] leading-relaxed">
                        By continuing, I agree to <span className="text-brand-gold font-bold">Terms of Use</span> & <span className="text-brand-gold font-bold">Privacy Policy</span>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            ) : step === 'otp' ? (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Verify Identity</h3>
                  <p className="text-sm text-brand-text/60">We've sent a 6-digit code to <span className="font-bold text-brand-text">{email}</span></p>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold bg-brand-bg/30 border border-brand-text/10 rounded-2xl focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/5 transition-all outline-none"
                      />
                    ))}
                  </div>

                  <div className="space-y-6">
                    <Button variant="primary" size="full" className="shadow-premium !py-6 text-[12px] tracking-[0.4em]" onClick={handleVerifyOtp}>
                      Verify & Continue <ShieldCheck size={18} className="ml-3" />
                    </Button>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => setStep('email')}
                        className="text-[10px] uppercase tracking-widest text-brand-gold font-bold hover:text-brand-text transition-colors"
                      >
                        Change Email Address
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-brand-text">Almost There!</h3>
                  <p className="text-sm text-brand-text/60">Help us personalize your Zoniraz experience</p>
                </div>

                <form onSubmit={handleSaveDetails} className="space-y-6">
                  <AuthInput 
                    label="Full Name" 
                    type="text" 
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <AuthInput 
                    label="Shipping Address" 
                    type="text" 
                    placeholder="Street, City, Postcode"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                  <div className="space-y-4 pt-4">
                    <Button type="submit" variant="primary" size="full" className="shadow-premium !py-6 text-[12px] tracking-[0.4em]">
                      Complete Setup <ArrowRight size={18} className="ml-3" />
                    </Button>
                    
                    <button 
                      type="button"
                      onClick={onClose}
                      className="w-full text-[10px] uppercase tracking-[0.2em] font-bold text-brand-text/40 hover:text-brand-gold transition-colors"
                    >
                      Skip for now
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

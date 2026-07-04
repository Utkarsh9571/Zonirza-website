'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { PasswordField } from '@/components/auth/PasswordField';
import { Button } from '@/components/new-ui/Button';
import { Diamond, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ResetPasswordClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
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
          title="Create New Password" 
          subtitle="Secure your access to the Luxury Jewelry collection"
          className="max-w-md"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center space-x-3">
              <ShieldAlert className="text-red-500 flex-shrink-0" size={18} />
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          {success ? (
            <div className="space-y-6 text-center py-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle2 className="text-green-500" size={36} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-serif text-brand-text font-bold">Password Reset Successful</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-text/40 dark:text-brand-text/60 leading-relaxed">
                  Your password has been successfully updated. Redirecting to the sign-in portal...
                </p>
              </div>
            </div>
          ) : !token ? (
            <div className="text-center py-6">
              <p className="text-sm text-brand-text/60 mb-6">
                This password reset link is invalid or expired. Please request a new recovery link.
              </p>
              <Link href="/signin">
                <Button variant="primary" size="full" className="text-[10px] tracking-widest uppercase">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <PasswordField 
                label="New Password" 
                placeholder="Create new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <PasswordField 
                label="Confirm Password" 
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />

              <Button type="submit" variant="primary" size="full" className="shadow-premium !py-6 text-[12px] tracking-[0.4em]" disabled={isLoading}>
                {isLoading ? "Updating Password..." : "Update Password"} <CheckCircle2 size={18} className="ml-3" />
              </Button>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
}

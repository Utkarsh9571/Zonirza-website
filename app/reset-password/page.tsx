import React, { Suspense } from 'react';
import ResetPasswordClientPage from './ResetPasswordClientPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password | Zoniraz Luxury',
  description: 'Reset your Zoniraz customer account password securely.',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-brand-bg dark:bg-[#080706]">
        <div className="w-full max-w-md bg-white/70 dark:bg-[#0f0d0c]/70 backdrop-blur-3xl border border-white rounded-[40px] p-12 text-center shadow-premium">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-gold animate-pulse">Loading Security Portal...</p>
        </div>
      </div>
    }>
      <ResetPasswordClientPage />
    </Suspense>
  );
}

import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Target, TrendingUp, Scale, CheckCircle2 } from 'lucide-react';
import { GoldReserveCalculator } from '@/components/finance/GoldReserveCalculator';

export const metadata: Metadata = {
  title: 'Gold Reserve Investment Plan | Zoniraz',
  description: 'Reigning Gold? Take shelter here. Every month you pay, you receive gold units at live value. Protect your wealth and shop for luxury jewelry.',
};

export default function GoldReservePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-brand-bg pt-32 md:pt-40 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0A192F] text-white py-20 px-6 sm:px-12 xl:px-24">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=2000" 
            alt="Gold Rings Background" 
            fill 
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0A192F] via-[#0A192F]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
              It&apos;s reigning gold.
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Take shelter here. Every month you pay, you receive gold units at live value. Complete 10 installments and receive your special benefit voucher to purchase the luxury jewelry you desire.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 inline-flex">
              <div className="flex-1">
                 <span className="text-[10px] uppercase tracking-widest text-white/60 block mb-1">Enter Monthly Amount</span>
                 <input type="number" defaultValue={2000} className="w-full bg-transparent border-b border-white/30 text-white font-bold outline-none focus:border-brand-gold py-1" />
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20"></div>
              <div className="flex-1">
                 <span className="text-[10px] uppercase tracking-widest text-white/60 block mb-1">Enter Email address</span>
                 <input type="email" placeholder="you@example.com" className="w-full bg-transparent border-b border-white/30 text-white font-bold outline-none focus:border-brand-gold py-1" />
              </div>
              <Link 
                href="/plans/onboarding/gold_reserve"
                className="px-8 py-3 bg-[#E55A44] text-white font-bold tracking-wider rounded-md hover:bg-[#E55A44]/90 transition-colors shadow-premium text-center"
              >
                GET STARTED
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block w-100">
            <div className="bg-[#0D213D] border border-white/10 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Scale size={120} />
               </div>
               <h3 className="text-3xl font-serif font-bold text-brand-gold mb-2">GRP</h3>
               <div className="h-px w-12 bg-brand-gold/50 mx-auto mb-2"></div>
               <p className="text-xs tracking-[0.2em] uppercase text-white/60 mb-6">Gold Reserve Plan</p>
               <p className="text-sm text-white/80 italic">The smartest monthly gold indulgence plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Gold Reserve Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-brand-text dark:text-white text-center mb-16">Why Gold Reserve Plan?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
               <Target size={28} />
             </div>
             <h3 className="text-lg font-bold text-brand-text dark:text-white">Plan Ahead</h3>
             <p className="text-sm text-brand-text/60 dark:text-white/60 max-w-xs">
               Subscribe to plan for your future high value purchases. Secure your wealth against inflation.
             </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
               <TrendingUp size={28} />
             </div>
             <h3 className="text-lg font-bold text-brand-text dark:text-white">Gold accumulation</h3>
             <p className="text-sm text-brand-text/60 dark:text-white/60 max-w-xs">
               With every instalment payment, gold units are allocated to your plan based on the prevailing gold rate.
             </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
               <ShieldCheck size={28} />
             </div>
             <h3 className="text-lg font-bold text-brand-text dark:text-white">Special benefits</h3>
             <p className="text-sm text-brand-text/60 dark:text-white/60 max-w-xs">
               Pay 10 instalments and get an extra voucher worth upto 1 instalment amount upon maturity.
             </p>
          </div>
        </div>
      </section>

      {/* How Does It Work - Timeline */}
      <section className="py-16 bg-white dark:bg-[#151515]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-brand-text dark:text-white text-center mb-16">How does it work?</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-12 lg:gap-24">
            
            <div className="flex-1 max-w-md relative">
              <div className="absolute inset-0 flex justify-center">
                 <div className="w-64 h-64 border border-dashed border-brand-gold/40 rounded-full"></div>
              </div>
              <div className="relative z-10 bg-white dark:bg-[#1A1A1A] p-8 rounded-full w-64 h-64 mx-auto flex flex-col items-center justify-center shadow-premium border border-brand-text/5 dark:border-white/5">
                <h3 className="text-2xl font-bold text-brand-text dark:text-white mb-2">3 easy steps</h3>
                <p className="text-center text-sm text-brand-text/60 dark:text-white/60">to purchase the jewellery your heart desires</p>
              </div>
            </div>

            <div className="flex-1 space-y-12">
               <div className="flex gap-6 items-start relative">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-gold text-brand-gold flex items-center justify-center font-bold bg-white dark:bg-[#111] z-10 shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-text dark:text-white mb-2 flex items-center gap-2">
                       Monthly Payments
                    </h4>
                    <p className="text-brand-text/60 dark:text-white/60 text-sm">Pay 10 monthly instalments to accumulate gold units safely with Zoniraz.</p>
                  </div>
               </div>

               <div className="flex gap-6 items-start relative">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-gold text-brand-gold flex items-center justify-center font-bold bg-white dark:bg-[#111] z-10 shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-text dark:text-white mb-2 flex items-center gap-2">
                       Get Special Benefits
                    </h4>
                    <p className="text-brand-text/60 dark:text-white/60 text-sm">Pay for 10 months on time and unlock an extra voucher worth upto 1 instalment.</p>
                  </div>
               </div>

               <div className="flex gap-6 items-start relative">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-gold text-brand-gold flex items-center justify-center font-bold bg-white dark:bg-[#111] z-10 shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-text dark:text-white mb-2 flex items-center gap-2">
                       Happy Shopping
                    </h4>
                     <p className="text-brand-text/60 dark:text-white/60 text-sm">Use the auto-redeemed voucher (equal to your total reserved gold units&apos; live value at maturity) to buy at any of our stores or online.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Calculator */}
      <section className="px-6">
        <GoldReserveCalculator />
      </section>

      {/* Note & CTA Footer */}
      <section className="py-16 text-center px-6 max-w-4xl mx-auto">
         <p className="text-xs text-brand-text/50 dark:text-white/50 mb-8 leading-relaxed bg-brand-gold/5 p-6 rounded-xl border border-brand-gold/10">
           <span className="text-brand-gold font-bold uppercase tracking-widest block mb-2">NOTE:</span>
           *1 gold unit = 1 gram of 24Kt gold.<br/>
           The Gold Reserve Option Plan is redeemable from 2nd month onwards, subject to terms and conditions.<br/>
           The Gold Reserve Plan is intended solely for purchasing luxury jewelry and cannot be encashed.
         </p>
         
         <h3 className="text-xl font-serif text-brand-text dark:text-white mb-6">Find answers to all your queries here</h3>
         <div className="flex justify-center items-center gap-8 text-sm text-brand-gold font-bold">
           <Link href="/help" className="hover:underline">View all FAQ &gt;&gt;</Link>
           <span className="text-brand-text/20">|</span>
           <Link href="/terms" className="hover:underline">View all Terms &amp; Conditions &gt;&gt;</Link>
         </div>
      </section>

    </div>
  );
}

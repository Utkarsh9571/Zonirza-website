import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Wallet, Tag, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GoldMineCalculator } from '@/components/finance/GoldMineCalculator';

export const metadata: Metadata = {
  title: 'Gold Mine 10+1 Monthly Savings Plan | Zoniraz',
  description: 'Pay for 10 months and get a 100% discount on the 11th installment. Start saving today for your luxury jewelry purchase.',
};

export default function GoldMinePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-brand-bg pt-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-bg dark:bg-[#111] text-white py-20 px-6 sm:px-12 xl:px-24">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Jewelry Background" 
            fill 
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Gold Mine <br/>
              <span className="text-brand-gold">10+1 Monthly Plan</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
              Plan ahead for your special moments. Pay 10 monthly installments and get 100% off on your 11th installment. Redeemable towards any Zoniraz jewelry.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/plans/onboarding/gold_mine"
                className="px-8 py-4 bg-brand-gold text-white font-bold tracking-wider rounded-md hover:bg-brand-gold/90 transition-colors shadow-premium inline-block"
              >
                START NOW
              </Link>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <ShieldCheck size={16} className="text-brand-gold" />
                <span>100% Secure & Transparent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Gold Mine Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif text-brand-text dark:text-white text-center mb-16">Why Gold Mine Plan?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
               <Wallet size={28} />
             </div>
             <h3 className="text-lg font-bold text-brand-text dark:text-white">Plan Ahead</h3>
             <p className="text-sm text-brand-text/60 dark:text-white/60 max-w-xs">
               Subscribe to plan for your future high-value luxury purchases with manageable monthly installments.
             </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
               <ShieldCheck size={28} />
             </div>
             <h3 className="text-lg font-bold text-brand-text dark:text-white">For Special Moments</h3>
             <p className="text-sm text-brand-text/60 dark:text-white/60 max-w-xs">
               Perfect for gifting on special occasions like Birthdays, Weddings, and Anniversaries.
             </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
               <Tag size={28} />
             </div>
             <h3 className="text-lg font-bold text-brand-text dark:text-white">Special Discounts</h3>
             <p className="text-sm text-brand-text/60 dark:text-white/60 max-w-xs">
               Pay 10 installments and get a 100% discount on the 11th installment automatically.
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
                  <div className="w-12 h-12 rounded-full border-2 border-brand-gold text-brand-gold flex items-center justify-center font-bold bg-white dark:bg-[#111] z-10 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-text dark:text-white mb-2 flex items-center gap-2">
                       <Wallet size={20} className="text-brand-gold" /> Pay Monthly
                    </h4>
                    <p className="text-brand-text/60 dark:text-white/60 text-sm">10 monthly installments with easy payment options. Setup once and relax.</p>
                  </div>
               </div>

               <div className="flex gap-6 items-start relative">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-gold text-brand-gold flex items-center justify-center font-bold bg-white dark:bg-[#111] z-10 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-text dark:text-white mb-2 flex items-center gap-2">
                       <Tag size={20} className="text-brand-gold" /> Get Special Discounts
                    </h4>
                    <p className="text-brand-text/60 dark:text-white/60 text-sm">Pay for 10 months on time and get 100% off on the 11th installment.</p>
                  </div>
               </div>

               <div className="flex gap-6 items-start relative">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-gold text-brand-gold flex items-center justify-center font-bold bg-white dark:bg-[#111] z-10 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-text dark:text-white mb-2 flex items-center gap-2">
                       <ShoppingBag size={20} className="text-brand-gold" /> Happy Shopping!
                    </h4>
                    <p className="text-brand-text/60 dark:text-white/60 text-sm">Use the auto-redeemed voucher provided to you on the date of 11th installment and buy at any of our stores or online.</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Calculator */}
      <section className="px-6">
        <GoldMineCalculator />
      </section>

      {/* Note & CTA Footer */}
      <section className="py-16 text-center px-6 max-w-4xl mx-auto">
         <p className="text-xs text-brand-text/50 dark:text-white/50 mb-8 leading-relaxed">
           <span className="text-brand-gold font-bold uppercase tracking-widest block mb-2">NOTE:</span>
           The subscription amount and benefits can be used towards the purchase of any gold, diamond, gemstone studded jewellery or plain gold jewellery.<br/>
           *Subject to terms and conditions.
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

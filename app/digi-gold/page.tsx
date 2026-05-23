import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';
import { ShieldCheck, TrendingUp, RefreshCw, Lock, Star, ChevronDown } from 'lucide-react';
import { DigiGoldCalculator } from '@/components/digi-gold/DigiGoldCalculator';

export const metadata: Metadata = {
  title: 'Digi Gold | Zoniraz Jewellery',
  description: 'Start your luxury digital gold savings journey with Zoniraz. Secure holdings, live rates, and easy redemption.',
};

export default function DigiGoldLandingPage() {
  return (
    <div className="bg-brand-bg min-h-screen text-brand-text">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-brand-bg/80 to-brand-bg z-10" />
          {/* Subtle background element instead of full image for cleaner look */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent" />
        </div>

        <Section className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/5">
                <Star size={14} className="text-brand-gold" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-gold">Introducing Zoniraz Digi Gold</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1]">
                Own Gold <br />
                <span className="italic text-brand-gold">Digitally.</span>
              </h1>
              <p className="text-lg text-brand-text/70 max-w-lg leading-relaxed">
                A secure, luxury savings experience. Build your gold portfolio with as little as ₹100, and redeem it for exquisite Zoniraz jewellery whenever you desire.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#faq">
                  <Button variant="outline" className="border-brand-text/20 hover:bg-brand-text/5 px-8 py-4 text-xs tracking-[0.2em]">Learn More</Button>
                </a>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md lg:max-w-none animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              {/* Interactive Calculator Component */}
              <DigiGoldCalculator />
            </div>
          </div>
        </Section>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-y border-brand-text/5">
        <Section className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif">How It Works</h2>
            <p className="text-brand-text/60 uppercase tracking-widest text-[11px] font-bold">Three steps to luxury savings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-brand-gold/20" />
            
            <div className="relative flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-brand-bg border border-brand-gold/30 flex items-center justify-center shadow-soft z-10 relative">
                <TrendingUp size={32} className="text-brand-gold" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-bold border-4 border-white">1</div>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Buy Live</h3>
                <p className="text-sm text-brand-text/60 leading-relaxed max-w-xs mx-auto">Purchase 24K digital gold at live market rates. Start your investment with just ₹100.</p>
              </div>
            </div>

            <div className="relative flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-brand-bg border border-brand-gold/30 flex items-center justify-center shadow-soft z-10 relative">
                <ShieldCheck size={32} className="text-brand-gold" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-bold border-4 border-white">2</div>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Store Securely</h3>
                <p className="text-sm text-brand-text/60 leading-relaxed max-w-xs mx-auto">Your digital holdings are tracked in your secure Zoniraz luxury wallet.</p>
              </div>
            </div>

            <div className="relative flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-brand-bg border border-brand-gold/30 flex items-center justify-center shadow-soft z-10 relative">
                <RefreshCw size={32} className="text-brand-gold" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-bold border-4 border-white">3</div>
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-3">Redeem Easily</h3>
                <p className="text-sm text-brand-text/60 leading-relaxed max-w-xs mx-auto">Exchange your digital gold balance for physical luxury jewellery at checkout.</p>
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* Key Features */}
      <section className="py-24 bg-[#1a1614] text-white">
        <Section className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-serif text-brand-gold italic">Premium Finance <br/><span className="text-white not-italic">Meets Luxury.</span></h2>
              <p className="text-white/60 leading-relaxed text-lg max-w-lg">
                Experience a modern approach to gold savings, designed exclusively for Zoniraz members.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                <div className="space-y-3">
                  <Lock className="text-brand-gold mb-4" size={28} />
                  <h4 className="font-bold text-white tracking-wide">Secure Holdings</h4>
                  <p className="text-sm text-white/50">Your wallet balances are meticulously tracked and protected.</p>
                </div>
                <div className="space-y-3">
                  <TrendingUp className="text-brand-gold mb-4" size={28} />
                  <h4 className="font-bold text-white tracking-wide">Live Gold Value</h4>
                  <p className="text-sm text-white/50">Real-time valuation based on active market rates.</p>
                </div>
                <div className="space-y-3">
                  <RefreshCw className="text-brand-gold mb-4" size={28} />
                  <h4 className="font-bold text-white tracking-wide">Seamless Exchange</h4>
                  <p className="text-sm text-white/50">Instantly convert digital value into physical masterpieces.</p>
                </div>
                <div className="space-y-3">
                  <Star className="text-brand-gold mb-4" size={28} />
                  <h4 className="font-bold text-white tracking-wide">Luxury Experience</h4>
                  <p className="text-sm text-white/50">A premium UI crafted for high-net-worth individuals.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/40 to-transparent mix-blend-overlay z-10" />
                <Image 
                  src="/images/images/product/yellow-gold-16010972111558.jpg" // Using an existing premium gold image
                  alt="Zoniraz Luxury Gold"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </Section>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-brand-bg">
        <Section className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif">Questions?</h2>
            <p className="text-brand-text/60 uppercase tracking-widest text-[11px] font-bold">Frequently Asked</p>
          </div>

          <div className="space-y-4">
            {/* Simple accordion mockups */}
            {[
              { q: "Is this real physical gold?", a: "This is a digital representation of your savings linked to the live price of 24K gold. You can redeem this balance against any physical jewellery purchase at Zoniraz." },
              { q: "What is the minimum amount to start?", a: "You can start your digital gold savings with as little as ₹100." },
              { q: "Are there any hidden charges?", a: "A standard 3% GST applies to your purchase, reflecting actual market conditions. There are no hidden storage fees." },
              { q: "How do I redeem my digital gold?", a: "At checkout, you will have the option to apply your Digi Gold wallet balance toward the purchase of any jewellery piece." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-[20px] border border-brand-gold overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between text-black p-6 cursor-pointer font-bold text-sm tracking-wide border border-brand-gold rounded-[20px]">
                  {faq.q}
                  <ChevronDown size={18} className="text-brand-gold group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-sm text-black leading-relaxed pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </Section>
      </section>

    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { History, Target, Eye, Gem, Users, Globe, Store, Headset, Sparkles, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-[#FDF9F6] pb-24 pt-32">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-6">
            <span className="w-12 h-[1px] bg-brand-gold/30"></span>
            <span>Est. 1976</span>
            <span className="w-12 h-[1px] bg-brand-gold/30"></span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif text-brand-text mb-8">Our Heritage</h1>
          <p className="text-brand-text/60 max-w-3xl mx-auto leading-relaxed text-lg">
            Zoniraz Jewel House Pvt Ltd is one of the leading jewellery manufacturer, wholesaler, retailer and exporter in the international Jewels market.
          </p>
        </motion.div>

        {/* 50 YEARS JOURNEY */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-3 text-brand-gold">
              <History size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">50 Years of Excellence</span>
            </div>
            <h2 className="text-4xl font-serif text-brand-text leading-tight">A Legacy of Trust and Craftsmanship</h2>
            <div className="space-y-6 text-brand-text/70 leading-relaxed">
              <p>From the last 50 Years we are serving for our loyal customers and delivering them not only a qualitative and best designs of Jewellery but also a trustful and responsible brand.</p>
              <p>Zoniraz Jewel house believes in customer satisfaction because it’s your own brand and without your satisfaction we can’t win your trust, & customer trust is a part of our policy. This is the only reason we always keep customer satisfaction and trust above the price and profit of our product.</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <span className="text-4xl font-serif text-brand-text">50+</span>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Years Experience</span>
              </div>
              <div className="w-[1px] h-12 bg-brand-text/10"></div>
              <div className="flex flex-col">
                <span className="text-4xl font-serif text-brand-text">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">BIS Hallmarked</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] bg-brand-text rounded-[60px] overflow-hidden shadow-premium group">
               <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay"></div>
               <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="text-center space-y-4">
                    <Award size={64} className="text-brand-gold mx-auto mb-4" />
                    <p className="font-serif text-2xl text-white">"Customer satisfaction is our mission, not a profit."</p>
                  </div>
               </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-gold rounded-full flex items-center justify-center text-center p-6 shadow-premium animate-pulse-slow">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">Global Export Leader</span>
            </div>
          </div>
        </section>

        {/* CORE PRODUCT RANGE */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-brand-text mb-4">Exquisite Collections</h2>
            <div className="w-24 h-[1px] bg-brand-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Rings', 'Earrings', 'Pendants'].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[40px] border border-brand-text/5 text-center group hover:border-brand-gold/30 transition-all shadow-soft">
                <Gem size={32} className="text-brand-gold mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-xl text-brand-text mb-2">{item}</h3>
                <p className="text-[10px] uppercase tracking-widest text-brand-text/40">Designer Collection</p>
              </div>
            ))}
          </div>
        </section>

        {/* INFRASTRUCTURE & EXPERIENCE */}
        <section className="bg-[#3A1C16] rounded-[60px] p-12 md:p-20 text-[#EAE1D5] mb-32 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 text-brand-gold">
                <Store size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Premium Infrastructure</span>
              </div>
              <h2 className="text-4xl font-serif leading-tight">The Showroom Experience</h2>
              <p className="text-[#EAE1D5]/70 leading-relaxed">
                When you step in our showroom you will feel a great ambience and well managed and decorated staff to serve you in finest way.
              </p>
              <ul className="space-y-4">
                {[
                  "Well-constructed 2 Floor Showroom",
                  "Wide area designer display lounges",
                  "Air Conditioned & Eye-warming lights",
                  "Musical Atmosphere & Cozy Sofas"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center space-x-3 text-sm">
                    <Sparkles size={16} className="text-brand-gold" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-8 text-center">
                  <div className="space-y-2">
                    <Headset size={32} className="text-brand-gold mx-auto" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">24/7 Support</p>
                  </div>
               </div>
               <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-8 text-center">
                  <div className="space-y-2">
                    <Globe size={32} className="text-brand-gold mx-auto" />
                    <p className="text-[10px] uppercase tracking-widest font-bold">Global Reach</p>
                  </div>
               </div>
               <div className="col-span-2 bg-brand-gold text-white p-8 rounded-3xl text-center space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold">Customer Helpline</p>
                  <a href="tel:180057226599" className="text-2xl font-serif block hover:underline tracking-widest">1800-572-26599</a>
               </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="bg-white p-12 md:p-16 rounded-[50px] border border-brand-text/5 shadow-premium group">
            <Target size={40} className="text-brand-gold mb-8 group-hover:rotate-45 transition-transform duration-500" />
            <h3 className="text-3xl font-serif text-brand-text mb-6">Our Mission</h3>
            <div className="space-y-4 text-sm text-brand-text/60 leading-relaxed">
              <p>Zoniraz Jewelhouse was founded with the mission: <strong className="text-brand-text">"Next Generation of Jewellery Industry for Customer Support and Satisfaction"</strong>.</p>
              <p>We dedicatedly begin our work at early stage and search for rough Diamonds in the most remote parts of the world, ensuring every client has a reason to smile.</p>
            </div>
          </div>
          <div className="bg-white p-12 md:p-16 rounded-[50px] border border-brand-text/5 shadow-premium group">
            <Eye size={40} className="text-brand-gold mb-8 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-3xl font-serif text-brand-text mb-6">Our Vision</h3>
            <div className="space-y-4 text-sm text-brand-text/60 leading-relaxed">
              <p>To reach every customer and become the largest jewellery chain with satisfied and happy customers.</p>
              <p>Jewellery is a part of culture and in India, women are considered symbols of power and love. Our jewellery increases the grace and glory of your personality.</p>
            </div>
          </div>
        </section>

        {/* CLOSING STATEMENT */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center p-20 bg-brand-bg rounded-[60px] border border-brand-text/5"
        >
          <Users size={48} className="text-brand-gold mx-auto mb-8" />
          <h3 className="text-3xl font-serif text-brand-text mb-6">Stay Connected</h3>
          <p className="text-brand-text/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Our customer can connect with us all around the world, no matter where you are and how much time you have been our customer.
          </p>
          <div className="flex justify-center space-x-4">
             <div className="w-12 h-12 rounded-full border border-brand-text/10 flex items-center justify-center text-brand-text/40 hover:bg-brand-text hover:text-white transition-all cursor-pointer">in</div>
             <div className="w-12 h-12 rounded-full border border-brand-text/10 flex items-center justify-center text-brand-text/40 hover:bg-brand-text hover:text-white transition-all cursor-pointer">X</div>
             <div className="w-12 h-12 rounded-full border border-brand-text/10 flex items-center justify-center text-brand-text/40 hover:bg-brand-text hover:text-white transition-all cursor-pointer">f</div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

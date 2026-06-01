'use client';

import { motion } from 'framer-motion';
import { Shield, Truck, CreditCard, Scale, Clock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrencyStore } from '@/store/currencyStore';
import { displayPrice } from '@/lib/currency';

const SHIPPING_SERVICES = [
  { service: "Royal Mail 1st Class", loc: "UK & Europe", schedule: "1-3 days", basePrice: 350 },
  { service: "Royal Mail Tracker", loc: "UK All", schedule: "1-3 days", basePrice: 450 },
  { service: "Standard Courier", loc: "UK Mainland", schedule: "1-3 days (7:30am-5:30pm)", basePrice: 550 },
  { service: "Standard Courier", loc: "NI, Eire, Scilly Isles", schedule: "1-3 days", basePrice: 850 },
  { service: "Priority Next Day", loc: "UK Mainland", schedule: "Pre 12pm", basePrice: 750 }
];

export default function PrivacyClientPage() {
  const { currentCurrency, rates } = useCurrencyStore();
  
  return (
    <div className="min-h-screen bg-[#FDF9F6] pb-24 pt-32">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-6">
            <span className="w-12 h-[1px] bg-brand-gold/30"></span>
            <span>Policy & Delivery</span>
            <span className="w-12 h-[1px] bg-brand-gold/30"></span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-8">Privacy & Shipping</h1>
          <p className="text-brand-text/60 max-w-2xl mx-auto leading-relaxed">
            Acquaint yourself with our terms and conditions regarding goods delivery, secure handling, and procurement policies.
          </p>
        </motion.div>

        {/* SHIPPING & DELIVERY OVERVIEW */}
        <section className="mb-24">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-text text-white flex items-center justify-center shadow-soft">
              <Truck size={24} />
            </div>
            <h2 className="text-3xl font-serif text-brand-text">Shipping & Delivery</h2>
          </div>
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-brand-text/5 shadow-premium space-y-8 text-brand-text/80 leading-relaxed text-sm md:text-base">
            <p>Welcome to the Shipping and Delivery Information page! You can purchase your items online and ship them directly to your doorstep. We use the best carriers in the business to make sure your order gets to you on time.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              <div className="space-y-3">
                <h4 className="font-bold text-brand-text flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-brand-gold" />
                  Free Delivery
                </h4>
                <p className="text-sm">Free two-day shipping is available on in-stock items. Place your order by 5pm, Monday to Friday to qualify.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-brand-text flex items-center gap-2">
                  <Clock size={16} className="text-brand-gold" />
                  Fast Processing
                </h4>
                <p className="text-sm">Items ordered before 5:00 pm will be delivered in two business days where available.</p>
              </div>
            </div>

            {/* SHIPPING COST TABLE */}
            <div className="overflow-hidden rounded-3xl border border-brand-text/5 mt-8">
              <table className="w-full text-left text-[11px] md:text-xs">
                <thead className="bg-brand-bg text-brand-text border-b border-brand-text/10">
                  <tr>
                    <th className="py-4 px-4 font-bold">Service</th>
                    <th className="py-4 px-4 font-bold">Locations</th>
                    <th className="py-4 px-4 font-bold">Schedule</th>
                    <th className="py-4 px-4 font-bold">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-text/5">
                  {SHIPPING_SERVICES.map((item, i) => (
                    <tr key={i} className="hover:bg-brand-gold/5 transition-colors">
                      <td className="py-4 px-4 font-medium text-brand-text">{item.service}</td>
                      <td className="py-4 px-4 text-brand-text/60">{item.loc}</td>
                      <td className="py-4 px-4 text-brand-text/60">{item.schedule}</td>
                      <td className="py-4 px-4 font-bold text-[#8B1D2F]">{displayPrice(item.basePrice, currentCurrency, rates)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] italic text-brand-text/40">* Free two-day shipping is not available on customized or engraved products.</p>
          </div>
        </section>

        {/* TERMS & CONDITIONS - LEGAL BLOCKS */}
        <div className="space-y-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold text-white flex items-center justify-center shadow-soft">
              <Scale size={24} />
            </div>
            <h2 className="text-3xl font-serif text-brand-text">Legal Terms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Entire Agreement",
                icon: FileText,
                content: "These Terms and Conditions represent the complete agreement of the parties. No additional terms in Buyer's purchase order shall be binding."
              },
              {
                title: "Delivery Estimates",
                icon: Clock,
                content: "All delivery dates are estimates. Seller shall not be liable for any loss or damage resulting from failure to deliver by the specified date."
              },
              {
                title: "Cancellation Policy",
                icon: AlertCircle,
                content: "Cancellations require written approval. A 25% fee applies once products are delivered to a carrier. Special orders cannot be canceled."
              },
              {
                title: "Limitation of Liability",
                icon: Shield,
                content: "Seller's liability shall not exceed the amount paid for the products. Any breach action must be commenced within one (1) year."
              },
              {
                title: "Return of Material",
                icon: CheckCircle2,
                content: "Buyer has five (5) days to inspect and reject Product in writing. Failure to do so constitutes irrevocable acceptance."
              },
              {
                title: "Payment Terms",
                icon: CreditCard,
                content: "Net cash thirty (30) days from invoice date. Overdue amounts accrue interest at 1.5% per month or the highest legal rate."
              }
            ].map((term, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-brand-text/5 hover:border-brand-gold/30 transition-all group">
                <term.icon size={28} className="text-brand-gold mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-lg text-brand-text mb-3">{term.title}</h3>
                <p className="text-[12px] text-brand-text/60 leading-relaxed">{term.content}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-[#3A1C16] p-10 rounded-[40px] text-[#EAE1D5] space-y-4">
             <h3 className="text-2xl font-serif">Governing Law</h3>
             <p className="text-sm text-[#EAE1D5]/60 leading-relaxed">
               This document shall be interpreted and governed by the law of the State of America, excluding its conflicts of laws rules. The parties specifically exclude the application of the United Nations Convention on the Sale of Goods.
             </p>
             <p className="text-[11px] text-brand-gold font-bold uppercase tracking-widest mt-4">Buyer is responsible for all applicable taxes and governmental charges.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

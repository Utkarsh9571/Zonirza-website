'use client';

import { ShieldCheck, Truck, CreditCard, Headphones } from 'lucide-react';

const ASSURANCES = [
  {
    icon: <ShieldCheck className="text-brand-gold/60" size={32} />,
    title: 'Certified Jewelry',
    description: 'Every piece is BIS Hallmarked & Diamond Certified by top labs (GIA, IGI).'
  },
  {
    icon: <Truck className="text-brand-gold/60" size={32} />,
    title: 'Insured Shipping',
    description: 'Complementary insured shipping on all orders directly to your doorstep.'
  },
  {
    icon: <CreditCard className="text-brand-gold/60" size={32} />,
    title: 'Secure Payments',
    description: 'State-of-the-art encryption ensures your payment data is always safe.'
  },
  {
    icon: <Headphones className="text-brand-gold/60" size={32} />,
    title: 'Expert Support',
    description: 'Our jewelry experts are available for guidance on your luxury selection.'
  }
];

export function AssuranceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-12 border-t border-brand-text/5 dark:border-white/5 transition-colors">
      {ASSURANCES.map((item, idx) => (
        <div key={idx} className="p-8 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-[35px] border border-brand-text/5 dark:border-white/5 flex items-start space-x-6 hover:shadow-premium transition-all duration-500 group">
          <div className="p-4 bg-white dark:bg-brand-bg rounded-2xl shadow-soft group-hover:scale-110 transition-transform duration-500">
            {item.icon}
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-brand-text">{item.title}</h4>
            <p className="text-xs leading-relaxed text-brand-text/50 uppercase tracking-wider">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

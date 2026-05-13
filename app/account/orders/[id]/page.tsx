'use client';

import { useState, useEffect, Suspense, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  Download, 
  MessageSquare,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Section } from '@/components/new-ui/Section';
import { Button } from '@/components/new-ui/Button';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { CURRENCIES, CurrencyCode } from '@/store/currencyStore';
import { resolveProductImage } from '@/lib/imageResolver';

function OrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchOrderDetail();
    }
  }, [status, router]);

  const fetchOrderDetail = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        router.push('/account?tab=orders');
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !order) {
    return (
      <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 flex items-center justify-center transition-colors duration-500">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    );
  }

  const currencySymbol = CURRENCIES[order.currency as CurrencyCode]?.symbol || '₹';
  const totalInCurrency = order.totalAmount * (order.exchangeRate || 1);

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-24 overflow-x-hidden transition-colors duration-500">
      <Section className="max-w-[1200px] mx-auto px-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/account?tab=orders" 
            className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-brand-text/40 hover:text-brand-text transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to History</span>
          </Link>
          <div className="flex items-center space-x-4">
             <button className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:underline">
               <Download size={14} />
               <span>Digital Invoice</span>
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column: Status & Items */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Status Tracking */}
            <div className="bg-white dark:bg-brand-white rounded-[50px] p-8 md:p-12 border border-brand-text/5 shadow-premium animate-in fade-in slide-in-from-bottom-4 duration-1000 transition-colors">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                    <h1 className="text-3xl font-serif text-brand-text mb-2">Order # {order._id.slice(-8).toUpperCase()}</h1>
                    <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="px-5 py-2 bg-brand-bg dark:bg-brand-bg/80 rounded-full border border-brand-gold/20 flex items-center space-x-2 transition-colors">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-text">{order.orderStatus}</span>
                  </div>
               </div>
               
               <OrderTimeline currentStatus={order.orderStatus} />
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-brand-white rounded-[50px] p-8 md:p-12 border border-brand-text/5 shadow-premium transition-colors">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-brand-text mb-10 border-b border-brand-text/5 pb-6">Included Masterpieces</h3>
              <div className="space-y-8">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center gap-8 group">
                    <div className="w-24 h-24 rounded-3xl bg-brand-bg dark:bg-brand-bg/50 flex items-center justify-center overflow-hidden border border-brand-text/5 shrink-0 transition-colors">
                       <Image 
                        src={resolveProductImage(item.image)} 
                        alt={item.name} 
                        width={96} 
                        height={96} 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/product/${item.slug}`} className="text-lg font-serif text-brand-text hover:text-brand-gold transition-colors">{item.name}</Link>
                        <p className="text-sm font-bold text-brand-text">{currencySymbol}{((item.price || 0) * (order.exchangeRate || 1)).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-4">
                        {item.configuration && Object.entries(item.configuration).map(([key, value]) => (
                          value && (
                            <div key={key} className="px-3 py-1 bg-brand-bg dark:bg-brand-bg rounded-lg border border-brand-text/5 dark:border-white/5 transition-colors">
                              <span className="text-[8px] uppercase tracking-widest text-brand-text/30 font-bold mr-2">{key}:</span>
                              <span className="text-[9px] font-bold text-brand-text uppercase">{value as string}</span>
                            </div>
                          )
                        ))}
                        <div className="px-3 py-1 bg-brand-bg dark:bg-brand-bg rounded-lg border border-brand-text/5 dark:border-white/5 transition-colors">
                          <span className="text-[8px] uppercase tracking-widest text-brand-text/30 font-bold mr-2">Qty:</span>
                          <span className="text-[9px] font-bold text-brand-text">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-brand-text/5 space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-brand-text/40">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{totalInCurrency.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-brand-text/40">
                  <span>Insured Shipping</span>
                  <span className="text-brand-gold">Complimentary</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <p className="text-lg font-serif text-brand-text">Grand Total</p>
                  <p className="text-2xl font-serif text-brand-gold font-bold italic">{currencySymbol}{totalInCurrency.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Info & Actions */}
          <div className="space-y-10">
            
            {/* Delivery Info */}
            <div className="bg-white dark:bg-brand-white rounded-[45px] p-8 border border-brand-text/5 shadow-soft space-y-8 transition-colors">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-bg dark:bg-brand-bg/80 text-brand-gold flex items-center justify-center transition-colors">
                  <MapPin size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-brand-text">Shipping Sanctuary</h3>
              </div>
              <div className="space-y-4 pl-2">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-text/30">Recipient</p>
                  <p className="text-xs font-bold text-brand-text">{order.shippingAddress.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-text/30">Address</p>
                  <p className="text-[11px] leading-relaxed text-brand-text/60">
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                    {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                  </p>
                </div>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-text/30">Contact</p>
                    <p className="text-[10px] font-bold text-brand-text flex items-center"><Phone size={12} className="mr-2 opacity-30" /> {order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-[#3A1C16] dark:bg-[#1a1614] rounded-[45px] p-8 text-[#EAE1D5] dark:text-brand-text/90 shadow-premium space-y-8 border dark:border-brand-gold/20 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <CreditCard size={20} className="text-brand-gold" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Financial Gateway</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Method</span>
                  <span className="text-[10px] font-bold">Secure Card / UPI</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Transaction Status</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                    order.paymentStatus === 'paid' ? "bg-green-500/20 text-green-300" : "bg-brand-gold/20 text-brand-gold"
                  )}>
                    {order.paymentStatus === 'paid' ? 'Success' : 'Processing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Assistance */}
            <div className="bg-brand-bg/50 dark:bg-brand-white rounded-[45px] p-10 border border-brand-text/5 text-center space-y-6 transition-colors">
               <MessageSquare size={32} className="text-brand-gold mx-auto opacity-30" />
               <div className="space-y-2">
                 <p className="text-sm font-serif italic text-brand-text">Need Assistance?</p>
                 <p className="text-[9px] uppercase tracking-widest text-brand-text/30 font-bold leading-relaxed">Our concierge is available 24/7 to discuss your masterpiece.</p>
               </div>
               <Button variant="outline" className="w-full !py-4 text-[9px] tracking-[0.3em] border-brand-text/10 dark:border-brand-gold/40 hover:bg-brand-text dark:hover:bg-brand-gold hover:text-white">Contact Concierge</Button>
            </div>
          </div>

        </div>
      </Section>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20 flex items-center justify-center transition-colors duration-500">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    }>
      <OrderDetailContent params={params} />
    </Suspense>
  );
}

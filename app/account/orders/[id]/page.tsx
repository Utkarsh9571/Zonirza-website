'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Package, Calendar, MapPin, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';

type OrderItem = { name: string; quantity: number; price: number; image?: string; configuration?: { metal?: string; purity?: string; size?: string; stone?: string } };
type TimelineEvent = { status: string; date: string };
type OrderType = { _id: string; createdAt: string; orderStatus: string; paymentStatus: string; totalAmount: number; discountAmount: number; shippingAddress?: { fullName?: string; addressLine?: string; city?: string; state?: string; pincode?: string; country?: string; phone?: string }; trackingDetails?: { trackingId?: string; courierPartner?: string; trackingUrl?: string; estimatedDeliveryDate?: string }; timeline?: TimelineEvent[]; items?: OrderItem[] };

export default function CustomerOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div className="pt-32 pb-20 text-center text-brand-text/50">Loading order tracker...</div>;
  if (!order) return <div className="pt-32 pb-20 text-center text-red-500">Order not found.</div>;

  const currentStatus = order.orderStatus;
  const isDelivered = currentStatus === 'Delivered' || currentStatus === 'delivered';
  const isCancelled = currentStatus === 'Cancelled' || currentStatus === 'cancelled';

  // Helper to determine step completion
  const timelineStages = ['Order Placed', 'Payment Confirmed', 'In Production', 'Stone Setting', 'Quality Check', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];
  
  const getStepStatus = (stepName: string) => {
    const currentIndex = timelineStages.indexOf(currentStatus);
    const stepIndex = timelineStages.indexOf(stepName);
    if (isCancelled) return stepName === 'Order Placed' ? 'complete' : 'cancelled';
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen pt-32 pb-20">
      <div className="max-w-300 mx-auto px-4 md:px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header - Hidden on Print */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1a1614] p-6 rounded-4xl border border-brand-text/10 shadow-soft print:hidden">
          <div className="flex items-center space-x-4">
            <Link href="/account?tab=orders" className="p-3 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-text/10">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-serif text-brand-text dark:text-white flex items-center">
                Order <span className="ml-3 px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold tracking-widest uppercase rounded-full">#{order._id.slice(-8).toUpperCase()}</span>
              </h1>
              <p className="text-xs text-brand-text/50 mt-1 flex items-center"><Calendar size={12} className="mr-1" /> Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <button 
            onClick={handlePrintInvoice}
            className="flex items-center px-6 py-3 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors"
          >
            <FileText size={16} className="mr-2" /> Download Summary
          </button>
        </div>

        {/* Print Header - Visible only on Print */}
        <div className="hidden print:block text-center border-b pb-8 mb-8 border-brand-text/20">
          <h1 className="text-3xl font-serif text-brand-gold uppercase tracking-[0.2em] mb-4">Luxury Jewelry</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-text">Luxury Order Summary</p>
          <p className="text-xs text-brand-text/60 mt-2">Order Reference: #{order._id}</p>
          <p className="text-xs text-brand-text/60">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Timeline & Items */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Visual Tracker */}
            <div className="bg-white dark:bg-[#1a1614] rounded-[40px] border border-brand-text/10 p-8 md:p-12 shadow-soft print:border-none print:shadow-none print:p-0">
              <h2 className="text-xl font-serif text-brand-text mb-8">Masterpiece Journey</h2>
              
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-brand-text/10" />
                
                <div className="space-y-10">
                  {timelineStages.map((stage, idx) => {
                    const status = getStepStatus(stage);
                    const matchingTimelineEvent = order.timeline?.find((t: TimelineEvent) => t.status === stage);
                    
                    // Only show stages up to current + 1 if not delivered
                    const currentIndex = timelineStages.indexOf(currentStatus);
                    if (!isDelivered && !isCancelled && idx > currentIndex + 1) return null;
                    if (isCancelled && idx > 0) return null;

                    return (
                      <div key={idx} className={`relative flex items-start space-x-6 ${status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                        {/* Status Icon Indicator */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-[#1a1614] ${
                          status === 'complete' ? 'bg-brand-gold text-white' : 
                          status === 'current' ? 'bg-white dark:bg-black border border-brand-gold text-brand-gold shadow-[0_0_15px_rgba(205,164,52,0.3)]' :
                          status === 'cancelled' ? 'bg-red-500 text-white' :
                          'bg-slate-100 dark:bg-white/5 text-brand-text/30'
                        }`}>
                          {status === 'complete' ? <CheckCircle2 size={20} /> : 
                           status === 'cancelled' ? <span className="font-bold">×</span> :
                           <div className={`w-2.5 h-2.5 rounded-full ${status === 'current' ? 'bg-brand-gold animate-pulse' : 'bg-brand-text/20'}`} />}
                        </div>
                        
                        <div className="pt-2">
                          <h3 className={`text-sm font-bold uppercase tracking-widest ${status === 'current' ? 'text-brand-gold' : 'text-brand-text dark:text-white'}`}>
                            {stage}
                          </h3>
                          {matchingTimelineEvent && (
                            <p className="text-[10px] uppercase tracking-widest text-brand-text/50 mt-1.5 font-bold">
                              {new Date(matchingTimelineEvent.date).toLocaleString()}
                            </p>
                          )}
                          {status === 'current' && !matchingTimelineEvent && (
                            <p className="text-[10px] uppercase tracking-widest text-brand-gold/70 mt-1.5 font-bold">
                              In Progress
                            </p>
                          )}
                          {stage === 'Shipped' && order.trackingDetails?.trackingId && status !== 'pending' && (
                            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-brand-text/5 inline-block">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/40 font-bold mb-1">Courier details</p>
                              <p className="text-xs font-bold text-brand-text dark:text-white">
                                {order.trackingDetails.courierPartner} • <span className="text-brand-gold">{order.trackingDetails.trackingId}</span>
                              </p>
                              {order.trackingDetails.trackingUrl && (
                                <a href={order.trackingDetails.trackingUrl} target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-widest text-blue-500 hover:underline mt-2 inline-block font-bold">
                                  Track Package ↗
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isCancelled && (
                    <div className="relative flex items-start space-x-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-[#1a1614] bg-red-500 text-white">
                        <span className="font-bold">×</span>
                      </div>
                      <div className="pt-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-red-500">Order Cancelled</h3>
                        <p className="text-[10px] uppercase tracking-widest text-red-400 mt-1.5 font-bold">Your order has been cancelled.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-[#1a1614] rounded-[40px] border border-brand-text/10 p-8 md:p-12 shadow-soft print:border-none print:shadow-none print:p-0">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-8 flex items-center">
                <Package size={16} className="mr-2" /> Order Details
              </h2>
              <div className="space-y-8">
                {order.items?.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start gap-8 pb-8 border-b border-brand-text/5 last:border-0 last:pb-0">
                    <div className="w-32 h-32 rounded-2xl border border-brand-text/10 overflow-hidden bg-white shrink-0 shadow-sm print:w-20 print:h-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-serif text-brand-text dark:text-white">{item.name}</h3>
                          <p className="text-[10px] uppercase tracking-widest text-brand-text/50 font-bold mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-brand-gold bg-brand-gold/5 px-4 py-2 rounded-xl">₹ {item.price.toLocaleString()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-text/60 bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-brand-text/5">
                        <p>Metal: <span className="text-brand-text dark:text-white ml-1">{item.configuration?.metal || 'N/A'}</span></p>
                        <p>Purity: <span className="text-brand-text dark:text-white ml-1">{item.configuration?.purity || 'N/A'}</span></p>
                        {item.configuration?.size && <p>Size: <span className="text-brand-text dark:text-white ml-1">{item.configuration.size}</span></p>}
                        {item.configuration?.stone && <p>Stone: <span className="text-brand-text dark:text-white ml-1">{item.configuration.stone}</span></p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Shipping */}
          <div className="space-y-8">
            
            <div className="bg-white dark:bg-[#1a1614] rounded-4xl border border-brand-text/10 p-8 shadow-soft print:border-none print:shadow-none print:p-0">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-6">Payment Summary</h2>
              <div className="space-y-4 text-sm font-medium border-b border-brand-text/5 pb-6 mb-6">
                <div className="flex justify-between items-center text-brand-text/70">
                  <span>Subtotal</span>
                  <span>₹ {(order.totalAmount + order.discountAmount).toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount Applied</span>
                    <span>- ₹ {order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-brand-text/70">
                  <span>Shipping</span>
                  <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Complimentary</span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-brand-text/40 font-bold mb-1">Total Paid</p>
                  <p className="text-3xl font-serif text-brand-text dark:text-white">₹ {order.totalAmount?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                    {order.paymentStatus === 'paid' ? 'Paid Successfully' : order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1614] rounded-4xl border border-brand-text/10 p-8 shadow-soft print:border-none print:shadow-none print:p-0">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-6 flex items-center">
                <MapPin size={16} className="mr-2" /> Shipping Destination
              </h2>
              <div className="space-y-2 text-sm text-brand-text/80 dark:text-white/80 leading-relaxed bg-slate-50 dark:bg-black/20 p-5 rounded-2xl border border-brand-text/5">
                <p className="font-bold text-brand-text dark:text-white pb-2 border-b border-brand-text/5 mb-2">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                <p>{order.shippingAddress?.country}</p>
                <p className="pt-2 mt-2 border-t border-brand-text/5 text-xs text-brand-text/50 font-bold tracking-widest uppercase">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {order.trackingDetails?.estimatedDeliveryDate && (
              <div className="bg-brand-gold/5 rounded-4xl border border-brand-gold/20 p-8 shadow-sm flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-1">Estimated Delivery</h3>
                  <p className="text-sm font-bold text-brand-text dark:text-white">
                    {new Date(order.trackingDetails.estimatedDeliveryDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center pt-4 print:hidden">
              <p className="text-[10px] uppercase tracking-widest text-brand-text/40 font-bold">Need assistance with your order?</p>
              <Link href="/contact" className="text-xs font-bold text-brand-gold hover:underline mt-2 inline-block">Contact Concierge Support</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

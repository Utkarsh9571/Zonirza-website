'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { ArrowLeft, Save, Package, Truck, Calendar, MapPin, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PricingBreakdown {
  estimatedGoldWeight?: number;
  estimatedWeight?: number;
  metalPrice?: number;
  isDiamond?: boolean;
  isStone?: boolean;
  stoneWeightCarats?: number;
  stonePrice?: number;
  stoneName?: string;
  makingCharges?: number;
  gst?: number;
  totalPrice?: number;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  configuration?: {
    metal?: string;
    purity?: string;
    size?: string;
    stone?: string;
  };
  pricingBreakdown?: PricingBreakdown;
}

interface TimelineEvent {
  status: string;
  date: string | Date;
  notes?: string;
}

interface TrackingDetails {
  courierPartner: string;
  trackingId: string;
  trackingUrl: string;
  estimatedDeliveryDate: string;
}

interface Order {
  _id: string;
  createdAt: string | Date;
  items?: OrderItem[];
  totalAmount?: number;
  discountAmount?: number;
  razorpayOrderId?: string;
  orderStatus: string;
  paymentStatus: string;
  trackingDetails?: TrackingDetails;
  shippingAddress?: {
    fullName?: string;
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    phone?: string;
  };
  timeline?: TimelineEvent[];
}

export default function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [timelineNotes, setTimelineNotes] = useState('');
  const [trackingDetails, setTrackingDetails] = useState({
    courierPartner: '',
    trackingId: '',
    trackingUrl: '',
    estimatedDeliveryDate: ''
  });

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json() as { success: boolean; data: Order };
      if (data.success) {
        setOrder(data.data);
        setOrderStatus(data.data.orderStatus);
        setPaymentStatus(data.data.paymentStatus);
        setTrackingDetails({
          courierPartner: data.data.trackingDetails?.courierPartner || '',
          trackingId: data.data.trackingDetails?.trackingId || '',
          trackingUrl: data.data.trackingDetails?.trackingUrl || '',
          estimatedDeliveryDate: data.data.trackingDetails?.estimatedDeliveryDate ? new Date(data.data.trackingDetails.estimatedDeliveryDate).toISOString().split('T')[0] : ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          trackingDetails: {
            ...trackingDetails,
            estimatedDeliveryDate: trackingDetails.estimatedDeliveryDate ? new Date(trackingDetails.estimatedDeliveryDate) : undefined
          },
          timelineNotes
        })
      });
      if (res.ok) {
        alert('Order updated successfully! Customer notified.');
        fetchOrder();
        setTimelineNotes('');
      } else {
        alert('Failed to update order');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-brand-text/50">Loading order details...</div>;
  if (!order) return <div className="p-20 text-center text-red-500">Order not found.</div>;

  return (
    <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1a1614] p-6 rounded-4xl border border-brand-text/10 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/admin/orders" className="p-3 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-brand-text/10">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-serif text-brand-text dark:text-white flex items-center">
              Order <span className="ml-3 px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-bold tracking-widest uppercase rounded-full">#{order._id.slice(-8).toUpperCase()}</span>
            </h1>
            <p className="text-xs text-brand-text/50 mt-1 flex items-center"><Calendar size={12} className="mr-1" /> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-8 py-4 bg-brand-gold text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-premium hover:bg-brand-gold/90 transition-all disabled:opacity-50"
        >
          {saving ? 'Updating...' : <><Save size={16} className="mr-2" /> Update Order</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Lifecycle & Tracking */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Status Control */}
          <div className="bg-white dark:bg-white/5 rounded-4xl border border-brand-text/10 p-8 space-y-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold">Workflow State</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Order Stage</label>
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-4 text-sm font-bold text-brand-text dark:text-white"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Payment Confirmed">Payment Confirmed</option>
                  <option value="In Production">In Production</option>
                  <option value="Stone Setting">Stone Setting</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Payment Status</label>
                <select 
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-4 text-sm font-bold text-brand-text dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Internal Timeline Note (Optional)</label>
                <textarea 
                  value={timelineNotes}
                  onChange={(e) => setTimelineNotes(e.target.value)}
                  placeholder="Notes for this transition..."
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-4 text-sm font-medium text-brand-text dark:text-white"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Tracking Control */}
          <div className="bg-white dark:bg-white/5 rounded-4xl border border-brand-text/10 p-8 space-y-6 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold flex items-center">
              <Truck size={16} className="mr-2" /> Tracking Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Courier Partner</label>
                <input 
                  type="text"
                  value={trackingDetails.courierPartner}
                  onChange={(e) => setTrackingDetails({ ...trackingDetails, courierPartner: e.target.value })}
                  placeholder="e.g. BlueDart, FedEx"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-3 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Tracking ID</label>
                <input 
                  type="text"
                  value={trackingDetails.trackingId}
                  onChange={(e) => setTrackingDetails({ ...trackingDetails, trackingId: e.target.value })}
                  placeholder="AWB Number"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-3 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Tracking URL</label>
                <input 
                  type="url"
                  value={trackingDetails.trackingUrl}
                  onChange={(e) => setTrackingDetails({ ...trackingDetails, trackingUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-3 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-brand-text/60 mb-2">Est. Delivery Date</label>
                <input 
                  type="date"
                  value={trackingDetails.estimatedDeliveryDate}
                  onChange={(e) => setTrackingDetails({ ...trackingDetails, estimatedDeliveryDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-brand-text/20 dark:border-white/20 rounded-xl p-3 text-sm font-bold"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Order Info & Customer Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-white/5 rounded-4xl border border-brand-text/10 p-8 shadow-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-6 flex items-center">
              <Package size={16} className="mr-2" /> Order Items ({order.items?.length})
            </h2>
            <div className="space-y-6">
              {order.items?.map((item: OrderItem, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start gap-6 p-4 rounded-2xl border border-brand-text/5 bg-slate-50/50 dark:bg-black/20">
                  <div className="w-24 h-24 rounded-xl border border-brand-text/10 overflow-hidden bg-white shrink-0 relative">
                    <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-brand-text dark:text-white">{item.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-brand-text/50 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-brand-gold">₹ {item.price.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-brand-text/70 bg-white dark:bg-black/40 p-3 rounded-lg border border-brand-text/5">
                      <p><strong>Metal:</strong> {item.configuration?.metal || 'N/A'}</p>
                      <p><strong>Purity:</strong> {item.configuration?.purity || 'N/A'}</p>
                      {item.configuration?.size && <p><strong>Size:</strong> {item.configuration.size}</p>}
                      {item.configuration?.stone && <p><strong>Stone:</strong> {item.configuration.stone}</p>}
                    </div>
                    {item.pricingBreakdown && (
                      <div className="mt-3 pt-3 border-t border-brand-text/10 text-[10px] space-y-1 font-mono uppercase tracking-wider text-brand-text/80">
                        <p className="font-bold text-brand-gold mb-1">Pricing Breakdown</p>
                        <div className="flex justify-between">
                          <span>Gold Weight: {item.pricingBreakdown.estimatedGoldWeight || item.pricingBreakdown.estimatedWeight || 0}g</span>
                          <span>₹ {item.pricingBreakdown.metalPrice?.toLocaleString()}</span>
                        </div>
                        {item.pricingBreakdown?.isDiamond && ((item.pricingBreakdown.stoneWeightCarats || 0) > 0 || (item.pricingBreakdown.stonePrice || 0) > 0) && (
                          <div className="flex justify-between">
                            <span>Diamond Weight: {(item.pricingBreakdown.stoneWeightCarats || 0).toFixed(2)}ct</span>
                            <span>₹ {item.pricingBreakdown.stonePrice?.toLocaleString()}</span>
                          </div>
                        )}
                        {item.pricingBreakdown?.isStone && ((item.pricingBreakdown.stoneWeightCarats || 0) > 0 || (item.pricingBreakdown.stonePrice || 0) > 0) && (
                          <div className="flex justify-between">
                            <span>{item.pricingBreakdown.stoneName || 'Stone'} Weight: {(item.pricingBreakdown.stoneWeightCarats || 0).toFixed(2)}ct</span>
                            <span>₹ {item.pricingBreakdown.stonePrice?.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Making Charges:</span>
                          <span>₹ {item.pricingBreakdown.makingCharges?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>GST (3%):</span>
                          <span>₹ {item.pricingBreakdown.gst?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-brand-text/5 pt-1 mt-1 text-brand-gold">
                          <span>Subtotal + Tax:</span>
                          <span>₹ {(item.pricingBreakdown.totalPrice || item.price)?.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-brand-text/10 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-brand-text/50 font-bold">Total Amount</p>
                <p className="text-2xl font-serif text-brand-text dark:text-white mt-1">₹ {order.totalAmount?.toLocaleString()}</p>
                {order.razorpayOrderId && (
                  <p className="text-[9px] uppercase tracking-widest text-brand-text/40 font-bold flex items-center mt-2">
                    <IndianRupee size={10} className="mr-1" /> Razorpay: {order.razorpayOrderId}
                  </p>
                )}
              </div>
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Discount Applied</p>
                  <p className="text-sm font-bold text-green-600 mt-1">- ₹ {order.discountAmount.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-white/5 rounded-4xl border border-brand-text/10 p-8 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-4 flex items-center">
                <MapPin size={16} className="mr-2" /> Shipping Address
              </h2>
              <div className="space-y-2 text-sm text-brand-text/80 dark:text-white/80">
                <p className="font-bold text-brand-text dark:text-white">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                <p>{order.shippingAddress?.country}</p>
                <p className="pt-2 font-mono text-xs">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-4xl border border-brand-text/10 p-8 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-brand-gold mb-4 flex items-center">
                <Calendar size={16} className="mr-2" /> Lifecycle Timeline
              </h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-1.25 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-brand-gold/20 before:to-transparent">
                {order.timeline?.slice().reverse().map((event: TimelineEvent, idx: number) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-brand-gold text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-brand-text/5 shadow-sm">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-[11px] uppercase tracking-widest text-brand-text dark:text-white">{event.status}</div>
                      </div>
                      <div className="text-[9px] text-brand-text/50">{new Date(event.date).toLocaleString()}</div>
                      {event.notes && <div className="text-[10px] mt-2 text-brand-text/70 italic border-t border-brand-text/5 pt-2">{event.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

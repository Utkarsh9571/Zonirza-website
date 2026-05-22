import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  configuration: {
    metal: string;
    purity: string;
    size?: string;
    stone?: string;
  };
}

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;
  guestId?: string; // For tracking guest sessions if needed
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'Order Placed' | 'Payment Confirmed' | 'In Production' | 'Stone Setting' | 'Quality Check' | 'Packed' | 'Out For Delivery' | 'Delivered' | 'Cancelled';
  timeline: {
    status: string;
    date: Date;
    notes?: string;
  }[];
  trackingDetails?: {
    courierPartner?: string;
    trackingId?: string;
    trackingUrl?: string;
    estimatedDeliveryDate?: Date;
  };
  currency: string;
  exchangeRate: number;
  discountAmount: number;
  couponCode?: string;
  razorpayOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    guestId: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        configuration: {
          metal: { type: String, required: true },
          purity: { type: String, required: true },
          size: { type: String },
          stone: { type: String },
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'Order Placed', 'Payment Confirmed', 'In Production', 'Stone Setting', 'Quality Check', 'Packed', 'Out For Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Placed',
    },
    timeline: [
      {
        status: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now },
        notes: { type: String }
      }
    ],
    trackingDetails: {
      courierPartner: { type: String },
      trackingId: { type: String },
      trackingUrl: { type: String },
      estimatedDeliveryDate: { type: Date }
    },
    currency: { type: String, required: true, default: 'INR' },
    exchangeRate: { type: Number, required: true, default: 1 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    razorpayOrderId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

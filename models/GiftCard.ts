import mongoose, { Schema, Document } from 'mongoose';

export interface IGiftCard extends Document {
  code: string;
  pin: string;
  initialAmount: number;
  currentBalance: number;
  currency: string;
  senderUserId?: mongoose.Types.ObjectId;
  recipientEmail: string;
  recipientName: string;
  personalMessage?: string;
  status: 'pending' | 'active' | 'redeemed' | 'partially_redeemed' | 'expired' | 'cancelled';
  purchasedOrderId?: mongoose.Types.ObjectId;
  expirationDate: Date;
  createdByAdmin: boolean;
  createdByUser: boolean;
  issuedAt?: Date;
  lastUsedAt?: Date;
  theme: string;
  scheduledAt?: Date;
  scheduledFor?: Date;
  deliveryStatus: 'delivered' | 'pending' | 'failed';
  deliveryChannel?: string;
  deliveredAt?: Date;
  openedAt?: Date;
  firstRedeemedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GiftCardSchema = new Schema<IGiftCard>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    pin: {
      type: String,
      required: true,
      trim: true,
    },
    initialAmount: {
      type: Number,
      required: true,
      min: [0, 'Initial amount cannot be negative'],
    },
    currentBalance: {
      type: Number,
      required: true,
      min: [0, 'Balance cannot be negative'],
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    senderUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recipientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    recipientName: {
      type: String,
      required: true,
      trim: true,
    },
    personalMessage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'redeemed', 'partially_redeemed', 'expired', 'cancelled'],
      default: 'pending',
      required: true,
    },
    purchasedOrderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    createdByAdmin: {
      type: Boolean,
      default: false,
    },
    createdByUser: {
      type: Boolean,
      default: false,
    },
    issuedAt: {
      type: Date,
    },
    lastUsedAt: {
      type: Date,
    },
    theme: {
      type: String,
      default: 'Minimal Luxury',
    },
    scheduledAt: {
      type: Date,
    },
    scheduledFor: {
      type: Date,
    },
    deliveryStatus: {
      type: String,
      enum: ['delivered', 'pending', 'failed'],
      default: 'delivered',
    },
    deliveryChannel: {
      type: String,
      default: 'email',
    },
    deliveredAt: {
      type: Date,
    },
    openedAt: {
      type: Date,
    },
    firstRedeemedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for faster lookups
GiftCardSchema.index({ senderUserId: 1 });
GiftCardSchema.index({ recipientEmail: 1 });

export default mongoose.models.GiftCard || mongoose.model<IGiftCard>('GiftCard', GiftCardSchema);

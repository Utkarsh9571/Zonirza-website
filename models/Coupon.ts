import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartValue: number;
  maxDiscount?: number;
  expirationDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  restrictions: {
    categories: string[];
    products: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minCartValue: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  expirationDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  restrictions: {
    categories: [{ type: String }],
    products: [{ type: String }]
  }
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

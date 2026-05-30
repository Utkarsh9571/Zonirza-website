import mongoose, { Schema, Document } from 'mongoose';

export interface IWheelPrize extends Document {
  title: string;
  couponId?: mongoose.Types.ObjectId;
  couponCode?: string;
  probabilityWeight: number;
  enabled: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const WheelPrizeSchema = new Schema<IWheelPrize>(
  {
    title: { type: String, required: true },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    couponCode: { type: String, uppercase: true, trim: true },
    probabilityWeight: { type: Number, required: true, default: 1 },
    enabled: { type: Boolean, required: true, default: true },
    displayOrder: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.WheelPrize || mongoose.model<IWheelPrize>('WheelPrize', WheelPrizeSchema);

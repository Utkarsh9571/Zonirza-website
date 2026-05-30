import mongoose, { Schema, Document } from 'mongoose';

export interface ISpinAttempt extends Document {
  userId?: mongoose.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  wheelSlot: number;
  couponCode?: string;
  claimed: boolean;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SpinAttemptSchema = new Schema<ISpinAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    wheelSlot: { type: Number, required: true },
    couponCode: { type: String, uppercase: true, trim: true },
    claimed: { type: Boolean, default: false },
    claimedAt: { type: Date },
  },
  { timestamps: true }
);

// Optimize query index for validation checking: last 24h per user or IP
SpinAttemptSchema.index({ userId: 1, createdAt: -1 });
SpinAttemptSchema.index({ ipAddress: 1, createdAt: -1 });

export default mongoose.models.SpinAttempt || mongoose.model<ISpinAttempt>('SpinAttempt', SpinAttemptSchema);

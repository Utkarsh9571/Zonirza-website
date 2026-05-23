import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalGoldWallet extends Document {
  userId: mongoose.Types.ObjectId | string;
  totalGrams: number;
  lockedGrams: number; // Prevent double redemption during checkout
  totalInvestment: number;
  currentEstimatedValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalGoldWalletSchema = new Schema<IDigitalGoldWallet>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalGrams: { type: Number, required: true, default: 0 },
  lockedGrams: { type: Number, required: true, default: 0 },
  totalInvestment: { type: Number, required: true, default: 0 },
  currentEstimatedValue: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.models.DigitalGoldWallet || mongoose.model<IDigitalGoldWallet>('DigitalGoldWallet', DigitalGoldWalletSchema);

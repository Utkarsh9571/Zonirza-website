import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalGoldTransaction extends Document {
  walletId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  type: 'buy' | 'sell' | 'redeem' | 'exchange' | 'lock' | 'unlock';
  rupeeAmount: number;
  goldGrams: number;
  goldRateAtExecution: number;
  status: 'pending' | 'success' | 'failed';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  metadata?: Record<string, any>;
  linkedOrderId?: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalGoldTransactionSchema = new Schema<IDigitalGoldTransaction>({
  walletId: { type: Schema.Types.ObjectId, ref: 'DigitalGoldWallet', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sell', 'redeem', 'exchange', 'lock', 'unlock'], required: true },
  rupeeAmount: { type: Number, required: true },
  goldGrams: { type: Number, required: true },
  goldRateAtExecution: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String },
  metadata: { type: Schema.Types.Mixed },
  linkedOrderId: { type: Schema.Types.ObjectId, ref: 'Order' },
}, { timestamps: true });

export default mongoose.models.DigitalGoldTransaction || mongoose.model<IDigitalGoldTransaction>('DigitalGoldTransaction', DigitalGoldTransactionSchema);

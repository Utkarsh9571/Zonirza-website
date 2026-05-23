import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalGoldSIP extends Document {
  userId: mongoose.Types.ObjectId | string;
  monthlyAmount: number;
  goalName?: string;
  targetAmount?: number;
  startDate: Date;
  nextDueDate: Date;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  autoPayEnabled: boolean;
  totalInvested: number;
  totalGramsAccumulated: number;
  installmentsPaid: number;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalGoldSIPSchema = new Schema<IDigitalGoldSIP>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  monthlyAmount: { type: Number, required: true },
  goalName: { type: String },
  targetAmount: { type: Number },
  startDate: { type: Date, required: true, default: Date.now },
  nextDueDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'paused', 'completed', 'cancelled'], default: 'active' },
  autoPayEnabled: { type: Boolean, default: false },
  totalInvested: { type: Number, default: 0 },
  totalGramsAccumulated: { type: Number, default: 0 },
  installmentsPaid: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.DigitalGoldSIP || mongoose.model<IDigitalGoldSIP>('DigitalGoldSIP', DigitalGoldSIPSchema);

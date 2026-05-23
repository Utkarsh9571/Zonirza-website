import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalGoldSIPInstallment extends Document {
  sipId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  amount: number;
  dueDate: Date;
  paidAt?: Date;
  status: 'upcoming' | 'paid' | 'overdue' | 'failed' | 'skipped';
  linkedTransactionId?: mongoose.Types.ObjectId | string;
  razorpayOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalGoldSIPInstallmentSchema = new Schema<IDigitalGoldSIPInstallment>({
  sipId: { type: Schema.Types.ObjectId, ref: 'DigitalGoldSIP', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidAt: { type: Date },
  status: { type: String, enum: ['upcoming', 'paid', 'overdue', 'failed', 'skipped'], default: 'upcoming' },
  linkedTransactionId: { type: Schema.Types.ObjectId, ref: 'DigitalGoldTransaction' },
  razorpayOrderId: { type: String }
}, { timestamps: true });

export default mongoose.models.DigitalGoldSIPInstallment || mongoose.model<IDigitalGoldSIPInstallment>('DigitalGoldSIPInstallment', DigitalGoldSIPInstallmentSchema);

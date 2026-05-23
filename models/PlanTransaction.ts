import mongoose, { Schema, Document } from 'mongoose';

export interface IPlanTransaction extends Document {
  enrollmentId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  
  installmentNumber: number; // e.g., 1 to 10
  amount: number;
  
  status: 'pending' | 'success' | 'failed' | 'refunded';
  
  paymentMethod?: string;
  gatewayReference?: string; // Razorpay Payment ID or Order ID
  
  dueDate: Date;
  paidAt?: Date;
  
  // For Gold Reserve (snapshotting the exact gold rate at the time of payment)
  goldRateApplied?: number;
  goldUnitsAdded?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const PlanTransactionSchema = new Schema<IPlanTransaction>({
  enrollmentId: { type: Schema.Types.ObjectId, ref: 'PlanEnrollment', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  installmentNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'refunded'], 
    default: 'pending' 
  },
  
  paymentMethod: { type: String },
  gatewayReference: { type: String },
  
  dueDate: { type: Date, required: true },
  paidAt: { type: Date },
  
  goldRateApplied: { type: Number },
  goldUnitsAdded: { type: Number },
}, { timestamps: true });

export default mongoose.models.PlanTransaction || mongoose.model<IPlanTransaction>('PlanTransaction', PlanTransactionSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingSnapshot {
  monthlyAmount: number;
  durationMonths: number;
  bonusMultiplier: number;
  bonusAmount: number;
  maturityAmount: number;
  // For Gold Reserve
  goldRatePerGramAtEnrollment?: number;
  projectedGoldAccumulation?: number;
}

export interface IPlanEnrollment extends Document {
  userId: mongoose.Types.ObjectId | string;
  planType: 'gold_mine' | 'gold_reserve';
  status: 'active' | 'completed' | 'suspended' | 'cancelled';
  
  // Financial Snapshot (Immutable at enrollment)
  pricingSnapshot: IPricingSnapshot;
  
  // Progress
  installmentsPaid: number;
  totalAmountPaid: number;
  accumulatedGoldGrams?: number; // For Gold Reserve
  
  // Dates
  enrollmentDate: Date;
  maturityDate: Date;
  nextPaymentDate: Date;
  
  // References
  targetProductId?: mongoose.Types.ObjectId | string; // Optional: If enrolled from a specific PDP
  
  createdAt: Date;
  updatedAt: Date;
}

const PricingSnapshotSchema = new Schema<IPricingSnapshot>({
  monthlyAmount: { type: Number, required: true },
  durationMonths: { type: Number, required: true },
  bonusMultiplier: { type: Number, required: true },
  bonusAmount: { type: Number, required: true },
  maturityAmount: { type: Number, required: true },
  goldRatePerGramAtEnrollment: { type: Number },
  projectedGoldAccumulation: { type: Number },
}, { _id: false });

const PlanEnrollmentSchema = new Schema<IPlanEnrollment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, enum: ['gold_mine', 'gold_reserve'], required: true },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'suspended', 'cancelled'], 
    default: 'active' 
  },
  
  pricingSnapshot: { type: PricingSnapshotSchema, required: true },
  
  installmentsPaid: { type: Number, default: 0 },
  totalAmountPaid: { type: Number, default: 0 },
  accumulatedGoldGrams: { type: Number, default: 0 },
  
  enrollmentDate: { type: Date, default: Date.now },
  maturityDate: { type: Date, required: true },
  nextPaymentDate: { type: Date, required: true },
  
  targetProductId: { type: Schema.Types.ObjectId, ref: 'Product' },
}, { timestamps: true });

export default mongoose.models.PlanEnrollment || mongoose.model<IPlanEnrollment>('PlanEnrollment', PlanEnrollmentSchema);

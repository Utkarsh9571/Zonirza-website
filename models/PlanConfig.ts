import mongoose, { Schema, Document } from 'mongoose';

export interface IPlanConfig extends Document {
  planType: 'gold_mine' | 'gold_reserve';
  name: string;
  description: string;
  isActive: boolean;
  
  // Plan Rules
  durationMonths: number;
  bonusMultiplier: number; // e.g., 1.0 for 100% of 1 installment, 0.5 for 50%
  minimumMonthlyAmount: number;
  maximumMonthlyAmount?: number;
  
  // Gold Reserve specific
  currentGoldRatePerGram?: number; // Manual override/current rate for reserve
  goldPurity?: string; // e.g., '24K' for reserve accumulation
  
  createdAt: Date;
  updatedAt: Date;
}

const PlanConfigSchema = new Schema<IPlanConfig>({
  planType: { 
    type: String, 
    enum: ['gold_mine', 'gold_reserve'], 
    required: true,
    unique: true // Usually one active config per plan type
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  
  durationMonths: { type: Number, required: true, default: 10 },
  bonusMultiplier: { type: Number, required: true, default: 1.0 },
  minimumMonthlyAmount: { type: Number, required: true, default: 2000 },
  maximumMonthlyAmount: { type: Number },
  
  currentGoldRatePerGram: { type: Number },
  goldPurity: { type: String, default: '24K' },
  
}, { timestamps: true });

export default mongoose.models.PlanConfig || mongoose.model<IPlanConfig>('PlanConfig', PlanConfigSchema);

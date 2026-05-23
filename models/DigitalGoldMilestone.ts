import mongoose, { Schema, Document } from 'mongoose';

export interface IDigitalGoldMilestone extends Document {
  userId: mongoose.Types.ObjectId | string;
  type: 'first_investment' | 'first_gram' | '10g_accumulated' | 'one_year_investor' | '1L_portfolio' | 'goal_achieved';
  achievedAt: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DigitalGoldMilestoneSchema = new Schema<IDigitalGoldMilestone>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['first_investment', 'first_gram', '10g_accumulated', 'one_year_investor', '1L_portfolio', 'goal_achieved'],
    required: true
  },
  achievedAt: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

// Ensure a user only gets a specific milestone type once (unless it's a repeatable one like goal_achieved, but for now we enforce uniqueness per type)
DigitalGoldMilestoneSchema.index({ userId: 1, type: 1 }, { unique: true });

export default mongoose.models.DigitalGoldMilestone || mongoose.model<IDigitalGoldMilestone>('DigitalGoldMilestone', DigitalGoldMilestoneSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingRule extends Document {
  goldRate24K: number;
  silverRate: number;
  platinumRate: number;
  gstPercentage: number;
  ringsOffset: number;       // grams per size increment (Rings size increment offset, e.g. 0.12)
  chainsOffset: number;      // grams per inch increment (Chains size increment offset, e.g. 0.25)
  braceletsOffset: number;   // grams per size offset (Bracelets size offset, e.g. 0.15)
  banglesOffset: number;     // grams per size offset (Bangles size offset, e.g. 0.15)
}

const PricingRuleSchema: Schema = new Schema({
  goldRate24K: { type: Number, required: true, default: 6500 },
  silverRate: { type: Number, required: true, default: 100 },
  platinumRate: { type: Number, required: true, default: 4000 },
  gstPercentage: { type: Number, required: true, default: 3 },
  ringsOffset: { type: Number, required: true, default: 0.12 },
  chainsOffset: { type: Number, required: true, default: 0.25 },
  braceletsOffset: { type: Number, required: true, default: 0.15 },
  banglesOffset: { type: Number, required: true, default: 0.15 },
}, { timestamps: true });

export default mongoose.models.PricingRule || mongoose.model<IPricingRule>('PricingRule', PricingRuleSchema);

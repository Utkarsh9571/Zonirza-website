import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  description?: string;
  config?: {
    variantVisibility?: Record<string, boolean>;
    pricingRules?: {
      diamondQualityAdjustments?: Record<string, number>;
      goldPurityAdjustments?: Record<string, number>;
      stoneQualityAdjustments?: Record<string, number>;
    };
    weightRules?: {
      baseSize?: number;
      sizeIncrementWeight?: number;
      baseLength?: number;
      lengthIncrementWeight?: number;
    };
    makingCharges?: {
      type: 'fixed' | 'percentage';
      value: number;
    };
  };
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String },
  config: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  images: string[];
  videoUrl?: string;
  description: string;
  basePrice: number;
  makingCharges: number;
  baseWeight: number;
  tags: string[];
  specs: Record<string, string>;
  variantImages?: Record<string, string>;
  configurableOptions?: {
    metals?: string[];
    purities?: string[];
    sizes?: string[];
    stones?: string[];
    customizations?: string[];
  };
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  images: { type: [String], required: true },
  variantImages: { type: Map, of: String, default: {} },
  videoUrl: { type: String },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  makingCharges: { type: Number, default: 0 },
  baseWeight: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  specs: { type: Map, of: String, default: {} },
  configurableOptions: {
    metals: [String],
    purities: [String],
    sizes: [String],
    stones: [String],
    customizations: [String]
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

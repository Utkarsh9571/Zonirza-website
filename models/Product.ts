import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string; // Category slug
  images: string[];
  videoUrl?: string;
  description: string;
  specs: Record<string, string>;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  images: { type: [String], required: true },
  videoUrl: { type: String },
  description: { type: String, required: true },
  specs: { type: Map, of: String, default: {} },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  image: string;
  heroImage?: string;
  description?: string;
  storytellingCopy?: string;
  tags: string[]; // Products with any of these tags will belong to this collection
  priority: number; // For merchandising sorting
  isActive: boolean;
}

const CollectionSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  heroImage: { type: String },
  description: { type: String },
  storytellingCopy: { type: String },
  tags: { type: [String], default: [] },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

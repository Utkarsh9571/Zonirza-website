import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  image: string;
  description?: string;
  tags: string[]; // Products with any of these tags will belong to this collection
  isActive: boolean;
}

const CollectionSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String },
  tags: { type: [String], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

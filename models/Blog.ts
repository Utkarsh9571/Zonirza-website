import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  author: string;
  isFeatured: boolean;
  isPublished: boolean;
  coverImage: string;
  heroImage: string;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  category: { type: String, default: '' },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  author: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  coverImage: { type: String, default: '' },
  heroImage: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

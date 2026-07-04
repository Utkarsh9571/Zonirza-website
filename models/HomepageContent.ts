import mongoose, { Schema, Document } from 'mongoose';
import './Product';
import './Collection';

export interface IHomepageContent extends Document {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
  };
  featuredProducts: mongoose.Types.ObjectId[];
  featuredCollections: mongoose.Types.ObjectId[];
  trendingCollections: {
    title: string;
    imageUrl: string;
    link: string;
  }[];
  promoBanners: {
    imageUrl: string;
    link: string;
    title: string;
    subtitle?: string;
  }[];
  updatedAt: Date;
}

const HomepageContentSchema: Schema = new Schema({
  hero: {
    title: { type: String, default: 'Our Luxury Collections' },
    subtitle: { type: String, default: 'Discover the artistry of fine jewellery.' },
    buttonText: { type: String, default: "Let's Get Started" },
    buttonLink: { type: String, default: '/products' },
    imageUrl: { type: String, default: '/images/hero-bg.avif' }
  },
  featuredProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  featuredCollections: [{ type: Schema.Types.ObjectId, ref: 'Collection' }],
  trendingCollections: [{
    title: { type: String },
    imageUrl: { type: String },
    link: { type: String }
  }],
  promoBanners: [{
    imageUrl: { type: String },
    link: { type: String },
    title: { type: String },
    subtitle: { type: String }
  }]
}, { timestamps: true });

export default mongoose.models.HomepageContent || mongoose.model<IHomepageContent>('HomepageContent', HomepageContentSchema);

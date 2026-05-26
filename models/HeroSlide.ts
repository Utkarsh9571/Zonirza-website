import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide extends Document {
  title: string;
  subtitle: string;
  videoDesktop: string;
  videoMobile: string;
  posterImage: string;
  primaryCTA: {
    label: string;
    link: string;
  };
  secondaryCTA?: {
    label: string;
    link: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema: Schema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  videoDesktop: { type: String, required: true },
  videoMobile: { type: String, required: true },
  posterImage: { type: String, required: true },
  primaryCTA: {
    label: { type: String, required: true, default: 'Explore Collections' },
    link: { type: String, required: true, default: '/products' }
  },
  secondaryCTA: {
    label: { type: String },
    link: { type: String }
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);

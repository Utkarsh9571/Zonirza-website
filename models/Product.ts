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
  stockStatus: 'in-stock' | 'out-of-stock';
  isActive: boolean;
  baseWeight: number;
  tags: string[];
  specs: Record<string, string>;
  variantImages?: Record<string, string>;
  productVideos?: string[];
  enableCardVideoPreview?: boolean;
  cardPreviewVideo?: string;
  cardPreviewThumbnail?: string;
  configurableOptions?: {
    metals?: string[];
    purities?: string[];
    sizes?: string[];
    stones?: string[];
    customizations?: string[];
  };
  pricingOverrides?: {
    stonePrices?: Record<string, number>;
    makingCharges?: number;
    sizeWeightOffset?: number;
  };
  hasDiamond: boolean;
  hasStone: boolean;
  stoneType?: string;
  goldPurityOptions: string[];
  jewelryType: 'diamond' | 'stone' | 'gold';
  defaultColor?: string;
  defaultMetal?: string;
  defaultSize?: string;
  legacyConfigurableOptions?: any;
  legacySpecs?: any;
  readyToShipVariants?: string[];
  categoryOverrides?: {
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
  categoryConfig?: any; // Hydrated by API
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
  stockStatus: { type: String, enum: ['in-stock', 'out-of-stock'], default: 'in-stock' },
  isActive: { type: Boolean, default: true },
  tags: { type: [String], default: [] },
  specs: { type: Map, of: String, default: {} },
  productVideos: { type: [String], default: [] },
  enableCardVideoPreview: { type: Boolean, default: false },
  cardPreviewVideo: { type: String },
  cardPreviewThumbnail: { type: String },
  hasDiamond: { type: Boolean, default: false },
  hasStone: { type: Boolean, default: false },
  stoneType: { type: String },
  goldPurityOptions: { type: [String], default: [] },
  jewelryType: { type: String, enum: ['diamond', 'stone', 'gold'], default: 'gold' },
  defaultColor: { type: String, default: 'Yellow Gold' },
  defaultMetal: { type: String, default: 'yellow-gold' },
  defaultSize: { type: String },
  legacyConfigurableOptions: { type: Schema.Types.Mixed },
  legacySpecs: { type: Schema.Types.Mixed },
  readyToShipVariants: { type: [String], default: [] },
  configurableOptions: {
    metals: [String],
    purities: [String],
    sizes: [String],
    stones: [String],
    customizations: [String]
  },
  pricingOverrides: {
    stonePrices: { type: Map, of: Number },
    makingCharges: { type: Number },
    sizeWeightOffset: { type: Number }
  },
  categoryOverrides: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Explicit Indexes for Performance
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ 'specs.metal': 1 });
ProductSchema.index({ 'specs.stone': 1 });
ProductSchema.index({ name: 'text', description: 'text' }); // Allow robust text search fallback

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

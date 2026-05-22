import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteRequest extends Document {
  user?: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  product: mongoose.Types.ObjectId;
  configuration: {
    metal: string;
    purity: string;
    size?: string;
    stone?: string;
  };
  customizationNotes: string;
  inspirationImages: string[];
  status: 'Pending Review' | 'In Consultation' | 'Quoted' | 'Approved' | 'Rejected' | 'Converted To Order';
  adminNotes?: string;
  quotedPrice?: number;
  quotedMakingCharges?: number;
  complexity?: 'Low Complexity' | 'Medium Complexity' | 'High Complexity' | 'Extreme Bespoke';
  estimation?: {
    estimatedPriceMin: number;
    estimatedPriceMax: number;
    estimatedGoldWeight: number;
    estimatedSurcharges: number;
  };
  productionInsights?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  configuration: {
    metal: { type: String, required: true },
    purity: { type: String, required: true },
    size: { type: String },
    stone: { type: String },
  },
  customizationNotes: { type: String, required: true },
  inspirationImages: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ['Pending Review', 'In Consultation', 'Quoted', 'Approved', 'Rejected', 'Converted To Order'],
    default: 'Pending Review'
  },
  adminNotes: { type: String },
  quotedPrice: { type: Number },
  quotedMakingCharges: { type: Number },
  complexity: { 
    type: String, 
    enum: ['Low Complexity', 'Medium Complexity', 'High Complexity', 'Extreme Bespoke'] 
  },
  estimation: {
    estimatedPriceMin: { type: Number },
    estimatedPriceMax: { type: Number },
    estimatedGoldWeight: { type: Number },
    estimatedSurcharges: { type: Number },
  },
  productionInsights: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);

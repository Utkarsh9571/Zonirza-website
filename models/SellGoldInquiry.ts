import mongoose, { Schema, Document } from 'mongoose';

export interface ISellGoldInquiry extends Document {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  jewelleryType?: string;
  approximateWeight?: number;
  purity?: string;
  knowsPurity: boolean;
  preferredVisitDate?: Date;
  preferredContactMethod: 'call' | 'whatsapp' | 'email';
  notes?: string;
  imageUrls?: string[];
  status: 'new' | 'contacted' | 'scheduled' | 'visited' | 'completed' | 'closed';
  branch: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SellGoldInquirySchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    city: { type: String, required: true },
    jewelleryType: { type: String },
    approximateWeight: { type: Number },
    purity: { type: String },
    knowsPurity: { type: Boolean, default: false },
    preferredVisitDate: { type: Date },
    preferredContactMethod: { 
      type: String, 
      enum: ['call', 'whatsapp', 'email'],
      default: 'call'
    },
    notes: { type: String },
    imageUrls: [{ type: String }],
    status: {
      type: String,
      enum: ['new', 'contacted', 'scheduled', 'visited', 'completed', 'closed'],
      default: 'new',
    },
    branch: { type: String, default: 'Flagship' },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SellGoldInquiry ||
  mongoose.model<ISellGoldInquiry>('SellGoldInquiry', SellGoldInquirySchema);

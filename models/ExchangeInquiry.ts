import mongoose, { Schema, Document } from 'mongoose';

export interface IExchangeInquiry extends Document {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  jewelleryType?: string;
  approximateWeight?: number;
  purity?: string;
  estimatedAge?: string;
  preferredVisitDate?: Date;
  consultationType: 'in-person' | 'video' | 'phone';
  notes?: string;
  estimatedValue?: number;
  status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'closed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeInquirySchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    jewelleryType: { type: String },
    approximateWeight: { type: Number },
    purity: { type: String },
    estimatedAge: { type: String },
    preferredVisitDate: { type: Date },
    consultationType: { 
      type: String, 
      enum: ['in-person', 'video', 'phone'],
      default: 'in-person'
    },
    notes: { type: String },
    estimatedValue: { type: Number },
    status: {
      type: String,
      enum: ['new', 'contacted', 'scheduled', 'converted', 'closed'],
      default: 'new',
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ExchangeInquiry ||
  mongoose.model<IExchangeInquiry>('ExchangeInquiry', ExchangeInquirySchema);

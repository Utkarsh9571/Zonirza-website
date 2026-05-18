import mongoose, { Schema, Document } from 'mongoose';

export interface IFranchiseLead extends Document {
  name: string;
  email: string;
  phone: string;
  city: string;
  businessBackground: string;
  investmentRange: string;
  experience: string;
  message: string;
  status: 'pending' | 'contacted' | 'rejected';
  adminNotes?: string;
}

const FranchiseLeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  businessBackground: { type: String, required: false },
  investmentRange: { type: String, required: false },
  experience: { type: String, required: false },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'contacted', 'rejected'], default: 'pending' },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.FranchiseLead || mongoose.model<IFranchiseLead>('FranchiseLead', FranchiseLeadSchema);

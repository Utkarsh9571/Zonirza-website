import mongoose, { Schema, Document } from 'mongoose';

export interface IFranchiseLead extends Document {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}

const FranchiseLeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.FranchiseLead || mongoose.model<IFranchiseLead>('FranchiseLead', FranchiseLeadSchema);

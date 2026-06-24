import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  mobile: string;
  email: string;
  message: string;
  appointmentDate?: string;
  appointmentSlot?: string;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  appointmentDate: { type: String, required: false },
  appointmentSlot: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

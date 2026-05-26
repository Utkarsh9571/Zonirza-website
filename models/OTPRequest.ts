import mongoose, { Schema, Document } from 'mongoose';

export interface IOTPRequest extends Document {
  mobileNumber: string;
  attempts: number;
  lastRequestedAt: Date;
  expiresAt: Date;
}

const OTPRequestSchema = new Schema<IOTPRequest>({
  mobileNumber: { type: String, required: true, unique: true },
  attempts: { type: Number, default: 1 },
  lastRequestedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// TTL index to automatically delete expired documents
OTPRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTPRequest || mongoose.model<IOTPRequest>('OTPRequest', OTPRequestSchema);

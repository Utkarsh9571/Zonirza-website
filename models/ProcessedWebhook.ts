import mongoose, { Schema, Document } from 'mongoose';

export interface IProcessedWebhook extends Document {
  eventId: string; // Razorpay event.id
  event: string; // e.g., 'payment.captured'
  status: 'processed' | 'failed' | 'ignored';
  processedAt: Date;
}

const ProcessedWebhookSchema = new Schema<IProcessedWebhook>({
  eventId: { type: String, required: true, unique: true, index: true },
  event: { type: String, required: true },
  status: { type: String, enum: ['processed', 'failed', 'ignored'], required: true },
  processedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.ProcessedWebhook || mongoose.model<IProcessedWebhook>('ProcessedWebhook', ProcessedWebhookSchema);

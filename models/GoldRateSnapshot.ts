import mongoose, { Schema, Document } from 'mongoose';

export interface IGoldRateSnapshot extends Document {
  buyRate24K: number;
  sellRate24K: number;
  spread: number;
  gst: number;
  active: boolean;
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const GoldRateSnapshotSchema = new Schema<IGoldRateSnapshot>({
  buyRate24K: { type: Number, required: true },
  sellRate24K: { type: Number, required: true },
  spread: { type: Number, default: 0 },
  gst: { type: Number, default: 3 },
  active: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.GoldRateSnapshot || mongoose.model<IGoldRateSnapshot>('GoldRateSnapshot', GoldRateSnapshotSchema);

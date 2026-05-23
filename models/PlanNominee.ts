import mongoose, { Schema, Document } from 'mongoose';

export interface IPlanNominee extends Document {
  enrollmentId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  fullName: string;
  relationship: string;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlanNomineeSchema = new Schema<IPlanNominee>({
  enrollmentId: { type: Schema.Types.ObjectId, ref: 'PlanEnrollment', required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  relationship: { type: String, required: true },
  nationality: { type: String, required: true, default: 'Indian' },
}, { timestamps: true });

export default mongoose.models.PlanNominee || mongoose.model<IPlanNominee>('PlanNominee', PlanNomineeSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancialAuditLog extends Document {
  actor: string; // e.g., 'SYSTEM', 'USER_ID', 'ADMIN_ID'
  action: string; // e.g., 'WALLET_ADJUSTMENT', 'WEBHOOK_PROCESSED', 'RECONCILIATION_RUN'
  entityType: string; // e.g., 'DigitalGoldWallet', 'DigitalGoldTransaction', 'System'
  entityId?: string;
  beforeValue?: any;
  afterValue?: any;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const FinancialAuditLogSchema = new Schema<IFinancialAuditLog>({
  actor: { type: String, required: true },
  action: { type: String, required: true, index: true },
  entityType: { type: String, required: true },
  entityId: { type: String },
  beforeValue: { type: Schema.Types.Mixed },
  afterValue: { type: Schema.Types.Mixed },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.models.FinancialAuditLog || mongoose.model<IFinancialAuditLog>('FinancialAuditLog', FinancialAuditLogSchema);

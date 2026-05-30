import mongoose, { Schema, Document } from 'mongoose';

export interface IGiftCardTransaction extends Document {
  giftCardId: mongoose.Types.ObjectId;
  type: 'issued' | 'redeemed' | 'refunded' | 'adjusted';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  relatedOrderId?: mongoose.Types.ObjectId;
  actorUserId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const GiftCardTransactionSchema = new Schema<IGiftCardTransaction>(
  {
    giftCardId: {
      type: Schema.Types.ObjectId,
      ref: 'GiftCard',
      required: true,
    },
    type: {
      type: String,
      enum: ['issued', 'redeemed', 'refunded', 'adjusted'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    relatedOrderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes
GiftCardTransactionSchema.index({ giftCardId: 1 });
GiftCardTransactionSchema.index({ relatedOrderId: 1 });

export default mongoose.models.GiftCardTransaction || mongoose.model<IGiftCardTransaction>('GiftCardTransaction', GiftCardTransactionSchema);

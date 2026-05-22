import mongoose, { Schema, Document } from 'mongoose';

export interface ISearchAnalytics extends Document {
  query: string;
  count: number; // number of times this was searched
  lastSearchedAt: Date;
  resultsFound: number; // how many products were found the last time
  isZeroResult: boolean;
}

const SearchAnalyticsSchema: Schema = new Schema({
  query: { type: String, required: true, lowercase: true, index: true },
  count: { type: Number, default: 1 },
  lastSearchedAt: { type: Date, default: Date.now },
  resultsFound: { type: Number, default: 0 },
  isZeroResult: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.SearchAnalytics || mongoose.model<ISearchAnalytics>('SearchAnalytics', SearchAnalyticsSchema);

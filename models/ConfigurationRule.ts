import mongoose, { Schema, Document } from 'mongoose';

export interface IConfigurationRule extends Document {
  name: string;
  type: 'restriction' | 'consultation' | 'surcharge';
  isActive: boolean;
  
  scope: {
    categories: string[]; // If empty, applies to all categories unless productIds is set
    productIds: string[]; // If empty, applies to all products unless categories is set
  };
  
  trigger: {
    metals: string[]; // Triggers if the selected metal matches any in this array
    purities: string[]; // Triggers if the selected purity matches any in this array
    stones: string[]; // Triggers if the selected stone matches any in this array
    sizes: string[]; // Triggers if the selected size matches any in this array
  };
  
  result: {
    message?: string; // e.g., "22K Gold is too soft for secure diamond setting."
    surcharge?: number;
    surchargeType?: 'fixed' | 'percentage';
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ConfigurationRuleSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['restriction', 'consultation', 'surcharge'], required: true },
    isActive: { type: Boolean, default: true },
    
    scope: {
      categories: { type: [String], default: [] },
      productIds: { type: [String], default: [] },
    },
    
    trigger: {
      metals: { type: [String], default: [] },
      purities: { type: [String], default: [] },
      stones: { type: [String], default: [] },
      sizes: { type: [String], default: [] },
    },
    
    result: {
      message: { type: String },
      surcharge: { type: Number },
      surchargeType: { type: String, enum: ['fixed', 'percentage'] },
    },
  },
  { timestamps: true }
);

export default mongoose.models.ConfigurationRule || mongoose.model<IConfigurationRule>('ConfigurationRule', ConfigurationRuleSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  pricingFactors: {
    gstPercentage: number;
    shippingBaseCharge: number;
    freeShippingThreshold: number;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'Zoniraz Jewelers' },
  supportEmail: { type: String, default: 'support@zoniraz.com' },
  supportPhone: { type: String, default: '+91 99999 99999' },
  maintenanceMode: { type: Boolean, default: false },
  pricingFactors: {
    gstPercentage: { type: Number, default: 3 },
    shippingBaseCharge: { type: Number, default: 0 },
    freeShippingThreshold: { type: Number, default: 5000 }
  },
  socialLinks: {
    instagram: { type: String },
    facebook: { type: String },
    whatsapp: { type: String }
  }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

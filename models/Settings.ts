import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  businessHours: string;
  footerText: string;
  maintenanceMode: boolean;
  pricingFactors: {
    gstPercentage: number;
    shippingBaseCharge: number;
    freeShippingThreshold: number;
    metalRates?: {
      gold24k: number;
      silver: number;
      platinum: number;
    };
    stonePrices?: Record<string, number>;
    purityMultipliers?: Record<string, number>;
    sizeWeightOffset?: number;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  contactPage: {
    title: string;
    description: string;
    mapUrl?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    keywords: string[];
  };
  announcement: {
    text: string;
    link?: string;
    isActive: boolean;
  };
}

const SettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'Zoniraz Jewelers' },
  supportEmail: { type: String, default: 'support@zoniraz.com' },
  supportPhone: { type: String, default: '+91 99999 99999' },
  address: { type: String, default: '123 Luxury Lane, Jewelry District' },
  businessHours: { type: String, default: 'Mon-Sat: 10AM - 8PM, Sun: Closed' },
  footerText: { type: String, default: 'Crafting brilliance for generations.' },
  maintenanceMode: { type: Boolean, default: false },
  pricingFactors: {
    gstPercentage: { type: Number, default: 3 },
    shippingBaseCharge: { type: Number, default: 0 },
    freeShippingThreshold: { type: Number, default: 5000 },
    metalRates: {
      gold24k: { type: Number, default: 6500 },
      silver: { type: Number, default: 100 },
      platinum: { type: Number, default: 4000 }
    },
    stonePrices: { type: Map, of: Number, default: {
      'VVS1': 50000,
      'VVS2': 40000,
      'VS1': 30000,
      'VS2': 25000,
      'SI1': 20000,
      'Diamond-Standard': 15000,
      'None': 0
    }},
    purityMultipliers: { type: Map, of: Number, default: {
      '24K': 1.0,
      '22K': 0.916,
      '18K': 0.750,
      '14K': 0.585,
      '9K': 0.375
    }},
    sizeWeightOffset: { type: Number, default: 0.15 }
  },
  socialLinks: {
    instagram: { type: String },
    facebook: { type: String },
    whatsapp: { type: String }
  },
  contactPage: {
    title: { type: String, default: 'Get in Touch' },
    description: { type: String, default: 'Visit our boutique or talk to an expert.' },
    mapUrl: { type: String }
  },
  seo: {
    defaultTitle: { type: String, default: 'Zoniraz - Premium Jewelry' },
    defaultDescription: { type: String, default: 'Discover the artistry of fine jewellery.' },
    keywords: { type: [String], default: ['jewelry', 'luxury', 'diamonds'] }
  },
  announcement: {
    text: { type: String, default: '' },
    link: { type: String, default: '' },
    isActive: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

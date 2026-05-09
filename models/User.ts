import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
  type: 'Home' | 'Office' | 'Other';
}

export interface IUser extends Document {
  name?: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  addresses: IUserAddress[];
  cart: any[];
  wishlist: string[];
  orderHistory: any[];
  recentlyViewed: string[];
  preferences: {
    preferredMetal?: string;
    preferredCategory?: string;
    ringSize?: string;
  };
  onboardingCompleted: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IUserAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' }
});

const UserSchema = new Schema<IUser>({
  name: { type: String },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  phone: { type: String },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'] 
  },
  addresses: [AddressSchema],
  cart: {
    type: [Object],
    default: []
  },
  wishlist: [{ type: String }],
  orderHistory: {
    type: [Object],
    default: []
  },
  recentlyViewed: [{ type: String }],
  preferences: {
    preferredMetal: { type: String },
    preferredCategory: { type: String },
    ringSize: { type: String }
  },
  onboardingCompleted: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

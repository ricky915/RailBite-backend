import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import { RestaurantStatus } from '@/types/domain.types';

export interface IWorkingHours {
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  openTime: string; // HH:MM
  closeTime: string; // HH:MM
  isClosed: boolean;
}

export interface IBankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

/**
 * `restaurants` collection (TRD 12.1). Working hours, bank details, and
 * address are embedded per the documented embedding strategy.
 */
export interface IRestaurant extends Document {
  name: string;
  ownerUserId: Types.ObjectId;
  fssaiLicenseNumber: string;
  fssaiExpiryDate: Date;
  gstin: string;
  bankDetails: IBankDetails;
  address: IAddress;
  stationCodes: string[];
  cuisineTypes: string[];
  isVegOnly: boolean;
  minOrderValuePaise: number;
  deliveryFeePaise: number;
  isCodEnabled: boolean;
  workingHours: IWorkingHours[];
  status: RestaurantStatus;
  isActive: boolean;
  isDeleted: boolean;
  averageRating: number;
  ratingCount: number;
  cancellationRate: number;
  logoUrl?: string;
  bannerUrl?: string;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const workingHoursSchema = new Schema<IWorkingHours>(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false },
);

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, trim: true },
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fssaiLicenseNumber: { type: String, required: true, match: /^\d{14}$/ },
    fssaiExpiryDate: { type: Date, required: true },
    gstin: { type: String, required: true, match: /^[0-9A-Z]{15}$/ },
    bankDetails: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true, match: /^[A-Z]{4}0[A-Z0-9]{6}$/ },
    },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    stationCodes: { type: [String], default: [], index: true },
    cuisineTypes: { type: [String], default: [] },
    isVegOnly: { type: Boolean, default: false },
    minOrderValuePaise: { type: Number, default: 0, min: 0 },
    deliveryFeePaise: { type: Number, default: 0, min: 0 },
    isCodEnabled: { type: Boolean, default: false },
    workingHours: { type: [workingHoursSchema], default: [] },
    status: {
      type: String,
      enum: Object.values(RestaurantStatus),
      default: RestaurantStatus.PENDING_APPROVAL,
    },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    cancellationRate: { type: Number, default: 0 },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

restaurantSchema.index({ status: 1, isActive: 1 });

export const RestaurantModel = model<IRestaurant>('Restaurant', restaurantSchema);

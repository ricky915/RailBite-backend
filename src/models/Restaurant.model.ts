import type { Types } from 'mongoose';
import { Schema, model } from 'mongoose';

import { RestaurantStatus } from '@/types/domain.types';

export interface RestaurantDocument {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  cuisineTypes: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  ownerUserId: Types.ObjectId;
  stationCodes: string[];
  address: string;
  contactPhone: string;
  contactEmail: string;
  status: RestaurantStatus;
  isActive: boolean;
  avgPrepTimeMinutes: number;
  avgRating: number;
  ratingCount: number;
  minOrderValuePaise: number;
  codEligible: boolean;
  commissionPercent: number;
  approvedAt?: Date;
  approvedBy?: Types.ObjectId;
  rejectionReason?: string;
  isDeleted: boolean;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<RestaurantDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, maxlength: 2000 },
    cuisineTypes: { type: [String], default: [] },
    logoUrl: { type: String },
    coverImageUrl: { type: String },
    ownerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stationCodes: { type: [String], default: [], index: true },
    address: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true },
    status: { type: String, enum: Object.values(RestaurantStatus), default: RestaurantStatus.PENDING_APPROVAL },
    isActive: { type: Boolean, default: true },
    avgPrepTimeMinutes: { type: Number, default: 30 },
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    minOrderValuePaise: { type: Number, default: 10000 },
    codEligible: { type: Boolean, default: false },
    commissionPercent: { type: Number, default: 15 },
    approvedAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String },
    isDeleted: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

restaurantSchema.index({ status: 1, isActive: 1 });

export const Restaurant = model<RestaurantDocument>('Restaurant', restaurantSchema);

import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';

import { UserRole } from '@/types/domain.types';

export interface IUserPreferences {
  dietaryTags: string[];
  cuisinePrefs: string[];
}

export interface IUserNotificationSettings {
  emailMarketing: boolean;
  smsMarketing: boolean;
  inApp: boolean;
}

/**
 * `users` collection (TRD 12.2.1). Covers passenger and admin-side
 * accounts; preferences and notification settings are embedded.
 */
export interface IUser extends Document {
  name: string;
  mobile: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  restaurantId?: Types.ObjectId;
  preferences: IUserPreferences;
  notificationSettings: IUserNotificationSettings;
  profilePhotoUrl?: string;
  lastLoginAt?: Date;
  failedLoginCount: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 50, trim: true },
    mobile: { type: String, required: true, unique: true, match: /^[6-9]\d{9}$/ },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PASSENGER,
      required: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    preferences: {
      dietaryTags: { type: [String], default: [] },
      cuisinePrefs: { type: [String], default: [] },
    },
    notificationSettings: {
      emailMarketing: { type: Boolean, default: false },
      smsMarketing: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true },
    },
    profilePhotoUrl: { type: String },
    lastLoginAt: { type: Date },
    failedLoginCount: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ role: 1, isActive: 1 });

export const UserModel = model<IUser>('User', userSchema);

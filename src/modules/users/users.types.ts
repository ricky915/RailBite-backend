import type { UserRole } from '@/types/domain.types';

export interface UserProfileView {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  preferences: {
    dietaryTags: string[];
    cuisinePrefs: string[];
  };
  notificationSettings: {
    emailMarketing: boolean;
    smsMarketing: boolean;
    inApp: boolean;
  };
  profilePhotoUrl?: string;
  createdAt: Date;
}

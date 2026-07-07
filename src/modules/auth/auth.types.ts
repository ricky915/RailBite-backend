import type { UserRole } from '@/types/domain.types';

export interface AuthenticatedUserView {
  id: string;
  name: string;
  mobile: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult extends TokenPair {
  user: AuthenticatedUserView;
}

export interface RegisterResult {
  userId: string;
  otpSentTo: {
    mobile: string;
    email: string;
  };
}

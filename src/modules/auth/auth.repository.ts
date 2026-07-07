import type { IUser } from '@/models/User.model';
import { UserModel } from '@/models/User.model';
import type { IRefreshToken } from '@/models/RefreshToken.model';
import { RefreshTokenModel } from '@/models/RefreshToken.model';
import type { IOtp, OtpPurpose } from '@/models/Otp.model';
import { OtpModel } from '@/models/Otp.model';

/**
 * Data access layer for the auth module (TRD 3.2.4, 5.3). Only this
 * layer touches Mongoose models directly; auth.service.ts consumes these
 * typed methods.
 */
export class AuthRepository {
  findUserByMobile(mobile: string): Promise<IUser | null> {
    return UserModel.findOne({ mobile, isDeleted: false });
  }

  findUserByEmail(emailAddress: string): Promise<IUser | null> {
    return UserModel.findOne({ email: emailAddress, isDeleted: false });
  }

  findUserByIdentifier(identifier: string): Promise<IUser | null> {
    const isMobile = /^[6-9]\d{9}$/.test(identifier);
    return isMobile
      ? this.findUserByMobile(identifier)
      : this.findUserByEmail(identifier.toLowerCase());
  }

  findUserById(id: string): Promise<IUser | null> {
    return UserModel.findOne({ _id: id, isDeleted: false });
  }

  createUser(data: Partial<IUser>): Promise<IUser> {
    return UserModel.create(data);
  }

  async createOtp(data: {
    userId?: string;
    identifier: string;
    otpHash: string;
    purpose: OtpPurpose;
    expiresAt: Date;
  }): Promise<IOtp> {
    return OtpModel.create(data);
  }

  findLatestOtp(identifier: string, purpose: OtpPurpose): Promise<IOtp | null> {
    return OtpModel.findOne({ identifier, purpose, isVerified: false }).sort({ createdAt: -1 });
  }

  saveOtp(otp: IOtp): Promise<IOtp> {
    return otp.save();
  }

  countRecentOtps(identifier: string, purpose: OtpPurpose, since: Date): Promise<number> {
    return OtpModel.countDocuments({ identifier, purpose, createdAt: { $gte: since } });
  }

  createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    tokenVersion: number;
    expiresAt: Date;
    createdByIp?: string;
  }): Promise<IRefreshToken> {
    return RefreshTokenModel.create(data);
  }

  findRefreshTokensByUser(userId: string): Promise<IRefreshToken[]> {
    return RefreshTokenModel.find({ userId });
  }

  findRefreshTokenById(id: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findById(id);
  }

  saveRefreshToken(token: IRefreshToken): Promise<IRefreshToken> {
    return token.save();
  }

  deleteRefreshTokenById(id: string): Promise<unknown> {
    return RefreshTokenModel.deleteOne({ _id: id });
  }

  deleteAllRefreshTokensForUser(userId: string): Promise<unknown> {
    return RefreshTokenModel.deleteMany({ userId });
  }

  saveUser(user: IUser): Promise<IUser> {
    return user.save();
  }
}

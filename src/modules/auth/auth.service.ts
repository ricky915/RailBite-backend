import {
  ACCOUNT_LOCK_DURATION_MINUTES,
  MAX_LOGIN_ATTEMPTS,
  OTP_MAX_RESEND_ATTEMPTS,
  OTP_MAX_VERIFY_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_MINUTES,
  REFRESH_TOKEN_TTL_MS,
  RESET_TOKEN_TTL_MINUTES,
} from '@/config/constants';
import type { AuthRepository } from '@/modules/auth/auth.repository';
import type {
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
  RefreshTokenDto,
  VerifyOtpDto,
} from '@/modules/auth/auth.dto';
import type { AuthenticatedUserView, LoginResult, RegisterResult, TokenPair } from '@/modules/auth/auth.types';
import type { IUser } from '@/models/User.model';
import { dispatchNotificationAsync } from '@/services/notification.service';
import { AuditAction, NotificationChannel, UserRole } from '@/types/domain.types';
import { writeAuditLog } from '@/utils/auditLog';
import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  ValidationError,
} from '@/utils/errors';
import { comparePassword, compareToken, hashPassword, hashToken } from '@/utils/hash';
import {
  signAccessToken,
  signRefreshToken,
  signResetToken,
  verifyRefreshToken,
  verifyResetToken,
} from '@/utils/jwt';
import { generateOtp } from '@/utils/orderIdGenerator';

export interface RequestContext {
  ipAddress: string;
  userAgent: string;
  requestId: string;
}

function toUserView(user: IUser): AuthenticatedUserView {
  return {
    id: user.id as string,
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isMobileVerified: user.isMobileVerified,
  };
}

function otpExpiry(): Date {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

/**
 * Auth business logic (TRD 10.3, 13.1-13.5). This is the reference
 * implementation module — every rule below traces to a specific TRD/PRD
 * clause cited in the comments.
 */
export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  /**
   * Registers a new passenger and dispatches a registration OTP.
   * Registration is only finalized once the OTP is verified via
   * `verifyOtp` (PRD 11.1 acceptance criteria).
   *
   * @throws {ConflictError} if the mobile or email is already registered.
   */
  async register(dto: RegisterDto): Promise<RegisterResult> {
    const [existingByMobile, existingByEmail] = await Promise.all([
      this.repository.findUserByMobile(dto.mobile),
      this.repository.findUserByEmail(dto.email),
    ]);

    if (existingByMobile || existingByEmail) {
      throw new ConflictError('An account with this mobile number or email already exists.');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.repository.createUser({
      name: dto.name,
      mobile: dto.mobile,
      email: dto.email,
      passwordHash,
      role: UserRole.PASSENGER,
      isMobileVerified: false,
      isEmailVerified: false,
      isActive: false,
    });

    await this.issueAndSendOtp(user.mobile, 'registration', user.id as string);

    return {
      userId: user.id as string,
      otpSentTo: { mobile: user.mobile, email: user.email },
    };
  }

  /**
   * Verifies an OTP for registration, login, password reset, or mobile
   * change (PRD 11.1, TRD 13.4). Returns a short-lived reset token when
   * `purpose` is `password_reset`.
   */
  async verifyOtp(dto: VerifyOtpDto): Promise<{ verified: true; resetToken?: string }> {
    const otp = await this.repository.findLatestOtp(dto.identifier, dto.purpose);

    if (!otp) {
      throw new ValidationError('OTP not found or already used. Please request a new one.');
    }

    if (otp.expiresAt.getTime() < Date.now()) {
      throw new ValidationError('This OTP has expired. Please request a new one.');
    }

    if (otp.attemptCount >= OTP_MAX_VERIFY_ATTEMPTS) {
      throw new ValidationError('Too many incorrect attempts. Please request a new OTP.');
    }

    const matches = await compareToken(dto.otp, otp.otpHash);
    if (!matches) {
      otp.attemptCount += 1;
      await this.repository.saveOtp(otp);
      throw new ValidationError('Incorrect OTP. Please try again.');
    }

    otp.isVerified = true;
    await this.repository.saveOtp(otp);

    if (dto.purpose === 'registration') {
      const user = await this.repository.findUserByIdentifier(dto.identifier);
      if (!user) {
        throw new ValidationError('Account not found for this identifier.');
      }
      user.isMobileVerified = true;
      user.isActive = true;
      await this.repository.saveUser(user);
      return { verified: true };
    }

    if (dto.purpose === 'password_reset') {
      const user = await this.repository.findUserByIdentifier(dto.identifier);
      if (!user) {
        throw new ValidationError('Account not found for this identifier.');
      }
      const resetToken = signResetToken({ userId: user.id as string, purpose: 'password_reset' });
      return { verified: true, resetToken };
    }

    return { verified: true };
  }

  /**
   * Resends an OTP, enforcing the 60-second cooldown and 3-resend cap
   * (PRD 11.1 edge cases).
   */
  async resendOtp(dto: ResendOtpDto): Promise<{ otpSentTo: string }> {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await this.repository.countRecentOtps(dto.identifier, dto.purpose, since24h);

    if (recentCount >= OTP_MAX_RESEND_ATTEMPTS) {
      throw new ConflictError('Maximum OTP resend attempts reached. Please try again later.');
    }

    const latest = await this.repository.findLatestOtp(dto.identifier, dto.purpose);
    if (latest) {
      const secondsSinceLastSend = (Date.now() - latest.createdAt.getTime()) / 1000;
      if (secondsSinceLastSend < OTP_RESEND_COOLDOWN_SECONDS) {
        throw new ValidationError('Please wait before requesting another OTP.');
      }
    }

    const user = await this.repository.findUserByIdentifier(dto.identifier);
    await this.issueAndSendOtp(dto.identifier, dto.purpose, user?.id as string | undefined);

    return { otpSentTo: dto.identifier };
  }

  /**
   * Authenticates a user by mobile/email + password (TRD 13.1, 13.5).
   * Applies the 5-failed-attempt / 30-minute lockout policy.
   */
  async login(dto: LoginDto, context: RequestContext): Promise<LoginResult> {
    const user = await this.repository.findUserByIdentifier(dto.identifier);

    if (!user) {
      throw new AuthenticationError('Invalid mobile number/email or password.');
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      const unlockTime = user.lockedUntil.toISOString();
      throw new AuthorizationError(
        `Account temporarily locked due to too many failed login attempts. Try again after ${unlockTime}.`,
      );
    }

    const passwordMatches = await comparePassword(dto.password, user.passwordHash);

    if (!passwordMatches) {
      user.failedLoginCount += 1;
      if (user.failedLoginCount >= MAX_LOGIN_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_DURATION_MINUTES * 60 * 1000);
        user.failedLoginCount = 0;
      }
      await this.repository.saveUser(user);
      throw new AuthenticationError('Invalid mobile number/email or password.');
    }

    if (!user.isActive) {
      throw new AuthorizationError('Please verify your account before logging in.');
    }

    user.failedLoginCount = 0;
    user.lockedUntil = undefined;
    user.lastLoginAt = new Date();
    await this.repository.saveUser(user);

    const tokens = await this.issueTokenPair(user, context.ipAddress);

    await writeAuditLog({
      actor: { userId: user.id as string, name: user.name, role: user.role },
      action: AuditAction.LOGIN,
      module: 'auth',
      resourceId: user.id as string,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      requestId: context.requestId,
    });

    return { ...tokens, user: toUserView(user) };
  }

  /**
   * Rotates a refresh token: verifies the incoming token, deletes it, and
   * issues a fresh access/refresh pair (TRD 13.2).
   */
  async refresh(dto: RefreshTokenDto, context: RequestContext): Promise<TokenPair> {
    let payload;
    try {
      payload = verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new AuthenticationError('Your session has expired. Please log in again.');
    }

    const tokenDoc = await this.repository.findRefreshTokenById(payload.tokenId);
    if (!tokenDoc || tokenDoc.expiresAt.getTime() < Date.now()) {
      throw new AuthenticationError('Your session has expired. Please log in again.');
    }

    const matches = await compareToken(dto.refreshToken, tokenDoc.tokenHash);
    if (!matches) {
      throw new AuthenticationError('Invalid refresh token.');
    }

    await this.repository.deleteRefreshTokenById(tokenDoc.id as string);

    const user = await this.repository.findUserById(payload.userId);
    if (!user) {
      throw new AuthenticationError('Account no longer exists.');
    }

    return this.issueTokenPair(user, context.ipAddress);
  }

  /**
   * Logs out the current session (single refresh token) or all devices
   * (TRD 13.5 "logout all devices").
   */
  async logout(dto: LogoutDto, userId: string, context: RequestContext): Promise<void> {
    if (dto.allDevices) {
      await this.repository.deleteAllRefreshTokensForUser(userId);
    } else if (dto.refreshToken) {
      try {
        const payload = verifyRefreshToken(dto.refreshToken);
        if (payload.userId === userId) {
          await this.repository.deleteRefreshTokenById(payload.tokenId);
        }
      } catch {
        // Idempotent: an already-invalid/expired refresh token is treated
        // as "already logged out" rather than surfaced as an error.
      }
    }

    await writeAuditLog({
      actor: { userId, name: '', role: '' },
      action: AuditAction.LOGOUT,
      module: 'auth',
      resourceId: userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      requestId: context.requestId,
    });
  }

  /**
   * Initiates the forgot-password flow. Always resolves successfully
   * (even for unknown identifiers) to avoid account enumeration.
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.repository.findUserByIdentifier(dto.identifier);

    if (user) {
      await this.issueAndSendOtp(dto.identifier, 'password_reset', user.id as string);
    }

    return {
      message:
        'If an account exists for this mobile number or email, a password reset OTP has been sent.',
    };
  }

  /**
   * Completes the password reset flow using the short-lived reset token
   * issued by `verifyOtp` (TRD 13.4). Invalidates all existing refresh
   * tokens for the account (TRD 13.5).
   */
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    let payload;
    try {
      payload = verifyResetToken(dto.resetToken);
    } catch {
      throw new AuthenticationError('This password reset link has expired. Please try again.');
    }

    if (payload.purpose !== 'password_reset') {
      throw new AuthenticationError('Invalid password reset token.');
    }

    const user = await this.repository.findUserById(payload.userId);
    if (!user) {
      throw new AuthenticationError('Account no longer exists.');
    }

    user.passwordHash = await hashPassword(dto.newPassword);
    user.failedLoginCount = 0;
    user.lockedUntil = undefined;
    await this.repository.saveUser(user);

    // TRD 13.5: password change invalidates all active refresh tokens.
    await this.repository.deleteAllRefreshTokensForUser(user.id as string);
  }

  private async issueAndSendOtp(
    identifier: string,
    purpose: VerifyOtpDto['purpose'],
    userId?: string,
  ): Promise<void> {
    const otp = generateOtp();
    const otpHash = await hashToken(otp);

    await this.repository.createOtp({
      userId,
      identifier,
      otpHash,
      purpose,
      expiresAt: otpExpiry(),
    });

    const isMobile = /^[6-9]\d{9}$/.test(identifier);
    const message = `Your RailBite verification code is ${otp}. It is valid for ${OTP_TTL_MINUTES} minutes. Do not share this code with anyone.`;

    // No SMS/email provider is configured in local dev (MSG91/SendGrid keys
    // are blank), so the OTP would otherwise be unrecoverable. Surface it on
    // the server console only outside production.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[DEV OTP] ${identifier} (${purpose}) => ${otp}`);
    }

    dispatchNotificationAsync({
      userId: userId ?? 'unknown',
      channel: isMobile ? NotificationChannel.SMS : NotificationChannel.EMAIL,
      templateKey: `otp_${purpose}`,
      recipient: identifier,
      subject: 'Your RailBite verification code',
      content: message,
      smsTemplateId: `otp_${purpose}`,
      smsVariables: { otp, ttl: String(OTP_TTL_MINUTES) },
    });
  }

  private async issueTokenPair(user: IUser, ipAddress: string): Promise<TokenPair> {
    const accessToken = signAccessToken({
      userId: user.id as string,
      role: user.role,
      restaurantId: user.restaurantId?.toString(),
    });

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    const tokenDoc = await this.repository.createRefreshToken({
      userId: user.id as string,
      tokenHash: 'pending',
      tokenVersion: 0,
      expiresAt,
      createdByIp: ipAddress,
    });

    const refreshToken = signRefreshToken({
      userId: user.id as string,
      tokenVersion: 0,
      tokenId: tokenDoc.id as string,
    });

    tokenDoc.tokenHash = await hashToken(refreshToken);
    await this.repository.saveRefreshToken(tokenDoc);

    return { accessToken, refreshToken };
  }
}

// Reset token TTL is documented on the constant for reference by other
// modules/tests; the JWT itself encodes its own expiry.
export const RESET_TOKEN_TTL_MINUTES_REF = RESET_TOKEN_TTL_MINUTES;

import { AUTH_LOCKOUT, OTP } from '@/config/constants';
import { config } from '@/config/index';
import { checkOtpVerification, startOtpVerification } from '@/services/twilio.service';
import type { UserRole } from '@/types/domain.types';
import { BadRequestError, ConflictError, ForbiddenError, UnauthorizedError } from '@/utils/errors';
import { comparePassword, hashPassword, sha256 } from '@/utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import { logger } from '@/utils/logger';
import { parseDurationMs } from '@/utils/time';

import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  SendOtpInput,
  VerifyOtpInput,
} from './auth.dto';
import { authRepository } from './auth.repository';
import type { AuthenticatedUserView, AuthTokens } from './auth.types';

function toUserView(user: { _id: unknown; name: string; email?: string; mobile: string; role: UserRole }): AuthenticatedUserView {
  return { id: String(user._id), name: user.name, email: user.email, mobile: user.mobile, role: user.role };
}

async function issueTokenPair(
  userId: string,
  role: UserRole,
  context: { ipAddress?: string; userAgent?: string },
): Promise<AuthTokens> {
  const expiresAt = new Date(Date.now() + parseDurationMs(config.jwt.refreshExpiry));
  const doc = await authRepository.createRefreshToken({
    userId,
    tokenHash: 'pending',
    expiresAt,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
  });

  const refreshToken = signRefreshToken({ sub: userId, tokenId: doc._id.toString() });
  doc.tokenHash = sha256(refreshToken);
  await doc.save();

  const accessToken = signAccessToken({ sub: userId, role });

  return { accessToken, refreshToken };
}

/** Every OTP purpose (register/forgot-password/change-mobile/sensitive-action) targets a mobile
 * number — Twilio Verify owns generation, storage, and expiry of the code entirely on its side. */
async function checkOtp(identifier: string, code: string): Promise<boolean> {
  if (config.otp.bypassCode) return code === config.otp.bypassCode;
  return checkOtpVerification(identifier, code);
}

export const authService = {
  async register(input: RegisterInput): Promise<{ userId: string }> {
    const existing = await authRepository.findByMobile(input.mobile);
    if (existing?.isMobileVerified) {
      throw new ConflictError('An account with this mobile number already exists');
    }

    const passwordHash = await hashPassword(input.password);
    let userId: string;
    if (existing) {
      // A previous registration attempt never completed OTP verification — update details and
      // resend rather than permanently blocking this mobile number behind a stuck account.
      existing.name = input.name;
      existing.passwordHash = passwordHash;
      await existing.save();
      userId = existing._id.toString();
    } else {
      const user = await authRepository.createUser({ name: input.name, mobile: input.mobile, passwordHash });
      userId = user._id.toString();
    }

    await this.sendOtp({ identifier: input.mobile, purpose: 'REGISTER' });

    return { userId };
  },

  async sendOtp(input: SendOtpInput): Promise<{ expiresInMinutes: number }> {
    if (config.otp.bypassCode) {
      logger.warn('OTP bypass active — Twilio dispatch skipped, fixed code in use', {
        identifier: input.identifier,
        purpose: input.purpose,
      });
      return { expiresInMinutes: OTP.VALIDITY_MINUTES };
    }

    await startOtpVerification(input.identifier);
    return { expiresInMinutes: OTP.VALIDITY_MINUTES };
  },

  async verifyOtp(
    input: VerifyOtpInput,
    context: { ipAddress?: string; userAgent?: string },
  ): Promise<{ verified: true; tokens?: AuthTokens; user?: AuthenticatedUserView }> {
    const approved = await checkOtp(input.identifier, input.code);
    if (!approved) throw new BadRequestError('Incorrect or expired OTP');

    if (input.purpose === 'REGISTER') {
      const user = await authRepository.findByIdentifier(input.identifier);
      if (!user) throw new BadRequestError('No pending registration found for this identifier');

      await authRepository.markVerified(user._id.toString(), 'isMobileVerified');
      await authRepository.resetFailedLoginTracking(user._id.toString());

      const tokens = await issueTokenPair(user._id.toString(), user.role, context);
      return { verified: true, tokens, user: toUserView(user) };
    }

    return { verified: true };
  },

  async login(input: LoginInput, context: { ipAddress?: string; userAgent?: string }): Promise<{ tokens: AuthTokens; user: AuthenticatedUserView }> {
    const user = await authRepository.findByIdentifier(input.identifier);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw new ForbiddenError(`Account locked due to repeated failed logins. Try again after ${user.lockedUntil.toISOString()}`);
    }

    const passwordMatches = await comparePassword(input.password, user.passwordHash);
    if (!passwordMatches) {
      const updated = await authRepository.incrementFailedLogin(user._id.toString());
      if (updated && updated.failedLoginCount >= AUTH_LOCKOUT.MAX_FAILED_ATTEMPTS) {
        await authRepository.lockAccount(user._id.toString(), new Date(Date.now() + AUTH_LOCKOUT.COOLDOWN_MINUTES * 60_000));
      }
      throw new UnauthorizedError('Invalid credentials');
    }

    await authRepository.resetFailedLoginTracking(user._id.toString());

    const tokens = await issueTokenPair(user._id.toString(), user.role, context);
    return { tokens, user: toUserView(user) };
  },

  async refresh(refreshTokenInput: string, context: { ipAddress?: string; userAgent?: string }): Promise<AuthTokens> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenInput);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const doc = await authRepository.findRefreshTokenById(payload.tokenId);
    if (!doc || doc.tokenHash !== sha256(refreshTokenInput)) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (doc.isRevoked) {
      await authRepository.revokeAllRefreshTokensForUser(payload.sub);
      throw new UnauthorizedError('Refresh token reuse detected — all sessions revoked, please log in again');
    }

    if (doc.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = await authRepository.findById(payload.sub);
    if (!user || user.isDeleted || user.isBlocked) {
      throw new UnauthorizedError('Account no longer active');
    }

    const tokens = await issueTokenPair(user._id.toString(), user.role, context);
    const newDoc = await authRepository.findRefreshTokenById(
      verifyRefreshToken(tokens.refreshToken).tokenId,
    );
    await authRepository.revokeRefreshToken(doc._id.toString(), newDoc?._id.toString());

    return tokens;
  },

  async logout(refreshTokenInput: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshTokenInput);
      await authRepository.revokeRefreshToken(payload.tokenId);
    } catch {
      // Idempotent — an already-invalid token still counts as "logged out".
    }
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<{ expiresInMinutes: number }> {
    const user = await authRepository.findByIdentifier(input.identifier);
    if (!user) {
      // Do not reveal account existence — respond as if it succeeded.
      return { expiresInMinutes: OTP.VALIDITY_MINUTES };
    }
    return this.sendOtp({ identifier: input.identifier, purpose: 'FORGOT_PASSWORD' });
  },

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const approved = await checkOtp(input.identifier, input.code);
    if (!approved) throw new BadRequestError('Incorrect or expired OTP');

    const user = await authRepository.findByIdentifier(input.identifier);
    if (!user) throw new BadRequestError('No account found for this identifier');

    const passwordHash = await hashPassword(input.newPassword);
    await authRepository.updatePasswordHash(user._id.toString(), passwordHash);
    await authRepository.revokeAllRefreshTokensForUser(user._id.toString());
  },
};

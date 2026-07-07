import type { Request, Response } from 'express';

import type {
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from '@/modules/auth/auth.dto';
import type { AuthService, RequestContext } from '@/modules/auth/auth.service';
import { AuthenticationError } from '@/utils/errors';
import { successResponse } from '@/utils/responseFormatter';

function contextFromRequest(req: Request): RequestContext {
  return {
    ipAddress: req.ip ?? 'unknown',
    userAgent: req.headers['user-agent'] ?? 'unknown',
    requestId: req.requestId ?? 'unknown',
  };
}

/**
 * Auth HTTP handlers (TRD 10.2). Controllers only extract the
 * already-validated DTO, delegate to the service, and format the
 * response — no business logic here.
 */
export class AuthController {
  constructor(private readonly service: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RegisterDto;
    const result = await this.service.register(dto);
    successResponse(res, result, 'Registration initiated. Please verify the OTP sent to your mobile.', 201);
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as VerifyOtpDto;
    const result = await this.service.verifyOtp(dto);
    successResponse(res, result, 'OTP verified successfully.');
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as ResendOtpDto;
    const result = await this.service.resendOtp(dto);
    successResponse(res, result, 'OTP resent successfully.');
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as LoginDto;
    const result = await this.service.login(dto, contextFromRequest(req));
    successResponse(res, result, 'Login successful.');
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RefreshTokenDto;
    const result = await this.service.refresh(dto, contextFromRequest(req));
    successResponse(res, result, 'Token refreshed successfully.');
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new AuthenticationError('Please log in to continue.');
    }
    const dto = req.body as LogoutDto;
    await this.service.logout(dto, req.user.userId, contextFromRequest(req));
    successResponse(res, null, 'Logged out successfully.');
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as ForgotPasswordDto;
    const result = await this.service.forgotPassword(dto);
    successResponse(res, result, result.message);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as ResetPasswordDto;
    await this.service.resetPassword(dto);
    successResponse(res, null, 'Password reset successfully. Please log in with your new password.');
  };
}

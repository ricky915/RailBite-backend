import { z } from 'zod';

import { email, indianMobile, name, otpCode, password } from '@/validations/common.validations';

export const registerSchema = z.object({
  name,
  mobile: indianMobile,
  email,
  password,
});
export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Please enter your mobile number or email.'),
  password: z.string().min(1, 'Please enter your password.'),
});
export type LoginDto = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  identifier: z.string().min(3),
  otp: otpCode,
  purpose: z.enum(['registration', 'login', 'password_reset', 'mobile_change']),
});
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;

export const resendOtpSchema = z.object({
  identifier: z.string().min(3),
  purpose: z.enum(['registration', 'login', 'password_reset', 'mobile_change']),
});
export type ResendOtpDto = z.infer<typeof resendOtpSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token is required.'),
});
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
  allDevices: z.boolean().optional().default(false),
});
export type LogoutDto = z.infer<typeof logoutSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3, 'Please enter your registered mobile number or email.'),
});
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(10, 'Reset token is required.'),
  newPassword: password,
});
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

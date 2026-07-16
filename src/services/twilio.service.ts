import twilio from 'twilio';

import { config } from '@/config/index';
import { AppError } from '@/utils/errors';
import { logger } from '@/utils/logger';

function client() {
  if (!config.twilio.accountSid || !config.twilio.authToken || !config.twilio.verifyServiceSid) {
    throw new Error('Twilio is not configured (TWILIO_ACCOUNT_SID/AUTH_TOKEN/VERIFY_SERVICE_SID)');
  }
  return twilio(config.twilio.accountSid, config.twilio.authToken);
}

/**
 * Twilio Verify (https://www.twilio.com/docs/verify/api) — a dedicated OTP service that
 * generates, sends, stores, and expires the code entirely on Twilio's side. We never see or
 * store the code ourselves; `checkOtpVerification` just asks Twilio whether a given code was
 * correct for a given number. This is the sole OTP mechanism for every purpose (register,
 * forgot-password, change-mobile, sensitive-action) — replaces the old Fast2SMS + local Otp
 * model entirely.
 */
export async function startOtpVerification(mobile: string): Promise<void> {
  try {
    await client().verify.v2.services(config.twilio.verifyServiceSid).verifications.create({
      to: `+91${mobile}`,
      channel: 'sms',
    });
  } catch (error) {
    logger.error('Twilio Verify — start verification failed', {
      error: error instanceof Error ? error.message : error,
      mobile,
    });
    throw new AppError(502, 'OTP_DISPATCH_FAILED', 'Could not send verification code — please try again shortly');
  }
}

export async function checkOtpVerification(mobile: string, code: string): Promise<boolean> {
  try {
    const result = await client().verify.v2.services(config.twilio.verifyServiceSid).verificationChecks.create({
      to: `+91${mobile}`,
      code,
    });
    return result.status === 'approved';
  } catch (error) {
    // Twilio throws (e.g. 404) when there's no pending verification for this number — treat as
    // "not approved" rather than a hard failure so the caller can show a normal "incorrect OTP".
    logger.warn('Twilio Verify — check verification failed', {
      error: error instanceof Error ? error.message : error,
      mobile,
    });
    return false;
  }
}

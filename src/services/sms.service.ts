import axios from 'axios';

import { config } from '@/config/index';
import { ExternalServiceError } from '@/utils/errors';
import { logger } from '@/utils/logger';

const MSG91_API_URL = 'https://control.msg91.com/api/v5/flow/';
const MAX_SMS_RETRIES = 3;
const SMS_RETRY_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes (PRD 11.11)

export interface SendSmsParams {
  mobile: string; // 10-digit Indian mobile number
  templateId: string; // MSG91 DLT-approved template id
  variables: Record<string, string>;
}

/**
 * Sends an SMS via MSG91's REST API (TRD 5.5, 2.5). Handles DLT template
 * compliance by requiring a pre-approved `templateId` and variable map
 * rather than free-form text.
 *
 * @throws {ExternalServiceError} if the MSG91 API call fails after retries.
 */
export async function sendSms(params: SendSmsParams): Promise<void> {
  const { mobile, templateId, variables } = params;

  try {
    await axios.post(
      MSG91_API_URL,
      {
        template_id: templateId,
        short_url: '0',
        recipients: [
          {
            mobiles: `91${mobile}`,
            ...variables,
          },
        ],
      },
      {
        headers: {
          authkey: config.msg91.authKey,
          'Content-Type': 'application/json',
        },
        timeout: 10_000,
      },
    );
    logger.info('SMS dispatched', { mobile, templateId });
  } catch (error) {
    logger.error('MSG91 SMS dispatch failed', {
      mobile,
      templateId,
      error: axios.isAxiosError(error) ? error.response?.data : error,
    });
    throw new ExternalServiceError('Failed to send SMS notification.');
  }
}

/**
 * Sends an SMS with retry-on-failure semantics (up to 3 attempts, 2-minute
 * interval per PRD 11.11). Intended to be invoked from a non-blocking
 * dispatch path (e.g. `setImmediate`/background job) so it never delays
 * the originating API response (TRD 20.2 "Async Notifications").
 */
export async function sendSmsWithRetry(params: SendSmsParams): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_SMS_RETRIES; attempt += 1) {
    try {
      await sendSms(params);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_SMS_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, SMS_RETRY_INTERVAL_MS));
      }
    }
  }

  logger.error('SMS delivery failed after max retries', { mobile: params.mobile });
  throw lastError instanceof Error ? lastError : new ExternalServiceError('SMS delivery failed.');
}

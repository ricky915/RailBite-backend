import axios from 'axios';

import { config } from '@/config/index';
import { ExternalServiceError } from '@/utils/errors';
import { logger } from '@/utils/logger';

const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; contentBase64: string; contentType: string }[];
}

/**
 * Sends a transactional email via SendGrid's REST API (TRD 5.5, 2.5).
 * Uses axios directly against the documented SendGrid v3 endpoint rather
 * than the `@sendgrid/mail` SDK, keeping the dependency footprint to the
 * platform-approved package list.
 *
 * @throws {ExternalServiceError} if the SendGrid API call fails.
 */
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const { to, subject, html, attachments } = params;

  try {
    await axios.post(
      SENDGRID_API_URL,
      {
        personalizations: [{ to: [{ email: to }] }],
        from: { email: config.sendgrid.fromEmail },
        subject,
        content: [{ type: 'text/html', value: html }],
        ...(attachments && attachments.length > 0
          ? {
              attachments: attachments.map((attachment) => ({
                filename: attachment.filename,
                type: attachment.contentType,
                content: attachment.contentBase64,
                disposition: 'attachment',
              })),
            }
          : {}),
      },
      {
        headers: {
          Authorization: `Bearer ${config.sendgrid.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10_000,
      },
    );
    logger.info('Email dispatched', { to, subject });
  } catch (error) {
    logger.error('SendGrid email dispatch failed', {
      to,
      subject,
      error: axios.isAxiosError(error) ? error.response?.data : error,
    });
    throw new ExternalServiceError('Failed to send email notification.');
  }
}

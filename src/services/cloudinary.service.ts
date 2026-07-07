import { v2 as cloudinary } from 'cloudinary';

import { config } from '@/config/index';
import { ExternalServiceError } from '@/utils/errors';
import { logger } from '@/utils/logger';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes: number;
  format: string;
}

/**
 * Uploads a file buffer to Cloudinary (TRD 5.5, 16.6). Used by
 * restaurants, menus, users (profile photos), and CMS modules.
 *
 * @param buffer Raw file buffer (from multer memoryStorage).
 * @param folder Cloudinary folder to organize uploads (e.g. `railbite/menu-items`).
 * @throws {ExternalServiceError} if the Cloudinary API call fails.
 */
export async function uploadFile(buffer: Buffer, folder: string): Promise<UploadResult> {
  try {
    const result = await new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, uploadResponse) => {
          if (error || !uploadResponse) {
            reject(error ?? new Error('Cloudinary upload returned no response.'));
            return;
          }
          resolve({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
            width: uploadResponse.width,
            height: uploadResponse.height,
            bytes: uploadResponse.bytes,
            format: uploadResponse.format,
          });
        },
      );
      uploadStream.end(buffer);
    });
    return result;
  } catch (error) {
    logger.error('Cloudinary upload failed', { error: error instanceof Error ? error.message : error });
    throw new ExternalServiceError('File upload failed. Please try again.');
  }
}

/**
 * Deletes a previously uploaded asset by its Cloudinary public id.
 */
export async function deleteFile(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error('Cloudinary delete failed', {
      publicId,
      error: error instanceof Error ? error.message : error,
    });
    throw new ExternalServiceError('File deletion failed. Please try again.');
  }
}

/**
 * Generates a signed, time-limited URL for private/sensitive assets.
 */
export function generateSignedUrl(publicId: string, expiresInSeconds = 3600): string {
  const timestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return cloudinary.utils.private_download_url(publicId, 'jpg', {
    expires_at: timestamp,
  });
}

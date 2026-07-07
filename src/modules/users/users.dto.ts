import { z } from 'zod';

import { mongoId, name, password, paginationQuery } from '@/validations/common.validations';

export const updateProfileSchema = z.object({
  name: name.optional(),
  preferences: z
    .object({
      dietaryTags: z.array(z.string()).optional(),
      cuisinePrefs: z.array(z.string()).optional(),
    })
    .optional(),
  notificationSettings: z
    .object({
      emailMarketing: z.boolean().optional(),
      smsMarketing: z.boolean().optional(),
      inApp: z.boolean().optional(),
    })
    .optional(),
});
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Please enter your current password.'),
  newPassword: password,
});
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;

export const requestMobileChangeSchema = z.object({
  newMobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.'),
});
export type RequestMobileChangeDto = z.infer<typeof requestMobileChangeSchema>;

export const userIdParamsSchema = z.object({ id: mongoId });
export type UserIdParamsDto = z.infer<typeof userIdParamsSchema>;

export const listUsersQuerySchema = paginationQuery.extend({
  role: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});
export type ListUsersQueryDto = z.infer<typeof listUsersQuerySchema>;

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});
export type UpdateUserStatusDto = z.infer<typeof updateUserStatusSchema>;

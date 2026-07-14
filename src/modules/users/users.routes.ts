import { Router } from 'express';
import multer from 'multer';

import { requireAuth } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { updateUserRoleSchema } from '@/modules/admin/admin.dto';
import { UserRole } from '@/types/domain.types';

import { usersController } from './users.controller';
import {
  changeMobileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  listUsersSchema,
  updateNotificationSettingsSchema,
  updatePreferencesSchema,
  updateProfileSchema,
  userIdParamSchema,
} from './users.dto';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  },
});

export const usersRoutes = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get own profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
usersRoutes.get('/me', requireAuth, usersController.getMe);

/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Update own profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 80 }
 *     responses:
 *       '200':
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
usersRoutes.patch('/me', requireAuth, validate({ body: updateProfileSchema }), usersController.updateProfile);

/**
 * @openapi
 * /users/me/password:
 *   patch:
 *     summary: Change password
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 8, maxLength: 72 }
 *     responses:
 *       '200':
 *         description: Password changed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NullDataResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
usersRoutes.patch('/me/password', requireAuth, validate({ body: changePasswordSchema }), usersController.changePassword);

/**
 * @openapi
 * /users/me/mobile/send-otp:
 *   post:
 *     summary: Send OTP to new mobile number
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: OTP sent to new mobile number
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OtpSentResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
usersRoutes.post('/me/mobile/send-otp', requireAuth, usersController.requestMobileChangeOtp);

/**
 * @openapi
 * /users/me/mobile:
 *   patch:
 *     summary: Change mobile number (OTP-verified)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newMobile, otpCode]
 *             properties:
 *               newMobile: { type: string, pattern: '^[6-9]\d{9}$', example: '9876543211' }
 *               otpCode: { type: string, pattern: '^\d{6}$', example: '123456' }
 *     responses:
 *       '200':
 *         description: Mobile number updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
usersRoutes.patch('/me/mobile', requireAuth, validate({ body: changeMobileSchema }), usersController.changeMobile);

/**
 * @openapi
 * /users/me/preferences:
 *   patch:
 *     summary: Update dietary/cuisine preferences
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dietaryTags: { type: array, items: { type: string }, example: [Vegetarian, Jain] }
 *               cuisinePreferences: { type: array, items: { type: string }, example: [North Indian, South Indian] }
 *     responses:
 *       '200':
 *         description: Preferences updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
usersRoutes.patch('/me/preferences', requireAuth, validate({ body: updatePreferencesSchema }), usersController.updatePreferences);

/**
 * @openapi
 * /users/me/notification-settings:
 *   patch:
 *     summary: Update notification preferences
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               smsEnabled: { type: boolean }
 *               emailEnabled: { type: boolean }
 *               promotionalEnabled: { type: boolean }
 *     responses:
 *       '200':
 *         description: Notification settings updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
usersRoutes.patch(
  '/me/notification-settings',
  requireAuth,
  validate({ body: updateNotificationSettingsSchema }),
  usersController.updateNotificationSettings,
);

/**
 * @openapi
 * /users/me/photo:
 *   post:
 *     summary: Upload profile photo
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photo]
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: JPEG/PNG/WebP, max 2MB
 *     responses:
 *       '200':
 *         description: Profile photo updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
usersRoutes.post('/me/photo', requireAuth, upload.single('photo'), usersController.uploadPhoto);

/**
 * @openapi
 * /users/me/request-deletion-otp:
 *   post:
 *     summary: Send OTP required to confirm account deletion
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       '200':
 *         description: OTP sent to confirm account deletion
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OtpSentResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
usersRoutes.post('/me/request-deletion-otp', requireAuth, usersController.requestDeletionOtp);

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: Delete own account (OTP-verified, DPDPA)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otpCode]
 *             properties:
 *               otpCode: { type: string, pattern: '^\d{6}$', example: '123456' }
 *     responses:
 *       '200':
 *         description: Account deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NullDataResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
usersRoutes.delete('/me', requireAuth, validate({ body: deleteAccountSchema }), usersController.deleteAccount);

export const adminUsersRoutes = Router();

const adminRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: List users (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: page, schema: { type: integer, minimum: 1, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, minimum: 1, default: 20 } }
 *       - { in: query, name: search, schema: { type: string }, description: Matches name/email/mobile }
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserListResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 */
adminUsersRoutes.get('/', requireAuth, requireRole(...adminRoles), validate({ query: listUsersSchema }), usersController.listAll);

/**
 * @openapi
 * /admin/users/{id}/block:
 *   patch:
 *     summary: Block/unblock a user (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, pattern: '^[a-f0-9]{24}$' } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isBlocked: { type: boolean, default: true, description: 'Omit or true to block; false to unblock' }
 *     responses:
 *       '200':
 *         description: User blocked/unblocked
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
adminUsersRoutes.patch(
  '/:id/block',
  requireAuth,
  requireRole(...adminRoles),
  validate({ params: userIdParamSchema }),
  usersController.setBlocked,
);

/**
 * @openapi
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Assign a role to a user (super admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, pattern: '^[a-f0-9]{24}$' } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [PASSENGER, SUPPORT_EXEC, ADMIN, SUPER_ADMIN] }
 *     responses:
 *       '200':
 *         description: User role updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UserResponse' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '403': { $ref: '#/components/responses/Forbidden' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '422': { $ref: '#/components/responses/ValidationError' }
 */
adminUsersRoutes.patch(
  '/:id/role',
  requireAuth,
  requireRole(UserRole.SUPER_ADMIN),
  validate({ params: userIdParamSchema, body: updateUserRoleSchema }),
  usersController.setRole,
);

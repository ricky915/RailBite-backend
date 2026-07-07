import { Router } from 'express';

import { authMiddleware } from '@/middleware/auth.middleware';
import { requireRole } from '@/middleware/role.middleware';
import { validate } from '@/middleware/validate.middleware';
import { UsersController } from '@/modules/users/users.controller';
import {
  changePasswordSchema,
  listUsersQuerySchema,
  requestMobileChangeSchema,
  updateProfileSchema,
  updateUserStatusSchema,
  userIdParamsSchema,
} from '@/modules/users/users.dto';
import { UsersRepository } from '@/modules/users/users.repository';
import { UsersService } from '@/modules/users/users.service';
import { UserRole } from '@/types/domain.types';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();

const repository = new UsersRepository();
const service = new UsersService(repository);
const controller = new UsersController(service);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Profile retrieved }
 *       501: { description: Not yet implemented }
 */
router.get('/me', authMiddleware, asyncHandler(controller.getProfile));

/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Profile updated }
 */
router.patch(
  '/me',
  authMiddleware,
  validate({ body: updateProfileSchema }),
  asyncHandler(controller.updateProfile),
);

/**
 * @openapi
 * /users/me/password:
 *   patch:
 *     summary: Change the authenticated user's password
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Password changed }
 */
router.patch(
  '/me/password',
  authMiddleware,
  validate({ body: changePasswordSchema }),
  asyncHandler(controller.changePassword),
);

/**
 * @openapi
 * /users/me/mobile:
 *   post:
 *     summary: Request a mobile number change (triggers OTP to new number)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: OTP sent to new mobile number }
 */
router.post(
  '/me/mobile',
  authMiddleware,
  validate({ body: requestMobileChangeSchema }),
  asyncHandler(controller.requestMobileChange),
);

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: Soft-delete the authenticated user's account (30-day recovery window)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Account deletion initiated }
 */
router.delete('/me', authMiddleware, asyncHandler(controller.deleteAccount));

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List platform users (admin)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: Paginated user list }
 */
router.get(
  '/',
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ query: listUsersQuerySchema }),
  asyncHandler(controller.listUsers),
);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a user account (admin)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200: { description: User status updated }
 */
router.patch(
  '/:id/status',
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validate({ params: userIdParamsSchema, body: updateUserStatusSchema }),
  asyncHandler(controller.updateUserStatus),
);

export const usersRoutes = router;

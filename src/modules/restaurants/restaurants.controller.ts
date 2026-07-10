import type { Request, Response } from 'express';

import { asyncHandler } from '@/utils/asyncHandler';
import { recordAuditLog } from '@/utils/auditLog';
import { UnauthorizedError } from '@/utils/errors';
import { sendSuccess } from '@/utils/responseFormatter';

import { restaurantsService } from './restaurants.service';

function requireUser(req: Request) {
  if (!req.user) throw new UnauthorizedError();
  return req.user;
}

export const restaurantsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const isAdminCaller = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';
    const { items, meta } = await restaurantsService.list(req.query as never, isAdminCaller);
    sendSuccess(res, items, { meta });
  }),

  popular: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const items = await restaurantsService.popular(limit);
    sendSuccess(res, items);
  }),

  getDetail: asyncHandler(async (req: Request, res: Response) => {
    const restaurant = await restaurantsService.getPublicDetail(req.params.id);
    sendSuccess(res, restaurant);
  }),

  getMenu: asyncHandler(async (req: Request, res: Response) => {
    const menu = await restaurantsService.getMenu(req.params.id);
    sendSuccess(res, menu);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const user = requireUser(req);
    const restaurant = await restaurantsService.create(user.id, req.body);
    sendSuccess(res, restaurant, { statusCode: 201, message: 'Restaurant submitted for approval' });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const user = requireUser(req);
    const restaurant = await restaurantsService.update(req.params.id, req.body, user);
    sendSuccess(res, restaurant, { message: 'Restaurant updated' });
  }),

  approve: asyncHandler(async (req: Request, res: Response) => {
    const user = requireUser(req);
    const before = await restaurantsService.getPublicDetail(req.params.id).catch(() => null);
    const restaurant = await restaurantsService.approve(req.params.id, user.id);
    await recordAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: 'RESTAURANT_APPROVED',
      entityType: 'Restaurant',
      entityId: req.params.id,
      before,
      after: restaurant,
      ipAddress: req.ip,
    });
    sendSuccess(res, restaurant, { message: 'Restaurant approved' });
  }),

  reject: asyncHandler(async (req: Request, res: Response) => {
    const user = requireUser(req);
    const restaurant = await restaurantsService.reject(req.params.id, req.body, user.id);
    await recordAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: 'RESTAURANT_REJECTED',
      entityType: 'Restaurant',
      entityId: req.params.id,
      after: restaurant,
      ipAddress: req.ip,
    });
    sendSuccess(res, restaurant, { message: 'Restaurant rejected' });
  }),

  suspend: asyncHandler(async (req: Request, res: Response) => {
    const user = requireUser(req);
    const restaurant = await restaurantsService.suspend(req.params.id, req.body, user.id);
    await recordAuditLog({
      actorId: user.id,
      actorRole: user.role,
      action: 'RESTAURANT_SUSPENDED',
      entityType: 'Restaurant',
      entityId: req.params.id,
      after: restaurant,
      ipAddress: req.ip,
    });
    sendSuccess(res, restaurant, { message: 'Restaurant suspended' });
  }),
};

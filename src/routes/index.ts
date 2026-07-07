import { Router } from 'express';

import { adminRoutes } from '@/modules/admin/admin.routes';
import { authRoutes } from '@/modules/auth/auth.routes';
import { cartRoutes } from '@/modules/cart/cart.routes';
import { couponsRoutes } from '@/modules/coupons/coupons.routes';
import { invoicesRoutes } from '@/modules/invoices/invoices.routes';
import { menusRoutes } from '@/modules/menus/menus.routes';
import { notificationsRoutes } from '@/modules/notifications/notifications.routes';
import { ordersRoutes } from '@/modules/orders/orders.routes';
import { paymentsRoutes } from '@/modules/payments/payments.routes';
import { ratingsRoutes } from '@/modules/ratings/ratings.routes';
import { restaurantsRoutes } from '@/modules/restaurants/restaurants.routes';
import { supportRoutes } from '@/modules/support/support.routes';
import { trainsRoutes } from '@/modules/trains/trains.routes';
import { usersRoutes } from '@/modules/users/users.routes';

/**
 * Central route aggregator (TRD 4.2 `routes/index.ts`). Mounts every
 * feature module router under `/api/v1` (TRD 11.1 "Base URL"). This is
 * the only file that composes module routers together; individual
 * modules never import each other's routers directly (except `admin`,
 * which explicitly owns cross-module admin operations per TRD 4.2).
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/trains', trainsRoutes);
router.use('/restaurants', restaurantsRoutes);
router.use('/menus', menusRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/coupons', couponsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/ratings', ratingsRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);

export const apiRouter = router;

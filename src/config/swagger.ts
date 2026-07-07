import swaggerJSDoc from 'swagger-jsdoc';

import { config } from '@/config/index';

/**
 * Swagger/OpenAPI 3.0 configuration (TRD 11.5). JSDoc `@openapi` blocks
 * inside each module's `*.routes.ts` file are the source of truth for
 * endpoint documentation. Swagger UI is mounted at `/api/docs` in
 * `app.ts`, gated by `config.swagger.enabled` (must be `false` in
 * production).
 */
const swaggerDefinition: swaggerJSDoc.OAS3Definition = {
  openapi: '3.0.0',
  info: {
    title: 'RailBite API',
    version: '1.0.0',
    description: 'Railway Food Ordering Platform — REST API reference.',
  },
  servers: [
    {
      url: `/api/${config.app.apiVersion}`,
      description: `${config.app.nodeEnv} server`,
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Registration, login, tokens, password reset' },
    { name: 'Users', description: 'Profile and account management' },
    { name: 'Trains', description: 'Train schedule and PNR lookup' },
    { name: 'Restaurants', description: 'Restaurant listing, detail, and onboarding' },
    { name: 'Menus', description: 'Menu category and item management' },
    { name: 'Cart', description: 'Server-side cart validation' },
    { name: 'Orders', description: 'Order placement, tracking, and cancellation' },
    { name: 'Payments', description: 'Payment initiation, status, and webhooks' },
    { name: 'Coupons', description: 'Coupon validation and admin management' },
    { name: 'Notifications', description: 'In-app notifications and admin broadcast' },
    { name: 'Ratings', description: 'Restaurant ratings and reviews' },
    { name: 'Invoices', description: 'GST invoice retrieval' },
    { name: 'Support', description: 'Support ticket management' },
    { name: 'Admin', description: 'Admin-only cross-module operations' },
    { name: 'Reports', description: 'Operational and financial reports' },
    { name: 'Analytics', description: 'Product and business analytics' },
  ],
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/modules/**/*.routes.ts', './dist/modules/**/*.routes.js'],
};

export const swaggerSpec = swaggerJSDoc(options);

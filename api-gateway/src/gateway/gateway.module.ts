import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { UserRoles } from '../shared/utils/api-enums';
import { JwtAuthMiddleware } from '../auth/middleware/jwt-auth.middleware';
import { createRoleMiddleware } from '../auth/middleware/role.middleware';

@Module({})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(createRoleMiddleware(UserRoles.manager)).forRoutes(
      '/users/delete/*',
      'users/wallet/balance/*',
      'users/update/*',
      'users/profile/*',
      'users/role/update/*',
      'users/retrieve/all',
      'investments/get/all',
      'investments/get/*',
      {
        path: '/users/*',
        method: RequestMethod.DELETE,
      },
      {
        path: '/properties/*',
        method: RequestMethod.PATCH,
      },
      {
        path: '/properties/*',
        method: RequestMethod.DELETE,
      },
      {
        path: '/properties',
        method: RequestMethod.POST,
      },
      {
        path: '/investments/property/*',
        method: RequestMethod.GET,
      },
    );

    consumer
      .apply(
        JwtAuthMiddleware,
        createProxyMiddleware({
          target: 'http://localhost:3001/users', // User Service
          changeOrigin: true,
          on: {
            proxyReq: fixRequestBody,
          },
        }),
      )
      .forRoutes('/users');

    consumer
      .apply(
        JwtAuthMiddleware,
        createProxyMiddleware({
          target: 'http://localhost:3002/properties', // Property Service
          changeOrigin: true,
          on: {
            proxyReq: fixRequestBody,
          },
        }),
      )
      .forRoutes('/properties');

    consumer
      .apply(
        JwtAuthMiddleware,
        createProxyMiddleware({
          target: 'http://localhost:3003/investments', // Investment Service
          changeOrigin: true,
          on: {
            proxyReq: fixRequestBody,
          },
        }),
      )
      .forRoutes('/investments');

    consumer
      .apply(
        JwtAuthMiddleware,
        createProxyMiddleware({
          target: 'http://localhost:3004/payments', // Payment Service
          changeOrigin: true,
          on: {
            proxyReq: fixRequestBody,
          },
        }),
      )
      .forRoutes('/payments');

    consumer
      .apply(
        JwtAuthMiddleware,
        createProxyMiddleware({
          target: 'http://localhost:3005/notifications', // Notification Service
          changeOrigin: true,
          on: {
            proxyReq: fixRequestBody,
          },
        }),
      )
      .forRoutes('/notifications');
  }
}

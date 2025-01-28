import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

@Module({})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
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

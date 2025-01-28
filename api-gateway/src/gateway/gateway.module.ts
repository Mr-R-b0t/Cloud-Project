import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Module({})
export class GatewayModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(
            createProxyMiddleware({
                target: 'http://localhost:3001/users', // User Service
                changeOrigin: true,
            }),
        )
        .forRoutes('/users');

    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3002/properties', // Property Service
          changeOrigin: true,
        }),
      )
      .forRoutes('/properties');

    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3003/investments', // Investment Service
          changeOrigin: true,
        }),
      )
      .forRoutes('/investments');

    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3004/payments', // Payment Service
          changeOrigin: true,
        }),
      )
      .forRoutes('/payments');

    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:3005/notifications', // Notification Service
          changeOrigin: true,
        }),
      )
      .forRoutes('/notifications');
  }
}

import {MiddlewareConsumer, Module} from '@nestjs/common';
import {createProxyMiddleware} from "http-proxy-middleware";

@Module({})
export class GatewayModule {
    configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(
            createProxyMiddleware({
                target: 'http://localhost:3001', // User Service
                changeOrigin: true,
            }),
        )
        .forRoutes('/users');

    consumer
        .apply(
            createProxyMiddleware({
                target: 'http://localhost:3002', // Property Service
                changeOrigin: true,
            }),
        )
        .forRoutes('/properties');

    consumer
        .apply(
            createProxyMiddleware({
                target: 'http://localhost:3003', // Investment Service
                changeOrigin: true,
            }),
        )
        .forRoutes('/investements');

    consumer
        .apply(
            createProxyMiddleware({
                target: 'http://localhost:3004', // Payment Service
                changeOrigin: true,
            }),
        )
        .forRoutes('/payments');

    consumer
        .apply(
            createProxyMiddleware({
                target: 'http://localhost:3005', // Notification Service
                changeOrigin: true,
            }),
        )
        .forRoutes('/notifications');
    }


}

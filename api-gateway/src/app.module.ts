import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { HttpProxyMiddleware } from 'http-proxy-middleware';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
@Module({})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        HttpProxyMiddleware.createProxyMiddleware({
          target: 'http://localhost:3001', // User Service
          changeOrigin: true,
        }),
      )
      .forRoutes('/users');

    consumer
      .apply(
        HttpProxyMiddleware.createProxyMiddleware({
          target: 'http://localhost:3002', // Property Service
          changeOrigin: true,
        }),
      )
      .forRoutes('/properties');
  }
}

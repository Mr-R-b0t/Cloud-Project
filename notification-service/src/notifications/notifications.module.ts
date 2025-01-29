// payment-service/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './service/notifications.service';

@Module({
  imports: [
    //TypeOrmModule.forFeature([Payment]),
    ConfigModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
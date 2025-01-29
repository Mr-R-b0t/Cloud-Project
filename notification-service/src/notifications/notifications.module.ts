import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './controller/notifications.controller';
import { NotificationsService } from './service/notifications.service';

@Module({
  imports: [
    ConfigModule
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
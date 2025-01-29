import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    NotificationsModule
  ],
  controllers: [  ],
  providers: [  ],
})
export class AppModule {}

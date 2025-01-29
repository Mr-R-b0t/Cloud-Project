import { Module } from '@nestjs/common';
import { PaymentModule } from './payments/payments.module';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    PaymentModule
  ],
  controllers: [  ],
  providers: [  ],
})
export class AppModule {}

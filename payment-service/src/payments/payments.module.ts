// payment-service/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './controller/payments.controller';
import { PaymentService } from './service/payments.service';

@Module({
  imports: [
    ConfigModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
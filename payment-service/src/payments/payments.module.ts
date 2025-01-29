// payment-service/src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './controller/payments.controller';
import { PaymentService } from './service/payments.service';
import { Payment } from './entity/payments.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    ConfigModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule {}
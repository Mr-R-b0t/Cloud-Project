import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payments/payments.module';
import { PaymentController } from './payments/controller/payments.controller';
import { PaymentService } from './payments/service/payments.service';
@Module({
  imports: [PaymentModule],
  controllers: [AppController, PaymentController],
  providers: [AppService, PaymentService],
})
export class AppModule {}

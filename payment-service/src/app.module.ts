import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PaymentService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';

@Module({
  imports: [PaymentsModule],
  controllers: [AppController, PaymentsController],
  providers: [PaymentService, PaymentsService],
})
export class AppModule {}

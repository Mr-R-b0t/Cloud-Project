import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './app.controller';
import { PaymentService } from './app.service';

describe('AppController', () => {
  let paymentController: PaymentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [PaymentService],
    }).compile();

    paymentController = app.get<PaymentController>(PaymentController);
  });

  //describe('root', () => {
    //it('should return "Hello World!"', () => {
      //expect(paymentController.createPaymentIntent()).toBe('Hello World!');
    //});
  //});
});

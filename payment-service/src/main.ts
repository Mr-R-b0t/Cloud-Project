import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payments/payments.module';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    }
  }));
  app.setGlobalPrefix('api'); 
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();

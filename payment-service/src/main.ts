import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json({verify: (req: any, res, buf) => 
    {req.rawBody = buf;}  }));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();

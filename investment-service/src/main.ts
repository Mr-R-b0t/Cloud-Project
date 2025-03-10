import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [''],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealthCheck() {
    return { status: 'OK', message: 'API is running!' };
  }
}

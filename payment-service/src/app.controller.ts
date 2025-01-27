import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

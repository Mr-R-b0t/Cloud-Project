import { Controller, Post, Body, Headers, HttpException, Req, UseGuards, RawBodyRequest, Res, HttpCode, HttpStatus  } from '@nestjs/common';
import { PaymentService } from './../service/payments.service';
import { CreatePaymentDto } from './../controller/dto/create-payment.js';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
//@UseGuards(JwtAuthGuard)
export class PaymentController {
  private stripe: Stripe;
  constructor(
    private readonly paymentService: PaymentService,
    private configService: ConfigService
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET'), {
      apiVersion: '2024-12-18.acacia',
    });
  }


  @Post('pay')
  //createPaymentIntent(@Req() req, @Body() dto: CreatePaymentDto) {
    createPaymentIntent(@Body() dto: CreatePaymentDto) {
      const userId = "3667fed3-e83b-4e7c-bd21-8c3f0d666ce3"
  return this.paymentService.createPaymentIntent(userId, dto);
  }

  @Post('webhooks')
  async handleWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        this.configService.get('STRIPE_WEBHOOK')
      );
      return this.paymentService.handlePaymentWebhook(event);
    } catch (err) {
      console.log("Error", err);
      throw new HttpException(err.message, 400);
    }
  }
}

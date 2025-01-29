import { Controller, Post, Body, Headers, HttpException, Req, UseGuards, RawBodyRequest, Res, HttpCode, HttpStatus, Param  } from '@nestjs/common';
import { PaymentService } from './../service/payments.service';
import { CreatePaymentDto } from './../controller/dto/create-payment.js';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
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

  // Recharge wallet
  @Post('recharge/:id')
    async createPaymentIntent(@Param('id') id: string,@Body() dto: CreatePaymentDto) {
    return await this.paymentService.rechargeWallet(id, dto);
  }
  // Handle webhook for stripe
  @Post('webhooks')
  async handleWebhook(@Req() request: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string,) {
      const event = this.stripe.webhooks.constructEvent(request.rawBody,signature,this.configService.get('STRIPE_WEBHOOK'));
      return this.paymentService.handlePaymentWebhook(event);
  }

  // Withdraw from wallet
  @Post('withdraw/:id')
  async transferPayment(@Param('id') id: string,@Body() dto: CreatePaymentDto){
    return await this.paymentService.withrawFromWallet(id, dto);
  }
  
}

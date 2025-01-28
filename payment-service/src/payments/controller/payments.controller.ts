import { Controller, Post, Body, Headers, HttpException, Req, UseGuards, RawBodyRequest, Res, HttpCode, HttpStatus, Param  } from '@nestjs/common';
import { PaymentService } from './../service/payments.service';
import { CreatePaymentDto } from './../controller/dto/create-payment.js';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateTransferDto } from './../controller/dto/create-transfer.js';
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


  @Post('recharge/:id')
    createPaymentIntent(@Param('id') id: string,@Body() dto: CreatePaymentDto) {
    return this.paymentService.rechargeWallet(id, dto);
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

  @Post('withdraw/:id')
  async transferPayment(@Param('id') id: string,@Body() dto: CreatePaymentDto){
    return this.paymentService.withrawFromWallet(id, dto);
  }
  
}
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePaymentDto } from './../controller/dto/create-payment.js';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import axios from "axios"
interface Payment {
  id: string;
  stripePaymentId: string;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
}

@Injectable()
export class PaymentService {
  private readonly DEFAULT_PAYMENT_METHOD = "card";
  private stripe: Stripe;
  private mockAnnualInvestments: Map<string, number>;
  private payments: Map<string, Payment> = new Map();

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET'), {
      apiVersion: '2024-12-18.acacia',
    });
    this.mockAnnualInvestments = new Map([
      ['123456897', 75000],
      ['987654321', 95000],
      ['111222333', 0],
    ]);
  }

  async createPaymentIntent(userId: string, dto: CreatePaymentDto) {
    const annualTotal = await this.getAnnualInvestmentTotal(userId);
    if (annualTotal + dto.amount > 100000) {
      throw new HttpException('Annual investment limit exceeded', HttpStatus.BAD_REQUEST);
    }
    const paymentMethod = dto.paymentMethod || this.DEFAULT_PAYMENT_METHOD;

    if (!dto.paymentMethod) {
      throw new HttpException('Payment method is required', HttpStatus.BAD_REQUEST);
    }

    console.log("dtoamout", dto.amount)    
    console.log("dtoamout", dto.amount)
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100),
      currency: 'eur',
      confirm: true,
      payment_method: 'pm_card_visa',

      payment_method_types: ['card'],
      metadata: { userId },
    });

    const payment: Payment = {
      id: crypto.randomUUID(),
      stripePaymentId: paymentIntent.id,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: 'pending'
    };

    
    this.payments.set(payment.stripePaymentId, payment);
    console.log(paymentIntent.status)
    if (paymentIntent.status === 'succeeded') {
      try {
        console.log(paymentIntent.status)
        const response = await axios.patch(
          `http://localhost:3001/users/wallet/update/8511b6e4-2fe0-4f47-9626-97c7a108cc95`, 
          { amount: dto.amount },  
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log(paymentIntent.status)
        const response = await axios.patch(
          `http://localhost:3001/users/wallet/update/8511b6e4-2fe0-4f47-9626-97c7a108cc95`, 
          { amount: dto.amount },  
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        payment.status = response.status === 200 ? 'completed' : 'failed';
        
        const mockStripeEvent: Stripe.Event = {
          id: 'evt_' + crypto.randomUUID(),
          type: 'payment_intent.succeeded', 
          data: {
            object: paymentIntent, 
          },
          api_version: '2024-12-18.acacia',
          created: Math.floor(Date.now() / 1000),
          livemode: false,
          pending_webhooks: 0,
          request: {
            id: 'req_' + crypto.randomUUID(),
            idempotency_key: crypto.randomUUID(),
          },
          object: 'event',
        };

        await this.handlePaymentWebhook(mockStripeEvent);
        return payment.status;
      } catch (error) {
        console.error("ERROR HERE", error)
        payment.status = 'failed';
        const mockStripeEvent: Stripe.Event = {
          id: 'evt_' + crypto.randomUUID(),
          type: 'payment_intent.payment_failed', // Trigger a failed payment event
          data: {
            object: paymentIntent, // Include the payment intent data
          },
          api_version: '2024-12-18.acacia',
          created: Math.floor(Date.now() / 1000),
          livemode: false,
          pending_webhooks: 0,
          request: {
            id: 'req_' + crypto.randomUUID(),
            idempotency_key: crypto.randomUUID(),
          },
          object: 'event',
        };

        await this.handlePaymentWebhook(mockStripeEvent);
        return payment.status;
      }
    } else {
        const mockStripeEvent: Stripe.Event = {
          id: 'evt_' + crypto.randomUUID(),
          type: 'payment_intent.payment_failed',
          data: {
            object: paymentIntent,
          },
          api_version: '2024-12-18.acacia',
          created: Math.floor(Date.now() / 1000),
          livemode: false,
          pending_webhooks: 0,
          request: {
            id: 'req_' + crypto.randomUUID(),
            idempotency_key: crypto.randomUUID(),
          },
          object: 'event',
      };

      await this.handlePaymentWebhook(mockStripeEvent);

      payment.status = 'failed';
      return payment.status;
    }
  }

  async handlePaymentWebhook(event: Stripe.Event) {
    const { type, data } = event;
    console.log("Event type : ", event.type);
    
    switch (type) {
      case 'payment_intent.succeeded':
        await this.handleSuccessfulPayment(data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handleFailedPayment(data.object as Stripe.PaymentIntent);
        break;
    }
  }

  private async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    try {
        const response = await axios.post(
        `http://localhost:3005/notifications/sendMail`, 
        {
          id: paymentIntent.id,
          object: "Payment successfull !", 
          body: "You have sucessfully paid you order !",
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Email sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      throw new Error('Failed to send email');
    }
    
    
    
  }

  private async handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    try{

    const payment = this.payments.get(paymentIntent.id);
    const response = await axios.post(
      `http://localhost:3005/notifications/sendMail`, 
      {
        id: paymentIntent.id,
        object: "Payment failed :/", 
        body: "Something went wrong with your order.",
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Email sent successfully:', response.data);
    if (!payment) return;
    payment.status = 'failed';
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
    
  }

  private async getAnnualInvestmentTotal(userId: string): Promise<number> {
    return this.mockAnnualInvestments.get(userId) || 0;
  }
}


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
  private payments: Map<string, Payment> = new Map();

  constructor(private configService: ConfigService) {
    // Initialize Stripe with secret key from config
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET'), {apiVersion: '2024-12-18.acacia',});
  }

  //Method to recharge wallet
  async rechargeWallet(userId: string, dto: CreatePaymentDto) {
    const paymentMethod = dto.paymentMethod || this.DEFAULT_PAYMENT_METHOD;
    const senderResponse = await axios.get(`http://localhost:3001/users/wallet/balance/${userId}`);
    const userBalance = senderResponse.data;
    if (userBalance < dto.amount) {
      // Insufficient funds
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }
    if (!dto.paymentMethod) {
      throw new HttpException('Payment method is required', HttpStatus.BAD_REQUEST);
    }

    // Create a payment intent with Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100),
      currency: 'eur',
      confirm: true,
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
      metadata: { userId },
    });

    // Create a payment object
    const payment: Payment = {
      id: crypto.randomUUID(),
      stripePaymentId: paymentIntent.id,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: 'pending'
    };

    
    this.payments.set(payment.stripePaymentId, payment);
    if (paymentIntent.status === 'succeeded') {
      try {
        console.log(paymentIntent.status)
        const response = await axios.patch(
          `http://localhost:3001/users/wallet/update/${userId}`, 
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
        console.log("The wallet has been recharged successfully")
        await this.handlePaymentWebhook(mockStripeEvent);
        return 'The wallet has been recharged successfully. Email send.';
      } catch (error) {
        console.error("ERROR HERE", error)
        payment.status = 'failed';
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
        return 'The wallet has been recharged failed. Email sent.';
      }
    } 
  }
  // Handle Stripe webhook events
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
  // Send email notification for successful payment
  private async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    try {
      console.log("id transaction", paymentIntent.id);
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
      console.log('Email sent successfully');
      return 'Email sent successfully';
    } catch (error) {
      console.error('Error sending email:', error.response?.data || error.message);
      throw new Error('Failed to send email');
    }
  }


  // Send email notification for failed payment
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
    
    return 'Email sent successfully!';
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    throw new Error('Failed to send email');
  }
}

  // Method to withdraw from wallet
  async withrawFromWallet(userId: string, dto: CreatePaymentDto) {
    const paymentMethod = dto.paymentMethod || this.DEFAULT_PAYMENT_METHOD;
    const senderResponse = await axios.get(`http://localhost:3001/users/wallet/balance/${userId}`); // get user balance
    const userBalance = senderResponse.data;
    if (userBalance < dto.amount) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }
    if (!dto.paymentMethod) {
      throw new HttpException('Payment method is required', HttpStatus.BAD_REQUEST);
    }

    // Create a payment intent with Stripe
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100),
      currency: 'eur',
      confirm: true,
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
      metadata: { userId },
    });
    // Create a payment object
    const payment: Payment = {
      id: crypto.randomUUID(),
      stripePaymentId: paymentIntent.id,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: 'pending'
    };

    // Handle payment success
    this.payments.set(payment.stripePaymentId, payment);
    if (paymentIntent.status === 'succeeded') {
      try {
        const response = await axios.patch(
          `http://localhost:3001/users/wallet/update/${userId}`, 
          { amount: -dto.amount },  
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        payment.status = response.status === 200 ? 'completed' : 'failed';
        // Mock Stripe event for successful payment
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
        console.log("Your withdraw is completed !")
        await this.handlePaymentWebhook(mockStripeEvent);
        return 'Your withdraw is completed. Email sent successfully!';
      } catch (error) {
        console.error("ERROR HERE", error)
        payment.status = 'failed';
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
        return 'Your withdraw is failed. Email sent.';
      }
    } 
  }
}
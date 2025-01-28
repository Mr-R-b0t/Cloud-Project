import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entity/payments.entity';
import { CreatePaymentDto } from './../controller/dto/create-payment.js';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
//import { EmailService } from '../email/email.service';
//import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private mockAnnualInvestments: Map<string, number>;
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private configService: ConfigService,
    //private walletService: WalletService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET'), {
      apiVersion: '2024-12-18.acacia',
    });
    this.mockAnnualInvestments = new Map([
      ['123456897', 75000], // User with existing investments
      ['987654321', 95000], // User close to limit
      ['111222333', 0],     // New user
    ]);
  }
  

  async createPaymentIntent(userId: string, dto: CreatePaymentDto) {
    // Validate annual investment limit
    const annualTotal = await this.getAnnualInvestmentTotal(userId);
    if (annualTotal + dto.amount > 100000) {
      throw new HttpException(
        'Annual investment limit exceeded',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100), // Convert to cents
      currency: 'eur',
      confirm: true,
      payment_method_types: ['card'],
      metadata: { userId },
    });

    // Create payment record
    const payment = this.paymentRepository.create({
      stripePaymentId: paymentIntent.id,
      //user: { id: userId },
      amount: dto.amount,
      status: PaymentStatus.PENDING,
      paymentMethod: dto.paymentMethod,
    });

    await this.paymentRepository.save(payment);
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.stripePaymentId,
    };
  }

  ///// WEBHOOK SECTION /////
  async handlePaymentWebhook(event: Stripe.Event) {
    const { type, data } = event;
    console.log("Event type : ", event.type)

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
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (!payment) return;

    // Update payment status
    payment.status = PaymentStatus.COMPLETED;
    await this.paymentRepository.save(payment);

    // Add funds to user's wallet
    //await this.walletService.addFunds(payment.user.id, payment.amount);

    // Send confirmation email
    //await this.emailService.sendPaymentConfirmation(
      //payment.user.email,
      //payment.amount,
    //);
  }

  private async handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentId: paymentIntent.id },
    });

    if (!payment) return;

    payment.status = PaymentStatus.FAILED;
    await this.paymentRepository.save(payment);
  }
  private async getAnnualInvestmentTotal(userId: string): Promise<number> {
    return this.mockAnnualInvestments.get(userId) || 0;
  }
  /*
    private async getAnnualInvestmentTotal(userId: string): Promise<number> {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear(), 11, 31);
      
      const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .where('payment.userId = :userId', { userId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
        startDate: startOfYear,
        endDate: endOfYear,
      })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();
      
      return result.total || 0;
    }
    */
  
}

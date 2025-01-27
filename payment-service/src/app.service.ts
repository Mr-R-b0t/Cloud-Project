import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe = new Stripe("sk_test_51QlrmzADAvlHx1odrFyfJ79IlTSAdz1m3gySvYUW0uRPRndgUcgeaaft7Um4VL6c5h91hPthfTNycVNufrFT5alp00bnKhqXVb", {
    apiVersion: '2024-12-18.acacia',
  });
  
  async topUpWallet(userId: number, amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Assume successful payment (handle webhook for real implementation)
    //await this.PaymentService.updateWalletBalance(userId, amount);
    return paymentIntent;
  }


  getHello(): string{
    return "HELLO";
  }
}

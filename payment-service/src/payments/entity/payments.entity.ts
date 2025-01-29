import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  stripePaymentId: string;

  @Column()
  amount: number;

  @Column()
  id: string;
}
export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
  }
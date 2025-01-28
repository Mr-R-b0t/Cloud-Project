import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryColumn('varchar', { length: 255 })
  stripePaymentId: string;

  //@ManyToOne(() => User)
  //user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: PaymentStatus;

  @Column()
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;
}


export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded'
  }
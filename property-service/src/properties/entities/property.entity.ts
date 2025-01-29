import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Funding } from './funding.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column()
  status: string;

  @Column()
  fundingDeadline: Date;

  @Column()
  fundings: Funding[];
}

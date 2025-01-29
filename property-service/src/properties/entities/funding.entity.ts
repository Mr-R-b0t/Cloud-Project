import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Funding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  amount: number;
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class Funding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(() => Property, (property) => property.fundings, {
    onDelete: 'CASCADE',
  })
  property: Property;
}

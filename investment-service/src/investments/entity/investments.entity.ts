import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['userId', 'propertyId'])
export class InvestmentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    propertyId: string;

    @Column('decimal')
    amount: number;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}
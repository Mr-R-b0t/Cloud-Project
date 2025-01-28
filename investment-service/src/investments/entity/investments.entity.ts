import { Column, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

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
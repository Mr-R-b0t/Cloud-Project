import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WalletEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    userId  : string;

    @Column()
    balance: number;
}
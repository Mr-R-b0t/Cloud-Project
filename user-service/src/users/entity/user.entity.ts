import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    walletBalance: number;
}
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {UserRoles} from "../../shared/utils/api-enums";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: UserRoles;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

}

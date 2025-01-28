import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import {UsersController} from "./controller/users.controller";
import {UsersService} from "./service/users.service";
import {WalletEntity} from "./entity/wallet.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, WalletEntity]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}

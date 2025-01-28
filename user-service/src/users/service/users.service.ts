import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { WalletDto} from "../controller/dto/wallet.dto";
import { UserDto } from '../controller/dto/user.dto';
import {WalletEntity} from "../entity/wallet.entity";
import {Logger} from "@nestjs/common";
import {WalletUpdateDto} from "../controller/dto/walletUpdate.dto";
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(WalletEntity) private readonly walletRepo: Repository<WalletEntity>,
    ) {}

    private readonly LOGGER = new Logger(UsersService.name);

    private userEntityToDto(user: Partial<UserEntity>): UserDto {
        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.email = user.email;
        userDto.firstname = user.firstname;
        userDto.lastname = user.lastname;
        userDto.role = user.role;
        return userDto;
    }

    // Create a user
    async createUser(user: UserEntity): Promise<UserDto> {
        this.LOGGER.log(`Creating user with email: ${JSON.stringify(user.email)}`);
        const createdUser = await this.userRepo.save(user);
        const wallet = new WalletDto();
        wallet.balance = 0;
        wallet.userId = createdUser.id;
        await this.walletRepo.save(wallet);
        return createdUser
    }

    // Fetch user by ID
    async getUserById(id: string): Promise<UserDto> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return this.userEntityToDto(user);
    }

    // Update user profile
    async updateProfile(id: string, updateData: Partial<UserEntity>): Promise<UserDto> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.update(id, updateData);
        return this.getUserById(id);
    }

    // Update wallet balance
    async updateWalletBalance(id: string, walletUpdate: WalletUpdateDto): Promise<number> {
        this.LOGGER.log(`Updating wallet balance for user with ID ${id} by ${JSON.stringify(walletUpdate.amount)}`);

        if (typeof walletUpdate.amount !== 'number' || isNaN(walletUpdate.amount)) {
            throw new Error(`Invalid amount: ${walletUpdate.amount}`);
        }

        const wallet = await this.walletRepo.findOne({ where: { userId: id } });

        if (!wallet) {
            throw new Error(`Wallet for user with ID ${id} not found`);
        }

        wallet.balance += walletUpdate.amount;
        await this.walletRepo.save(wallet);

        return wallet.balance;
    }


    // Get wallet balance
    async getWalletBalance(id: string): Promise<number> {
        const wallet = await this.walletRepo.findOne({ where: { userId: id } });
        if (!wallet) {
            throw new Error(`Wallet for user with ID ${id} not found`);
        }
        return wallet.balance;
    }

    // Update user role (admin feature)
    async updateUserRole(id: string, role: string): Promise<UserDto> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        user.role = role;
        await this.userRepo.save(user);
        return this.userEntityToDto(user);
    }

    // Delete user
    async deleteUser(id: string): Promise<boolean> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.delete({ id });
        return true;
    }

    // Fetch all users
    async getUsers(): Promise<UserDto[]> {
        const userEntity = await this.userRepo.find({
            select: ['id', 'firstname', 'lastname', 'email', 'role'],
        });
        return userEntity.map((user) => this.userEntityToDto(user));
    }
}

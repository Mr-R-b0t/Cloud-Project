import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../controller/dto/user.dto';
import { WalletEntity } from '../entity/wallet.entity';
import { WalletUpdateDto } from '../controller/dto/walletUpdate.dto';
import { CustomerUpdateDTO } from '../controller/dto/user.customer.update';
import * as bcrypt from 'bcrypt';
import {UserRoles} from "../../shared/utils/api-enums";

@Injectable()
export class UsersService {
    private readonly LOGGER = new Logger(UsersService.name);

    constructor(
        @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(WalletEntity) private readonly walletRepo: Repository<WalletEntity>,
    ) {}

    /**
     * Map a UserEntity to UserDto.
     */
    private userEntityToDto(user: Partial<UserEntity>): UserDto {
        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.email = user.email;
        userDto.firstname = user.firstname;
        userDto.lastname = user.lastname;
        userDto.role = user.role;
        return userDto;
    }

    /**
     * Create a user and initialize a wallet for them.
     */
    async createUser(user: UserEntity): Promise<UserDto> {
        this.LOGGER.log(`Creating user with email: ${user.email}`);

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);

        const createdUser = await this.userRepo.save(user);

        const wallet = new WalletEntity();
        wallet.balance = 0;
        wallet.userId = createdUser.id;
        await this.walletRepo.save(wallet);

        return this.userEntityToDto(createdUser);
    }

    /**
     * Fetch a user by ID.
     */
    async getUserById(id: string): Promise<UserDto> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return this.userEntityToDto(user);
    }

    /**
     * Fetch the wallet balance of a user by their ID.
     */
    async getWalletBalance(id: string): Promise<number> {
        const wallet = await this.walletRepo.findOne({ where: { userId: id } });
        if (!wallet) {
            throw new Error(`Wallet for user with ID ${id} not found`);
        }
        return wallet.balance;
    }

    /**
     * Fetch the wallet balance of the current user (via token-provided ID).
     */
    async walletBalanceMe(userId: string): Promise<number> {
        return this.getWalletBalance(userId);
    }

    /**
     * Update a user's wallet balance.
     */
    async updateWalletBalance(id: string, walletUpdate: WalletUpdateDto): Promise<number> {
        this.LOGGER.log(`Updating wallet balance for user ID ${id} by ${walletUpdate.amount}`);

        const wallet = await this.walletRepo.findOne({ where: { userId: id } });
        if (!wallet) {
            throw new Error(`Wallet for user with ID ${id} not found`);
        }

        wallet.balance += walletUpdate.amount;
        await this.walletRepo.save(wallet);

        return wallet.balance;
    }


    /**
     * Update a user's profile.
     */
    async updateProfile(id: string, updateData: CustomerUpdateDTO): Promise<UserDto> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        await this.userRepo.update(id, updateData);
        return this.getUserById(id);
    }

    /**
     * Update the profile of the current user (via token-provided ID).
     */
    async updateMe(userId: string, updateData: CustomerUpdateDTO): Promise<UserDto> {
        return this.updateProfile(userId, updateData);
    }

    /**
     * Delete a user by ID.
     */
    async deleteUser(id: string): Promise<boolean> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }

        await this.walletRepo.delete({ userId: id });
        await this.userRepo.delete({ id });

        this.LOGGER.log(`User with ID ${id} and associated wallet deleted`);
        return true;
    }

    /**
     * Delete the current user (via token-provided ID).
     */
    async deleteMe(userId: string): Promise<boolean> {
        return this.deleteUser(userId);
    }

    /**
     * Fetch all users.
     */
    async getUsers(): Promise<UserDto[]> {
        const users = await this.userRepo.find({
            select: ['id', 'firstname', 'lastname', 'email', 'role'],
        });
        return users.map((user) => this.userEntityToDto(user));
    }

    /**
     * Update a user's role (admin feature).
     */
    async updateUserRole(id: string, role: UserRoles): Promise<UserDto> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }

        user.role = role;
        await this.userRepo.save(user);

        this.LOGGER.log(`Updated role for user ID ${id} to ${role}`);
        return this.userEntityToDto(user);
    }
}

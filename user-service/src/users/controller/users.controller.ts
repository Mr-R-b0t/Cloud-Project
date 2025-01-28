import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Req
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserEntity } from '../entity/user.entity';
import { WalletUpdateDto } from './dto/walletUpdate.dto';
import { CustomerUpdateDTO } from './dto/user.customer.update';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Create a new user.
     */
    @Post('create')
    async createUser(@Body() user: UserEntity) {
        return await this.usersService.createUser(user);
    }

    /**
     * Get the details of the current user (from token).
     */
    @Get('me')
    async getMe(@Req() req: Request) {
        const userId = req['user'].id; // Assuming the user ID is extracted from the token middleware
        return await this.usersService.getUserById(userId);
    }

    /**
     * Get user details by ID (admin feature).
     */
    @Get('/profile/:id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id);
    }

    /**
     * Update the profile of the current user (from token).
     */
    @Patch('me/update')
    async updateMe(@Req() req: Request, @Body() updateData: CustomerUpdateDTO) {
        const userId = req['user'].id; // Assuming the user ID is extracted from the token middleware
        return await this.usersService.updateMe(userId, updateData);
    }

    /**
     * Update a user profile by ID (admin feature).
     */
    @Patch('update/:id')
    async updateUser(@Param('id') id: string, @Body() updateData: CustomerUpdateDTO) {
        return await this.usersService.updateProfile(id, updateData);
    }

    /**
     * Get the wallet balance of the current user (from token).
     */
    @Get('wallet/balance/me')
    async getWalletBalanceMe(@Req() req: Request) {
        const userId = req['user'].id; // Assuming the user ID is extracted from the token middleware
        return await this.usersService.walletBalanceMe(userId);
    }

    /**
     * Get wallet balance by user ID (admin feature).
     */
    @Get('wallet/balance/:id')
    async getWalletBalance(@Param('id') id: string) {
        return await this.usersService.getWalletBalance(id);
    }

    /**
     * Update wallet balance by user ID (admin feature).
     */
    @Patch('wallet/update/:id')
    async updateWalletBalance(
        @Param('id') id: string,
        @Body() walletUpdate: WalletUpdateDto
    ) {
        return await this.usersService.updateWalletBalance(id, walletUpdate);
    }

    /**
     * Delete the current user (from token).
     */
    @Delete('me')
    async deleteMe(@Req() req: Request) {
        const userId = req['user'].id; // Assuming the user ID is extracted from the token middleware
        return await this.usersService.deleteMe(userId);
    }

    /**
     * Delete a user by ID (admin feature).
     */
    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id);
    }

    /**
     * Get a list of all users (admin feature).
     */
    @Get('retrieve/all')
    async getAllUsers() {
        return await this.usersService.getUsers();
    }

    /**
     * Update the role of a user (admin feature).
     */
    @Patch('role/update/:id')
    async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
        return await this.usersService.updateUserRole(id, role);
    }
}

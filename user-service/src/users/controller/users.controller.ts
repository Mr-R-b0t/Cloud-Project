import { Controller, Get, Post, Patch,Delete,Body} from '@nestjs/common';

import {UsersService} from "../service/users.service";
import {UserEntity} from "../entity/user.entity";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get('me')
    async getMe(@Body('id') id: string){
        return await this.userService.getMe( id);
    }

    @Delete('me/delete')
    async deleteMe(@Body('id') id: string){
        return await this.userService.deleteMe(id);
    }

    @Patch('me/update')
    async updateMe(@Body('id') id: string, @Body('updateData') updateData: Partial<UserEntity>) {
        return await this.userService.updateMe( id, updateData);
    }

    @Post('create')
    async createUser(@Body('user') user: Partial<UserEntity>){
        return await this.userService.createUser(user);
    }

    @Get('getById')
    async getUserById(@Body('id') id: string){
        return await this.userService.getUserById(id);
    }

    @Patch('updateProfile')
    async updateProfile(@Body('id') id: string, @Body('updateData') updateData: Partial<UserEntity>){
        return await this.userService.updateProfile(id, updateData);
    }

    @Patch('updateWalletBalance')
    async updateWalletBalance(@Body('id') id: string, @Body('amount') amount: number){
        return await this.userService.updateWalletBalance(id, amount);
    }

    @Get('getWalletBalance')
    async getWalletBalance(@Body('id') id: string){
        return await this.userService.getWalletBalance(id);
    }

    @Patch('updateUserRole')
    async updateUserRole(@Body('id') id: string, @Body('role') role: string){
        return await this.userService.updateUserRole(id, role);
    }

}



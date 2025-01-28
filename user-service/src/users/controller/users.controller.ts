import { Controller, Get, Post, Patch, Delete, Body, Param} from '@nestjs/common';
import {Logger} from "@nestjs/common";
import {UsersService} from "../service/users.service";
import {UserEntity} from "../entity/user.entity";
import {WalletUpdateDto} from "./dto/walletUpdate.dto";

@Controller('users')
export class UsersController {

    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly userService: UsersService) {}

    @Get('me')
    async getMe(@Param('id') id: string){
        return await this.userService.getMe( id);
    }

    @Delete('me/delete')
    async deleteMe(@Param('id') id: string){
        return await this.userService.deleteMe(id);
    }

    @Patch('me/update')
    async updateMe(@Param('id') id: string, @Body() updateData: Partial<UserEntity>) {
        return await this.userService.updateMe( id, updateData);
    }

    @Post('create')
    async createUser(@Body() user: UserEntity){
        this.logger.log(`Creating user with email: ${JSON.stringify(user)}`);
        return await this.userService.createUser(user);
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string){
        return await this.userService.getUserById(id);
    }

    @Patch('/update/:id')
    async updateProfile(@Param('id') id: string, @Body() updateData: Partial<UserEntity>){
        return await this.userService.updateProfile(id, updateData);
    }

    @Patch('wallet/update/:id')
    async updateWalletBalance(@Param('id') id: string, @Body() walletUpdate: WalletUpdateDto){
        return await this.userService.updateWalletBalance(id, walletUpdate);
    }

    @Get('wallet/balance/:id')
    async getWalletBalance(@Param('id') id: string){
        return await this.userService.getWalletBalance(id);
    }

    @Patch('role/update/:id')
    async updateUserRole(@Param('id') id: string, @Body() role: string){
        return await this.userService.updateUserRole(id, role);
    }

    @Get('/retrieve/all')
    async getAllUsers(){
        return await this.userService.getUsers();
    }

}



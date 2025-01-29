import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Req,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserEntity } from '../entity/user.entity';
import { WalletUpdateDto } from './dto/walletUpdate.dto';
import { CustomerUpdateDTO } from './dto/user.customer.update';
import { Request } from 'express';
import { UserRoles } from '../../shared/utils/api-enums';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    private readonly LOGGER = new Logger(UsersService.name);

    private decodeBase64Jwt(token: string): any {
        const payload = token.split('.')[1];
        return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    }

    private extractUserIdFromRequest(req: Request): string {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }
        const token = authHeader.split(' ')[1];
        return this.decodeBase64Jwt(token).userId;
    }

    @Post('create')
    async createUser(@Body() user: UserEntity) {
        return await this.usersService.createUser(user);
    }

    @Get('me')
    async getMe(@Req() req: Request) {
        const userId = this.extractUserIdFromRequest(req);
        return await this.usersService.getUserById(userId);
    }

    @Get('/profile/:id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id);
    }

    @Patch('me/update')
    async updateMe(@Req() req: Request, @Body() updateData: CustomerUpdateDTO) {
        const userId = this.extractUserIdFromRequest(req);
        return await this.usersService.updateMe(userId, updateData);
    }

    @Patch('update/:id')
    async updateUser(@Param('id') id: string, @Body() updateData: CustomerUpdateDTO) {
        return await this.usersService.updateProfile(id, updateData);
    }

    @Get('wallet/me/balance')
    async getWalletBalanceMe(@Req() req: Request) {
        const userId = this.extractUserIdFromRequest(req);
        return await this.usersService.walletBalanceMe(userId);
    }

    @Get('wallet/balance/:id')
    async getWalletBalance(@Param('id') id: string) {
        return await this.usersService.getWalletBalance(id);
    }

    @Patch('wallet/update/:id')
    async updateWalletBalance(@Param('id') id: string, @Body() walletUpdate: WalletUpdateDto) {
        return await this.usersService.updateWalletBalance(id, walletUpdate);
    }

    @Delete('me')
    async deleteMe(@Req() req: Request) {
        const userId = this.extractUserIdFromRequest(req);
        return await this.usersService.deleteMe(userId);
    }

    @Delete('profile/:id')
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(id);
    }

    @Get('retrieve/all')
    async getAllUsers() {
        return await this.usersService.getUsers();
    }

    @Patch('role/update/:id')
    async updateUserRole(@Param('id') id: string, @Body('role') role: UserRoles) {
        return await this.usersService.updateUserRole(id, role);
    }
}

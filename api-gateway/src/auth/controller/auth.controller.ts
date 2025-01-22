import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "../service/auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() user: any) {
        return await this.authService.login(user);
    }

    @Post('refresh')
    async refreshToken(@Body('refresh_token') token: string) {
        return await this.authService.refresh(token);
    }

    @Post('logout')
    async logout(@Body('refresh_token') token: string) {
        return await this.authService.logout(token);
    }
}

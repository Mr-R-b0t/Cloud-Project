import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { AuthConfig } from './auth.config';
import {UserEntity} from "./entity/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity,UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule, ConfigModule.forFeature(AuthConfig)],
      useFactory: async (configService: ConfigService) => ({
        secret: Buffer.from(configService.get<string>('auth.secret'), 'base64'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

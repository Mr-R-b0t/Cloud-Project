import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtUser } from './interfaces/jwt-user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entity/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @InjectRepository(RefreshTokenEntity)
  private readonly refreshTokenRepo: Repository<RefreshTokenEntity>;

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        configService.get<string>('JWT_SECRET_KEY_BASE64'),
        'base64',
      ),
    });
  }

  async validate(token: JwtUser) {
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: {
        user: {
          id: token.userId,
        },
      },
      relations: ['user'],
    });
    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    return refreshToken.user;
  }
}

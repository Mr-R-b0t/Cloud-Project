import {Injectable, Logger, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {RefreshTokenEntity} from "../entity/refresh-token.entity";
import * as bcrypt from 'bcrypt';
import {ErrorEnum, ErrorMessageEnum} from "../../shared/utils/error.enum";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {LoginDto} from "../controller/dto/login.dto";
import {JwtUser} from "../interfaces/jwt-user.interface";
import {UserEntity} from "../entity/user.entity";

@Injectable()
export class AuthService {

    private readonly LOGGER = new Logger(AuthService.name);

    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>;

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>;

    constructor(private readonly jwtService: JwtService) {
    }

    async login(loginDto: LoginDto) {

        const user = await this.userRepository.findOne({ where: { email: loginDto.email}});
        if (!user) {
            throw new NotFoundException(`User with email ${loginDto.email} not found`);
        }

        this.LOGGER.log(user.password);

        if (!(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException();
        }

        this.LOGGER.log(`User ${user.email} logged in`);

        return this.getToken(user);
    }

    async getToken(user: UserEntity) {
        let refreshToken = new RefreshTokenEntity();
        refreshToken.user = user;
        refreshToken.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

        refreshToken = await this.refreshTokenRepository.save(refreshToken);
        return {
            access_token: this.jwtService.sign(<JwtUser>{
                userId: user.id,
                email: user.email,
                role: user.role
            }),
            refresh_token: Buffer.from(refreshToken.id).toString('base64'),
            token_type: 'Bearer',
        };
    }

    async refresh(refreshToken: string) {
        refreshToken = Buffer.from(refreshToken, 'base64').toString();
        const refreshTokenEntity = await this.refreshTokenRepository.findOne({
            relations: ['userAuthentication', 'userAuthentication.user'],
            where: {id: refreshToken},
        });
        if (!refreshTokenEntity) {
            throw new UnauthorizedException({
                code: ErrorEnum.invalid_refresh_token,
                message: ErrorMessageEnum.invalid_refresh_token,
            });
        }
        await this.refreshTokenRepository.delete(refreshToken);
        return await this.getToken(refreshTokenEntity.user);
    }

    async logout(refreshToken: string) {
        refreshToken = Buffer.from(refreshToken, 'base64').toString();
        const refreshTokenEntity = await this.refreshTokenRepository.findOne({
            relations: ['userAuthentication'],
            where: { id: refreshToken },
        });
        if (!refreshTokenEntity) {
            throw new UnauthorizedException({
                code: ErrorEnum.invalid_refresh_token,
                message: ErrorMessageEnum.invalid_refresh_token,
            });
        }
        await this.refreshTokenRepository.delete(refreshTokenEntity);
        return {
            message: 'Successfully logged out',
        };
    }
}

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  private readonly configService = new ConfigService();

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      req.user = jwt.verify(token, Buffer.from(
          this.configService.get<string>('JWT_SECRET_KEY_BASE64'),
          'base64',
      ));
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token', err);
    }
  }
}

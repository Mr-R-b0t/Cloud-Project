import {
  NestMiddleware,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import {RoleWeight, UserRoles} from 'src/shared/utils/api-enums';
import {ErrorEnum, ErrorMessageEnum} from "../../shared/utils/error.enum";

export class RoleMiddleware implements NestMiddleware {
  constructor(private readonly requiredRole: UserRoles) {}

  use(req, res, next) {
    if (!req.user) {
      throw new InternalServerErrorException(
        'Must use auth middleware on this route before the user middleware',
      );
    }

    console.log('req.user', req.user);

    const userWeight = RoleWeight[this.requiredRole];
    const roleWeight = RoleWeight[req.user.role];
    console.log('userWeight', userWeight);
    console.log('roleWeight', roleWeight);
    if (Number(userWeight) < Number(roleWeight)) {
      throw new ForbiddenException({
        code: ErrorEnum.access_denied,
        message: ErrorMessageEnum.access_denied,
      });
    }
    next();
  }
}

export function createRoleMiddleware(requiredRole: UserRoles) {
  return (req, res, next) => {
    const middleware = new RoleMiddleware(requiredRole);
    middleware.use(req, res, next);
  };
}

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  mixin,
} from '@nestjs/common';
import {RoleWeight, UserRoles} from "../../shared/utils/api-enums";
import {ErrorEnum, ErrorMessageEnum} from "../../shared/utils/error.enum";

export const RoleGuard = (role: UserRoles) => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      if (!request.user) {
        throw new InternalServerErrorException(
            'Must use auth guard on this route before the user guard',
        );
      }
      const userWeight = RoleWeight[role];
      const roleWeight = RoleWeight[request.user.role];
      if (Number(userWeight) < Number(roleWeight)) {
        throw new ForbiddenException({
          code: ErrorEnum.access_denied,
          message: ErrorMessageEnum.access_denied,
        });
      }
      return true;
    }
  }

  return mixin(RoleGuardMixin) as never;
};


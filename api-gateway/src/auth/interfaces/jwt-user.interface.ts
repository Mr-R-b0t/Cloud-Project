import {UserRoles} from "../../shared/utils/api-enums";

export interface JwtUser {
  userId: string;
  email: string;
  role: UserRoles;
}

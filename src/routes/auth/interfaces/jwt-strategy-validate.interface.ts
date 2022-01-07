import { RolesEnum } from '@decorators/roles.decorator';

export interface JwtStrategyValidate {
  userId: string;
  email: string;
  role: RolesEnum;
}

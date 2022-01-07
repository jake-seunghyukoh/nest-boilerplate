import { RolesEnum } from '@decorators/roles.decorator';

export interface JwtDecodeResponse {
  id: number;
  username: string;
  role: RolesEnum;
  iat: number;
  exp: number;
}

import { RolesEnum } from '@decorators/roles.decorator';

export interface ValidateUserOutput {
  userId: string;
  email?: string;
  role?: RolesEnum;
}

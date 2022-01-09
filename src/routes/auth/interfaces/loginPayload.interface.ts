import { RolesEnum } from '@decorators/roles.decorator';

export interface LoginPayload {
  readonly userId?: string;

  readonly email?: string;

  readonly role?: RolesEnum;
}

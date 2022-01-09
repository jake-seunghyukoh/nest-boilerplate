/* eslint-disable max-classes-per-file */
import { RolesEnum } from '@decorators/roles.decorator';
import { PaginationParamsInterface } from '@interfaces/paginationParams.interface';
import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class UserResponseEntity {
  userId: string;

  role: RolesEnum = RolesEnum.user;

  verified = false;

  email = '';

  @Exclude()
  password = '';
}

export class AllUsersResponseEntity {
  @ValidateNested({ each: true })
  @Type(() => UserResponseEntity)
  data?: [] = [];

  collectionName?: string = '';

  options?: {
    location: string;
    paginationParams: PaginationParamsInterface;
    totalCount: number;
  };
}

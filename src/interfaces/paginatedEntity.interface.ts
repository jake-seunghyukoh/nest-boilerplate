import { UserEntity } from '@routes/users/schemas/user.entity';

export interface PaginatedUsersInterface {
  readonly paginatedResult: UserEntity[] | [];
  readonly totalCount: number;
}

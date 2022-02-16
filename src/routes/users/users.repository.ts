import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';
import { PaginationParamsInterface } from '@interfaces/paginationParams.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '@routes/auth/dtos/signUp.dto';
import PaginationUtils from '@utils/pagination.utils';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import UpdateUserDto from './dtos/updateUser.dto';
import { UserEntity } from './schemas/user.entity';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersModel: Repository<UserEntity>,
  ) {}

  public create(dto: SignUpDto): Promise<UserEntity> {
    return this.usersModel.save({
      ...dto,
      verified: false,
    });
  }

  public insert(dto: SignUpDto): Promise<InsertResult> {
    return this.usersModel.insert({ ...dto, verified: false });
  }

  public updateById(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    return this.usersModel.update(id, data);
  }

  public getById(id: string): Promise<UserEntity> {
    return this.usersModel.findOne(id);
  }

  public getByEmail(email: string): Promise<UserEntity> {
    return this.usersModel.findOne({ email });
  }

  public getVerifiedUserById(id: string): Promise<UserEntity> {
    return this.usersModel.findOne({ id, verified: true });
  }

  public getVerifiedUserByEmail(email: string): Promise<UserEntity> {
    return this.usersModel.findOne({ email, verified: true });
  }

  public getUnverifiedUserById(id: string): Promise<UserEntity> {
    return this.usersModel.findOne({ id, verified: false });
  }

  public deleteById(id: string): Promise<DeleteResult> {
    return this.usersModel.delete(id);
  }

  public async getAllVerifiedWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedUsersInterface> {
    const verified = true;
    const [users, totalCount] = await Promise.all([
      this.usersModel.find({
        where: {
          verified,
        },
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.usersModel.count({
        where: { verified },
      }),
    ]);

    return { paginatedResult: users, totalCount };
  }
}

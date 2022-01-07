import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import UpdateUserDto from './dtos/update-user.dto';
import { UserEntity } from './schemas/user.entity';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersModel: Repository<UserEntity>,
  ) {}

  public create(dto: SignUpDto): Promise<UserEntity> {
    return this.usersModel.save({ ...dto, verified: false });
  }

  public insert(dto: SignUpDto): Promise<InsertResult> {
    return this.usersModel.insert({ ...dto, verified: false });
  }

  public updateById(
    userId: string,
    data: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersModel.update(userId, data);
  }

  public getById(userId: string): Promise<UserEntity> {
    return this.usersModel.findOne(userId);
  }

  public getByEmail(email: string): Promise<UserEntity> {
    return this.usersModel.findOne({ email });
  }

  public getVerifiedUserById(userId: string): Promise<UserEntity> {
    return this.usersModel.findOne({ userId, verified: true });
  }

  public getVerifiedUserByEmail(email: string): Promise<UserEntity> {
    return this.usersModel.findOne({ email, verified: true });
  }

  public getUnverifiedUserById(userId: string): Promise<UserEntity> {
    return this.usersModel.findOne({ userId, verified: false });
  }

  public deleteById(userId: string): Promise<DeleteResult> {
    return this.usersModel.delete(userId);
  }
}

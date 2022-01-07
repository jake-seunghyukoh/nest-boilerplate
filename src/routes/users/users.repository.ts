import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import UpdateUserDto from './dtos/update-user.dto';
import { User } from './schemas/user.entity';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersModel: Repository<User>,
  ) {}

  public create(dto: SignUpDto): Promise<User> {
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

  public getById(userId: string): Promise<User> {
    return this.usersModel.findOne(userId);
  }

  public getByEmail(email: string): Promise<User> {
    return this.usersModel.findOne({ email });
  }

  public getVerifiedUserById(userId: string): Promise<User> {
    return this.usersModel.findOne({ userId, verified: true });
  }

  public getVerifiedUserByEmail(email: string): Promise<User> {
    return this.usersModel.findOne({ email, verified: true });
  }

  public getUnverifiedUserById(userId: string): Promise<User> {
    return this.usersModel.findOne({ userId, verified: false });
  }

  public deleteById(userId: string): Promise<DeleteResult> {
    return this.usersModel.delete(userId);
  }
}

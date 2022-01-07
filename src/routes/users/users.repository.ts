import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { User } from './schemas/user.entity';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersModel: Repository<User>,
  ) {}

  public create(dto: SignUpDto): Promise<User> {
    return this.usersModel.save({ ...dto });
  }

  public insert(dto: SignUpDto): Promise<InsertResult> {
    return this.usersModel.insert({ ...dto });
  }

  public getById(userId: string): Promise<User> {
    return this.usersModel.findOne(userId);
  }

  public getByUsername(username: string): Promise<User> {
    return this.usersModel.findOne({ username });
  }

  public deleteById(userId: string): Promise<DeleteResult> {
    return this.usersModel.delete(userId);
  }
}

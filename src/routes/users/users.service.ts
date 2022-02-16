import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';
import { Injectable } from '@nestjs/common';
import { SignUpDto } from '@routes/auth/dtos/signUp.dto';
import * as bcrypt from 'bcrypt';
import { FindManyOptions, UpdateResult } from 'typeorm';
import UpdateUserDto from './dtos/updateUser.dto';
import { UserEntity } from './schemas/user.entity';
import UsersRepository from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(signUpDto: SignUpDto): Promise<UserEntity> {
    const { password, ...others } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.usersRepository.create({
      password: hashedPassword,
      ...others,
    });
  }

  update(id: string, data: UpdateUserDto): Promise<UpdateResult> {
    return this.usersRepository.updateById(id, data);
  }

  public getUser(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  public getVerifiedUserById(id: string) {
    return this.usersRepository.getVerifiedUserById(id);
  }

  public getVerifiedUserByEmail(email: string) {
    return this.usersRepository.getVerifiedUserByEmail(email);
  }

  public getUnverifiedUserById(id: string) {
    return this.usersRepository.getUnverifiedUserById(id);
  }

  public async getAllVerifiedWithPagination(
    options: FindManyOptions<UserEntity>,
  ): Promise<PaginatedUsersInterface> {
    return this.usersRepository.getAllVerifiedWithPagination(options);
  }
}

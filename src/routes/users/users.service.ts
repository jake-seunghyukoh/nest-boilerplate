import { Injectable } from '@nestjs/common';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { UpdateResult } from 'typeorm';
import UpdateUserDto from './dtos/update-user.dto';
import { UserEntity } from './schemas/user.entity';
import UsersRepository from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(signUpDto: SignUpDto): Promise<UserEntity> {
    const { email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.usersRepository.create({
      email: email,
      password: hashedPassword,
    });
  }

  update(userId: string, data: UpdateUserDto): Promise<UpdateResult> {
    return this.usersRepository.updateById(userId, data);
  }

  public getUser(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  public getVerifiedUserById(userId: string) {
    return this.usersRepository.getVerifiedUserById(userId);
  }

  public getVerifiedUserByEmail(email: string) {
    return this.usersRepository.getVerifiedUserByEmail(email);
  }

  public getUnverifiedUserById(userId: string) {
    return this.usersRepository.getUnverifiedUserById(userId);
  }
}

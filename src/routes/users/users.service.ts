import { Injectable } from '@nestjs/common';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.entity';
import UsersRepository from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.usersRepository.create({
      email: email,
      password: hashedPassword,
    });
  }

  async getUser(email: string) {
    return this.usersRepository.getByEmail(email);
  }
}

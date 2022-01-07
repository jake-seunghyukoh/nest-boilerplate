import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { User } from '@routes/users/schemas/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import UsersRepository from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private logger = new Logger('UsersService');

  async createUser(signUpDto: SignUpDto): Promise<any> {
    const { username, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());

    return this.usersRepository
      .insert({
        username: username,
        password: hashedPassword,
      })
      .catch((err) => {
        this.logger.error(`createUser :: ${err}`);
        return null;
      });
  }

  async getUser(username: string) {
    return this.usersRepository.getByUsername(username);
  }
}

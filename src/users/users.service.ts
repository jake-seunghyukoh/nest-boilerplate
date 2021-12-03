import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/auth/dtos/sign-up.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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
    return this.usersRepository.findOne({
      where: { username: username },
    });
  }
}

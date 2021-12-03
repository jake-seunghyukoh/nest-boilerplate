import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.usersService.getUser(username);
    if (user) {
      const realPassword = user.password;

      const valid = await bcrypt.compare(password, realPassword);

      if (valid) return user;
      else return null;
    } else return null;
  }

  async signUp(signUpDto: SignUpDto): Promise<boolean> {
    const result = await this.usersService.createUser(signUpDto);
    return result ? true : false;
  }

  async signIn(user: User): Promise<string> {
    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }
}

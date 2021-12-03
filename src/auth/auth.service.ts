import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { use } from 'passport';
import { JwtService } from '@nestjs/jwt';

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

  async signIn(user: User): Promise<string> {
    const payload = { username: user.username };
    return this.jwtService.sign(payload);
  }
}

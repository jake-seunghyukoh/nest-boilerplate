import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { User } from '@routes/users/schemas/user.entity';
import { UsersService } from '@routes/users/users.service';
import * as bcrypt from 'bcrypt';

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

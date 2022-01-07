import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@routes/users/users.service';
import * as bcrypt from 'bcrypt';
import { authConstants } from './auth-constants';
import { ValidateUserOutput } from './interfaces/validate-user-output.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<ValidateUserOutput | null> {
    const user = await this.usersService.getVerifiedUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User with given email does not exist');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      return {
        id: user.userId,
        email: user.email,
        role: user.role,
      };
    }

    return null;
  }

  public createVerifyToken(id: string): string {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: authConstants.jwt.expirationTime.accessToken,
        secret: authConstants.jwt.secrets.accessToken,
      },
    );
  }

  public verifyTokenWithSecret(token: string, secret: string) {
    return this.jwtService.verifyAsync(token, { secret });
  }
}

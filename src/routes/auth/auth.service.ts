import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@routes/users/users.service';
import * as bcrypt from 'bcrypt';
import { authConstants } from './auth.constants';
import AuthRepository from './auth.repository';
import { LoginPayload } from './interfaces/loginPayload.interface';
import { ValidateUserOutput } from './interfaces/validateUserOutput.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
  ) {}

  async validateUser(
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
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    return null;
  }

  async login(payload: LoginPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.accessToken,
      secret: authConstants.jwt.secrets.accessToken,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: authConstants.jwt.expirationTime.refreshToken,
      secret: authConstants.jwt.secrets.refreshToken,
    });

    await this.authRepository.addRefreshToken(
      payload.email as string,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  getRefreshTokenByEmail(email: string): Promise<string | null> {
    return this.authRepository.getToken(email);
  }

  deleteAllTokens(): Promise<string> {
    return this.authRepository.removeAllTokens();
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

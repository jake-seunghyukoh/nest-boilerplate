import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authConstants } from './auth-constants';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  public createVerifyToken(id: string): string {
    return this.jwtService.sign(
      { id },
      {
        expiresIn: authConstants.jwt.expirationTime.accessToken,
        secret: authConstants.jwt.secrets.accessToken,
      },
    );
  }
}

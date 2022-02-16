import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { authConstants } from '@routes/auth/auth.constants';
import { JwtStrategyValidate } from '@routes/auth/interfaces/jwtStrategyValidate.interface';
import { UserEntity } from '@routes/users/schemas/user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConstants.jwt.secrets.accessToken,
    });
  }

  async validate(payload: UserEntity): Promise<JwtStrategyValidate> {
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  }
}

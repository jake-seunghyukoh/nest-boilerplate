import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@routes/auth/auth.controller';
import { AuthService } from '@routes/auth/auth.service';
import { authConstants } from '@routes/auth/authConstants';
import JwtRefreshStrategy from '@routes/auth/strategies/jwtRefresh.strategy';
import { LocalStrategy } from '@routes/auth/strategies/local.strategy';
import { UsersModule } from '@routes/users/users.module';
import AuthRepository from './auth.repository';
import JwtAccessStrategy from './strategies/jwtAccess.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: authConstants.jwt.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}

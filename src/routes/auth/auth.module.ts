import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authConstants } from '@routes/auth/auth-constants';
import { AuthController } from '@routes/auth/auth.controller';
import { AuthService } from '@routes/auth/auth.service';
import { JwtStrategy } from '@routes/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@routes/auth/strategies/local.strategy';
import { UsersModule } from '@routes/users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: authConstants.jwt.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

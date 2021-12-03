import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ThrottlerModule.forRoot({ ttl: 60, limit: 30 }), AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

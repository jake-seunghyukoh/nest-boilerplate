import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@routes/users/schemas/user.entity';
import { UsersService } from '@routes/users/users.service';
import { UsersController } from './users.controller';
import UsersRepository from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

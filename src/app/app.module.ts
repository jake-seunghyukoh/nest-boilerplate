import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from '../routes/auth/auth.module';
import { UsersModule } from '../routes/users/users.module';
import { TasksService } from '../routes/tasks/tasks.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 30 }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [TasksService],
})
export class AppModule {}

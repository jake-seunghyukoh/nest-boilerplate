import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { authConstants } from '@routes/auth/auth.constants';
import { AuthService } from '@routes/auth/auth.service';
import { AuthController } from '@routes/auth/controllers/auth.controller';
import { UsersService } from '@routes/users/users.service';
import { MockedConnection } from 'src/connection';
import AuthRepository from '../auth.repository';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: authConstants.jwt.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getConnectionToken(),
          useClass: MockedConnection,
        },
        AuthRepository,
        {
          provide: 'UsersRepository',
          useClass: class MockedRepository {},
        },
        {
          provide: 'RedisModule',
          useClass: class MockedRedisModule {},
        },
        {
          provide: 'RedisService',
          useClass: class MockedRedisService {
            getClient() {
              return null;
            }
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

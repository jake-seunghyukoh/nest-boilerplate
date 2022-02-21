import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { AuthService } from '@routes/auth/auth.service';
import { UsersService } from '@routes/users/users.service';
import { MockedConnection } from 'src/connection';
import { authConstants } from './auth.constants';
import AuthRepository from './auth.repository';

describe('AuthService', () => {
  let service: AuthService;

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
        AuthRepository,
        UsersService,
        {
          provide: getConnectionToken(),
          useClass: MockedConnection,
        },
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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

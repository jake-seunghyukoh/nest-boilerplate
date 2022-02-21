import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '@routes/auth/auth.service';
import { UserEntity } from '@routes/users/schemas/user.entity';
import UsersRepository from '@routes/users/users.repository';
import { UsersService } from '@routes/users/users.service';
import { MockedRepository, MockRepository } from 'src/mock';
import { authConstants } from './auth.constants';
import AuthRepository from './auth.repository';

describe('AuthService', () => {
  let service: AuthService;
  let usersModel: MockRepository<UserEntity>;

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
        UsersService,
        UsersRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: MockedRepository(),
        },
        AuthService,
        AuthRepository,
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
    usersModel = module.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersModel).toBeDefined();
  });
});

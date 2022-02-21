import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { authConstants } from '@routes/auth/auth.constants';
import { AuthService } from '@routes/auth/auth.service';
import { AuthController } from '@routes/auth/controllers/auth.controller';
import { UserEntity } from '@routes/users/schemas/user.entity';
import UsersRepository from '@routes/users/users.repository';
import { MockedRepository } from 'src/mock';
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
        UsersRepository,
        {
          provide: 'UsersService',
          useClass: class MockedService {},
        },
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
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

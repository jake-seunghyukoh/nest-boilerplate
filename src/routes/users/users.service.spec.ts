import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '@routes/users/users.service';
import { MockedRepository, MockRepository } from 'src/mock';
import { UserEntity } from './schemas/user.entity';
import UsersRepository from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let usersModel: MockRepository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: MockedRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersModel = module.get<MockRepository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersModel).toBeDefined();
  });
});

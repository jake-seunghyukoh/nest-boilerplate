import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { UsersService } from '@routes/users/users.service';
import { MockedConnection } from 'src/connection';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersService,
        {
          provide: getConnectionToken(),
          useClass: MockedConnection,
        },
        {
          provide: 'UsersRepository',
          useClass: class MockedRepository {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

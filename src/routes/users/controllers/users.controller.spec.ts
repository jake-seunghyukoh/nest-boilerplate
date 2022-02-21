import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { MockedConnection } from 'src/connection';
import { UsersService } from '../users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
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

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

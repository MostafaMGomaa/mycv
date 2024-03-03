import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string): Promise<User[]> => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      findOne: (id: number): Promise<User> => {
        return Promise.resolve({
          id,
          email: 'gomaamostafa26@gmail.com',
          password: 'asdf',
        } as User);
      },
      // update:() => {},
      // delete:() => {}
    };
    fakeAuthService = {
      // signup :() => {},
      // signin :() => {
    };
    // Isolated DI container.
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

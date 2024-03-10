import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { NotFoundException } from '@nestjs/common';

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
      signin: (email: string, password: string): Promise<User> =>
        Promise.resolve({ id: 1, email, password } as User),
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

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('mostafa@email.com');
    expect(users).toHaveLength(1);
    expect(users[0].email).toEqual('mostafa@email.com');
  });

  it('findUser returns a user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('findUser throws as error if user with given with given di not found', async () => {
    fakeUsersService.findOne = () => null;

    const user = controller.findUser('1');
    await expect(user).rejects.toThrow(NotFoundException);
  });

  it('signin updates session and return user', async () => {
    const seesion = { userId: -1 };

    const user = await controller.signin(
      { email: 'mostafa@email.com', password: '12345' },
      seesion,
    );

    expect(user.id).toEqual(1);
    expect(user.email).toEqual('mostafa@email.com');
    expect(seesion.userId).toEqual(1);
  });
});

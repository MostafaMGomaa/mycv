import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  let users: User[] = [];

  beforeEach(async () => {
    // Mock user service.
    fakeUserService = {
      find: (email: string): Promise<User[]> => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string): Promise<User> => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
    users = [];
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('mostafa@email.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is in use', async () => {
    await service.signup('mostafa@email.com', 'correctPassword');
    await expect(
      service.signup('mostafa@email.com', 'anotherPassword'),
    ).rejects.toThrow(BadRequestException);
  });

it('throws if signin is called with an unused email', async () => {
  await expect(
    service.signin('nonexistent@email.com', 'password'),
  ).rejects.toThrow(NotFoundException);
});


  it('throws if an invalid password is provided during signin', async () => {
    await service.signup('gomaamostafa26@gmail.com', '123456789');
    await expect(
      service.signin('gomaamostafa26@gmail.com', '12345'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if a correct password is provided during signin', async () => {
    // Salted and hashed password.
    await service.signup('mostafa2@email.com', '123456789');
    const user = await service.signin('mostafa2@email.com', '123456789');
    expect(user).toBeDefined();
    expect(user.email).toEqual('mostafa2@email.com');
  });
});

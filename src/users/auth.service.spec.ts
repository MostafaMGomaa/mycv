import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    // Mock user service.
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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

  it('throw an error if user signs up with email that is in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 1, email: 'mostafa@mail.com', password: 'Passw@rd' } as User,
      ]);

    await expect(
      service.signup('mostafa@email.com', 'password'),
    ).rejects.toThrow();
  });

  it('throws if signin is called with an unuse email', async () => {
    await expect(
      service.signin('mostafa@email.com', 'password'),
    ).rejects.toThrow();
  });

  it('throws if an invalid password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          email: 'mostafa@email.com',
          password: '123456789',
        } as User,
      ]);

    await expect(service.signin('mostafa@email.com', '1234')).rejects.toThrow(
      BadRequestException,
    );
  });
});

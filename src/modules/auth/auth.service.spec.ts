import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersService } from '@modules/users/users.service';
import { HashingService } from '@modules/hashing/hashing.service';
import { CreateUserDto } from '@modules/users/dto/create.dto';
import { IUser } from '@type/user.interface';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let hashingService: HashingService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useValue: {
            comparePasswords: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    hashingService = module.get<HashingService>(HashingService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      const user: IUser = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'testuser',
        about: 'Test user',
        avatar: 'https://i.pravatar.cc/300',
        email: 'test@example.com',
        password: 'hashedpassword',
        wishes: [],
        offers: [],
        wishlists: [],
      };
      const password = 'password';
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);
      jest.spyOn(hashingService, 'comparePasswords').mockResolvedValue(true);

      expect(await service.validateUser(user.username, password)).toBe(user);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const user: IUser = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'testuser',
        about: 'Test user',
        avatar: 'https://i.pravatar.cc/300',
        email: 'test@example.com',
        password: 'hashedpassword',
        wishes: [],
        offers: [],
        wishlists: [],
      };
      const password = 'wrongpassword';
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);
      jest.spyOn(hashingService, 'comparePasswords').mockResolvedValue(false);

      await expect(
        service.validateUser(user.username, password),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistentuser', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const user: IUser = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: 'testuser',
        about: 'Test user',
        avatar: 'https://i.pravatar.cc/300',
        email: 'test@example.com',
        password: 'hashedpassword',
        wishes: [],
        offers: [],
        wishlists: [],
      };
      const accessToken = 'access_token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(accessToken);

      expect(await service.signIn(user)).toEqual({ access_token: accessToken });
    });
  });

  describe('signUp', () => {
    it('should create a new user and return it', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
        email: 'test@example.com',
        about: 'Test user',
        avatar: 'https://i.pravatar.cc/300',
      };
      const newUser: IUser = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: createUserDto.username,
        about: createUserDto.about,
        avatar: createUserDto.avatar,
        email: createUserDto.email,
        password: 'hashedpassword',
        wishes: [],
        offers: [],
        wishlists: [],
      };
      jest.spyOn(userService, 'createUser').mockResolvedValue(newUser);

      expect(await service.signUp(createUserDto)).toEqual(newUser);
    });
  });
});

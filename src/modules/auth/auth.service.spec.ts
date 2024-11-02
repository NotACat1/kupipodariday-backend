import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

import { UsersService } from '@modules/users/users.service';
import { HashingService } from '@modules/hashing/hashing.service';
import { CreateUserDto } from '@modules/users/dto/create.dto';
import { IUser } from '@type/user.interface';

import { AuthService } from './auth.service';

const mockUserService = {
  findByUsername: jest.fn(),
  createUser: jest.fn(),
};

const mockHashingService = {
  comparePasswords: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: typeof mockUserService;
  let hashingService: typeof mockHashingService;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUserService },
        { provide: HashingService, useValue: mockHashingService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UsersService);
    hashingService = module.get(HashingService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      } as IUser;
      userService.findByUsername.mockResolvedValue(mockUser);
      hashingService.comparePasswords.mockResolvedValue(true);

      const result = await authService.validateUser('testuser', 'password');

      expect(result).toEqual(mockUser);
      expect(userService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(hashingService.comparePasswords).toHaveBeenCalledWith(
        'password',
        'hashedpassword',
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      userService.findByUsername.mockResolvedValue(null);

      await expect(
        authService.validateUser('testuser', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return an access token', async () => {
      const mockUser = { id: 1, username: 'testuser' } as IUser;
      const payload = { username: mockUser.username, sub: mockUser.id };
      jwtService.sign.mockReturnValue('mockToken');

      const result = await authService.signIn(mockUser);

      expect(result).toEqual({ access_token: 'mockToken' });
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('signUp', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        password: 'password',
        email: 'newuser@example.com',
      };
      const mockUser = { id: 1, ...createUserDto } as IUser;
      userService.createUser.mockResolvedValue(mockUser);

      const result = await authService.signUp(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { HashingService } from '@modules/hashing/hashing.service';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let wishRepository: Repository<Wish>;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Wish),
          useClass: Repository,
        },
        {
          provide: HashingService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    wishRepository = module.get<Repository<Wish>>(getRepositoryToken(Wish));
    hashingService = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password',
        avatar: 'https://i.pravatar.cc/150?img=3',
        about: 'Hello world',
      };
      const hashedPassword = 'hashedpassword';
      const newUser = {
        ...createUserDto,
        id: 1,
        password: hashedPassword,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(hashingService, 'hashPassword')
        .mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'create').mockReturnValue(newUser as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(newUser as any);

      expect(await service.createUser(createUserDto)).toEqual(newUser);
    });

    it('should throw ConflictException if username or email already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        email: 'existinguser@example.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as any);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, username: 'user1', email: 'user1@example.com' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as any);

      expect(await service.findById(1)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updateduser' };
      const updatedUser = {
        id: 1,
        username: 'updateduser',
        email: 'user@example.com',
      };

      jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(service, 'findById').mockResolvedValue(updatedUser as any);

      expect(await service.updateUser(1, updateUserDto)).toEqual(updatedUser);
    });
  });

  describe('getUserWishes', () => {
    it('should return an array of wishes for the user', async () => {
      const wishes = [{ id: 1, name: 'Wish 1' }];
      jest.spyOn(wishRepository, 'find').mockResolvedValue(wishes as any);

      expect(await service.getUserWishes(1)).toEqual(wishes);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const user = { id: 1, username: 'user1', email: 'user1@example.com' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);

      expect(await service.findByUsername('user1')).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findByUsername('nonexistentuser')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserWishesByUsername', () => {
    it('should return an array of wishes for a user found by username', async () => {
      const wishes = [{ id: 1, name: 'Wish 1' }];
      const user = { id: 1, username: 'user1' };

      jest.spyOn(service, 'findByUsername').mockResolvedValue(user as any);
      jest.spyOn(service, 'getUserWishes').mockResolvedValue(wishes as any);

      expect(await service.getUserWishesByUsername('user1')).toEqual(wishes);
    });
  });

  describe('findUsers', () => {
    it('should return an array of users by query', async () => {
      const users = [
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' },
      ];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users as any);

      expect(await service.findUsers('user')).toEqual(users);
    });
  });
});

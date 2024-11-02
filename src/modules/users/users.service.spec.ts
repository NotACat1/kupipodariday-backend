import { Test, TestingModule } from '@nestjs/testing';

import { AuthGuard } from '@nestjs/passport';
import { NotFoundException } from '@nestjs/common';
import { IUser } from '@type/user.interface';

import { UpdateUserDto } from './dto/update.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Wish } from '@/entities/wish.entity';

const mockUsersService = {
  findById: jest.fn(),
  updateUser: jest.fn(),
  getUserWishes: jest.fn(),
  findByUsername: jest.fn(),
  getUserWishesByUsername: jest.fn(),
  findUsers: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: Partial<jest.Mocked<UsersService>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should return the current user', async () => {
      const mockUser: IUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        about: 'Test user bio',
        avatar: 'http://example.com/avatar.png',
        offers: [],
        password: 'testpassword',
        wishes: [],
        wishlists: [],
      };
      service.findById.mockResolvedValue(mockUser);

      const req = { user: { id: 1 } } as any;
      expect(await controller.getMe(req)).toEqual(mockUser);
      expect(service.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateMe', () => {
    it('should update and return the current user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      const mockUser: IUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        about: 'Test user bio',
        avatar: 'http://example.com/avatar.png',
        offers: [],
        password: 'testpassword',
        wishes: [],
        wishlists: [],
      };

      service.updateUser.mockResolvedValue(mockUser);

      const req = { user: { id: 1 } } as any;
      expect(await controller.updateMe(req, updateUserDto)).toEqual(mockUser);
      expect(service.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('getMyWishes', () => {
    it("should return the current user's wishes", async () => {
      const mockWishes: Wish[] = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Sample Wish',
          link: 'http://example.com/wish',
          image: 'http://example.com/image.jpg',
          price: 100,
          raised: 50,
          owner: null, // Замените на нужный объект User
          description: 'Sample description',
          offers: [], // Или массив объектов Offer
          copied: 0,
          originalWish: null, // Или другой объект Wish, если нужен
        },
      ];
      service.getUserWishes.mockResolvedValue(mockWishes);

      const req = { user: { id: 1 } } as any;
      expect(await controller.getMyWishes(req)).toEqual(mockWishes);
      expect(service.getUserWishes).toHaveBeenCalledWith(1);
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      const mockUser: IUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        about: 'Test user bio',
        avatar: 'http://example.com/avatar.png',
        offers: [],
        password: 'testpassword',
        wishes: [],
        wishlists: [],
      };
      service.findByUsername.mockResolvedValue(mockUser);

      expect(await controller.getUserByUsername('testuser')).toEqual(mockUser);
      expect(service.findByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      service.findByUsername.mockRejectedValue(new NotFoundException());

      await expect(controller.getUserByUsername('unknownuser')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserWishesByUsername', () => {
    it('should return wishes of a user by username', async () => {
      const mockWishes: Wish[] = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Sample Wish',
          link: 'http://example.com/wish',
          image: 'http://example.com/image.jpg',
          price: 100,
          raised: 50,
          owner: null,
          description: 'Sample description',
          offers: [],
          copied: 0,
          originalWish: null,
        },
      ];
      service.getUserWishesByUsername.mockResolvedValue(mockWishes);

      expect(await controller.getUserWishesByUsername('testuser')).toEqual(
        mockWishes,
      );
      expect(service.getUserWishesByUsername).toHaveBeenCalledWith('testuser');
    });
  });

  describe('findUsers', () => {
    it('should return an array of users matching the query', async () => {
      const mockUsers: IUser[] = [
        {
          id: 1,
          username: 'test1user',
          email: 'test1@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          about: 'Test user bio',
          avatar: 'http://example.com/avatar.png',
          offers: [],
          password: 'test1password',
          wishes: [],
          wishlists: [],
        },
        {
          id: 2,
          username: 'test2user',
          email: 'test2@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          about: 'Test user bio',
          avatar: 'http://example.com/avatar.png',
          offers: [],
          password: 'test2password',
          wishes: [],
          wishlists: [],
        },
      ];
      service.findUsers.mockResolvedValue(mockUsers);

      expect(await controller.findUsers('user')).toEqual(mockUsers);
      expect(service.findUsers).toHaveBeenCalledWith('user');
    });
  });
});

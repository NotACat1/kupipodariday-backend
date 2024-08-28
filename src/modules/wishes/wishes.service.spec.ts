import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Wish } from '@entities/wish.entity';
import { User } from '@entities/user.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create.dto';
import { UpdateWishDto } from './dto/update.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('WishesService', () => {
  let service: WishesService;
  let wishRepository: Repository<Wish>;
  let userRepository: Repository<User>;

  const mockWishRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishesService,
        { provide: getRepositoryToken(Wish), useValue: mockWishRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<WishesService>(WishesService);
    wishRepository = module.get<Repository<Wish>>(getRepositoryToken(Wish));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createWish', () => {
    it('should create and return a wish', async () => {
      const userId = 1;
      const createWishDto: CreateWishDto = {
        name: 'New Wish',
        link: 'https://example.com',
        image: 'https://example.com/image.jpg',
        price: 100,
        description: 'A new wish',
      };
      const user = { id: userId } as User;
      const wish = { ...createWishDto, owner: user } as Wish;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(wishRepository, 'create').mockReturnValue(wish);
      jest.spyOn(wishRepository, 'save').mockResolvedValue(wish);

      const result = await service.createWish(userId, createWishDto);
      expect(result).toEqual(wish);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 1;
      const createWishDto: CreateWishDto = {
        name: 'New Wish',
        link: 'https://example.com',
        image: 'https://example.com/image.jpg',
        price: 100,
        description: 'A new wish',
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.createWish(userId, createWishDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getLastWishes', () => {
    it('should return an array of wishes', async () => {
      const wishes = [
        { name: 'Wish 1', createdAt: new Date() },
        { name: 'Wish 2', createdAt: new Date() },
      ] as Wish[];

      jest.spyOn(wishRepository, 'find').mockResolvedValue(wishes);

      const result = await service.getLastWishes();
      expect(result).toEqual(wishes);
    });
  });

  describe('getTopWishes', () => {
    it('should return an array of top wishes', async () => {
      const wishes = [
        { name: 'Top Wish 1', copied: 10 },
        { name: 'Top Wish 2', copied: 5 },
      ] as Wish[];

      jest.spyOn(wishRepository, 'find').mockResolvedValue(wishes);

      const result = await service.getTopWishes();
      expect(result).toEqual(wishes);
    });
  });

  describe('getWishById', () => {
    it('should return a wish by id', async () => {
      const wishId = 1;
      const wish = { id: wishId, name: 'Wish 1' } as Wish;

      jest.spyOn(wishRepository, 'findOne').mockResolvedValue(wish);

      const result = await service.getWishById(wishId);
      expect(result).toEqual(wish);
    });

    it('should throw NotFoundException if wish not found', async () => {
      const wishId = 1;

      jest.spyOn(wishRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getWishById(wishId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteWish', () => {
    it('should delete a wish', async () => {
      const userId = 1;
      const wishId = 1;
      const existingWish = { id: wishId, owner: { id: userId } } as Wish;

      jest.spyOn(service, 'getWishById').mockResolvedValue(existingWish);
      jest
        .spyOn(wishRepository, 'delete')
        .mockResolvedValue({ raw: {}, affected: 1 });

      await service.deleteWish(userId, wishId);
      expect(wishRepository.delete).toHaveBeenCalledWith(wishId);
    });

    it('should throw ForbiddenException if user does not own the wish', async () => {
      const userId = 2;
      const wishId = 1;
      const existingWish = { id: wishId, owner: { id: 1 } } as Wish;

      jest.spyOn(service, 'getWishById').mockResolvedValue(existingWish);

      await expect(service.deleteWish(userId, wishId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('copyWish', () => {
    it('should copy a wish and update the original wish', async () => {
      const userId = 2;
      const wishId = 1;
      const originalWish = {
        id: wishId,
        name: 'Original Wish',
        copied: 5,
        owner: { id: 1 },
      } as Wish;
      const user = { id: userId } as User;
      const copiedWish = {
        ...originalWish,
        id: 2,
        owner: user,
        copied: 0,
      } as Wish;

      jest.spyOn(service, 'getWishById').mockResolvedValue(originalWish);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(wishRepository, 'create').mockReturnValue(copiedWish);
      jest.spyOn(wishRepository, 'save').mockResolvedValue(copiedWish);
      jest.spyOn(wishRepository, 'save').mockResolvedValue(originalWish);

      const result = await service.copyWish(userId, wishId);
      expect(result).toEqual(originalWish);
      expect(originalWish.copied).toBe(6); // Проверка, что счетчик увеличился
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = 2;
      const wishId = 1;
      const originalWish = {
        id: wishId,
        name: 'Original Wish',
        copied: 5,
        owner: { id: 1 },
      } as Wish;

      jest.spyOn(service, 'getWishById').mockResolvedValue(originalWish);
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.copyWish(userId, wishId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Wish } from '@entities/wish.entity';
import { User } from '@entities/user.entity';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create.dto';
import { UpdateWishDto } from './dto/update.dto';

const mockWishRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
});

describe('WishesService', () => {
  let service: WishesService;
  let wishRepository: Partial<jest.Mocked<Repository<Wish>>>;
  let userRepository: Partial<jest.Mocked<Repository<User>>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishesService,
        {
          provide: getRepositoryToken(Wish),
          useFactory: mockWishRepository,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<WishesService>(WishesService);
    wishRepository = module.get<Partial<jest.Mocked<Repository<Wish>>>>(
      getRepositoryToken(Wish),
    );
    userRepository = module.get<Partial<jest.Mocked<Repository<User>>>>(
      getRepositoryToken(User),
    );
  });

  describe('createWish', () => {
    it('should create and return a new wish', async () => {
      const mockUser = { id: 1 } as User;
      const createWishDto = { name: 'New Wish' } as CreateWishDto;
      const mockWish = { id: 1, owner: mockUser, ...createWishDto } as Wish;

      userRepository.findOneBy.mockResolvedValue(mockUser);
      wishRepository.create.mockReturnValue(mockWish);
      wishRepository.save.mockResolvedValue(mockWish);

      expect(await service.createWish(1, createWishDto)).toEqual(mockWish);
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.createWish(1, { name: 'New Wish' } as CreateWishDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getWishById', () => {
    it('should return a wish if found', async () => {
      const mockWish = { id: 1, name: 'Wish' } as Wish;
      wishRepository.findOne.mockResolvedValue(mockWish);

      expect(await service.getWishById(1)).toEqual(mockWish);
    });

    it('should throw NotFoundException if wish is not found', async () => {
      wishRepository.findOne.mockResolvedValue(null);
      await expect(service.getWishById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateWish', () => {
    it('should update and return the wish', async () => {
      const mockWish = {
        id: 1,
        owner: { id: 1 } as User,
        name: 'Updated Wish',
      } as Wish;
      const updateWishDto = { name: 'Updated Wish' } as UpdateWishDto;

      jest.spyOn(service, 'getWishById').mockResolvedValue(mockWish);
      wishRepository.update.mockResolvedValue(null);

      expect(await service.updateWish(1, 1, updateWishDto)).toEqual({
        ...mockWish,
        ...updateWishDto,
      });
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const mockWish = {
        id: 1,
        owner: { id: 2 } as User,
        name: 'Wish',
      } as Wish;
      jest.spyOn(service, 'getWishById').mockResolvedValue(mockWish);

      await expect(
        service.updateWish(1, 1, { name: 'Updated Wish' } as UpdateWishDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteWish', () => {
    it('should delete the wish successfully', async () => {
      const mockWish = { id: 1, owner: { id: 1 } as User } as Wish;
      jest.spyOn(service, 'getWishById').mockResolvedValue(mockWish);
      wishRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await expect(service.deleteWish(1, 1)).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const mockWish = { id: 1, owner: { id: 2 } as User } as Wish;
      jest.spyOn(service, 'getWishById').mockResolvedValue(mockWish);

      await expect(service.deleteWish(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('copyWish', () => {
    it('should copy and return a wish', async () => {
      const mockUser = { id: 1 } as User;
      const originalWish = { id: 1, owner: mockUser, copied: 1 } as Wish;
      const copiedWish = { id: 2, owner: mockUser, copied: 0 } as Wish;

      jest.spyOn(service, 'getWishById').mockResolvedValue(originalWish);
      userRepository.findOneBy.mockResolvedValue(mockUser);
      wishRepository.findOne.mockResolvedValue(null);
      wishRepository.create.mockReturnValue(copiedWish);
      wishRepository.save.mockResolvedValue(copiedWish);

      expect(await service.copyWish(1, 1)).toEqual(copiedWish);
    });

    it('should throw BadRequestException if wish has already been copied', async () => {
      const mockUser = { id: 1 } as User;
      const originalWish = { id: 1, owner: mockUser, copied: 1 } as Wish;
      const existingCopy = { id: 2, owner: mockUser } as Wish;

      jest.spyOn(service, 'getWishById').mockResolvedValue(originalWish);
      userRepository.findOneBy.mockResolvedValue(mockUser);
      wishRepository.findOne.mockResolvedValue(existingCopy);

      await expect(service.copyWish(1, 1)).rejects.toThrow(BadRequestException);
    });
  });
});

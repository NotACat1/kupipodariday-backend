import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Wishlist } from '@entities/wishlist.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';

import { WishlistsService } from './wishlists.service';

const mockWishlistRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
});

const mockWishRepository = () => ({
  findByIds: jest.fn(),
});

describe('WishlistsService', () => {
  let service: WishlistsService;
  let wishlistRepository: Partial<jest.Mocked<Repository<Wishlist>>>;
  let userRepository: Partial<jest.Mocked<Repository<User>>>;
  let wishRepository: Partial<jest.Mocked<Repository<Wish>>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        {
          provide: getRepositoryToken(Wishlist),
          useFactory: mockWishlistRepository,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Wish),
          useFactory: mockWishRepository,
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
    wishlistRepository = module.get<Partial<jest.Mocked<Repository<Wishlist>>>>(
      getRepositoryToken(Wishlist),
    );
    userRepository = module.get<Partial<jest.Mocked<Repository<User>>>>(
      getRepositoryToken(User),
    );
    wishRepository = module.get<Partial<jest.Mocked<Repository<Wish>>>>(
      getRepositoryToken(Wish),
    );
  });

  describe('findAll', () => {
    it('should return an array of wishlists', async () => {
      const mockWishlists = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Wishlist 1',
          description: 'Description 1',
          image: 'image-url',
          owner: { id: 1 } as User,
          items: [] as Wish[],
        },
      ];
      wishlistRepository.find.mockResolvedValue(mockWishlists);
      expect(await service.findAll(1)).toEqual(mockWishlists);
    });
  });

  describe('findById', () => {
    it('should return a wishlist if found', async () => {
      const mockWishlist = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Wishlist 1',
        description: 'Description 1',
        image: 'image-url',
        owner: { id: 1 } as User,
        items: [] as Wish[],
      };
      wishlistRepository.findOne.mockResolvedValue(mockWishlist);
      expect(await service.findById(1)).toEqual(mockWishlist);
    });

    it('should throw a NotFoundException if no wishlist is found', async () => {
      wishlistRepository.findOne.mockResolvedValue(null);
      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createWishlist', () => {
    it('should create and return a new wishlist', async () => {
      const mockUser = { id: 1 } as User;
      const mockItems = [{ id: 1 } as Wish];
      const createWishlistDto = {
        name: 'New Wishlist',
        description: 'New Description',
        image: 'new-image-url',
        itemsId: [1],
      };
      const mockWishlist = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: createWishlistDto.name,
        description: createWishlistDto.description,
        image: createWishlistDto.image,
        owner: mockUser,
        items: mockItems,
      };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      wishRepository.findByIds.mockResolvedValue(mockItems);
      wishlistRepository.create.mockReturnValue(mockWishlist);
      wishlistRepository.save.mockResolvedValue(mockWishlist);

      expect(await service.createWishlist(1, createWishlistDto)).toEqual(
        mockWishlist,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.createWishlist(1, {
          name: 'New Wishlist',
          description: 'Description',
          image: 'image-url',
          itemsId: [],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateWishlist', () => {
    it('should update and return the wishlist', async () => {
      const mockWishlist = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Wishlist 1',
        description: 'Description 1',
        image: 'image-url',
        owner: { id: 1 } as User,
        items: [] as Wish[],
      };
      const updateWishlistDto = {
        name: 'Updated Wishlist',
        description: 'Updated Description',
        image: 'updated-image-url',
      };

      service.findById = jest.fn().mockResolvedValue(mockWishlist);
      wishlistRepository.save.mockResolvedValue({
        ...mockWishlist,
        ...updateWishlistDto,
      });

      expect(await service.updateWishlist(1, 1, updateWishlistDto)).toEqual({
        ...mockWishlist,
        ...updateWishlistDto,
      });
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const mockWishlist = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Wishlist',
        description: 'Description',
        image: 'image-url',
        owner: { id: 2 } as User,
        items: [] as Wish[],
      };
      service.findById = jest.fn().mockResolvedValue(mockWishlist);

      await expect(
        service.updateWishlist(1, 1, { name: 'Updated Wishlist' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteWishlist', () => {
    it('should delete the wishlist successfully', async () => {
      const mockWishlist = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Wishlist',
        description: 'Description',
        image: 'image-url',
        owner: { id: 1 } as User,
        items: [] as Wish[],
      };

      service.findById = jest.fn().mockResolvedValue(mockWishlist);
      wishlistRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await expect(service.deleteWishlist(1, 1)).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const mockWishlist = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Wishlist',
        description: 'Description',
        image: 'image-url',
        owner: { id: 2 } as User,
        items: [] as Wish[],
      };
      service.findById = jest.fn().mockResolvedValue(mockWishlist);

      await expect(service.deleteWishlist(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if delete fails', async () => {
      const mockWishlist = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Wishlist',
        description: 'Description',
        image: 'image-url',
        owner: { id: 1 } as User,
        items: [] as Wish[],
      };

      service.findById = jest.fn().mockResolvedValue(mockWishlist);
      wishlistRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.deleteWishlist(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { WishlistsService } from './wishlists.service';
import { Wishlist } from '@entities/wishlist.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { CreateWishlistDto } from './dto/create.dto';
import { UpdateWishlistDto } from './dto/update.dto';

describe('WishlistsService', () => {
  let service: WishlistsService;
  let wishlistRepository: Repository<Wishlist>;
  let userRepository: Repository<User>;
  let wishRepository: Repository<Wish>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistsService,
        {
          provide: getRepositoryToken(Wishlist),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Wish),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WishlistsService>(WishlistsService);
    wishlistRepository = module.get<Repository<Wishlist>>(
      getRepositoryToken(Wishlist),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    wishRepository = module.get<Repository<Wish>>(getRepositoryToken(Wish));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of wishlists', async () => {
      const result = [{ id: 1, name: 'Wishlist 1', items: [] }];
      jest.spyOn(wishlistRepository, 'find').mockResolvedValue(result as any);

      expect(await service.findAll(1)).toBe(result);
    });
  });

  describe('findById', () => {
    it('should return a wishlist by id', async () => {
      const result = { id: 1, name: 'Wishlist 1', items: [] };
      jest
        .spyOn(wishlistRepository, 'findOne')
        .mockResolvedValue(result as any);

      expect(await service.findById(1)).toBe(result);
    });

    it('should throw NotFoundException if wishlist not found', async () => {
      jest.spyOn(wishlistRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createWishlist', () => {
    it('should create and return a new wishlist', async () => {
      const createWishlistDto: CreateWishlistDto = {
        name: 'New Wishlist',
        itemsId: [],
      };
      const user = { id: 1 };
      const items = [];
      const result = { id: 1, ...createWishlistDto, items };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user as any);
      jest.spyOn(wishRepository, 'findByIds').mockResolvedValue(items as any);
      jest.spyOn(wishlistRepository, 'create').mockReturnValue(result as any);
      jest.spyOn(wishlistRepository, 'save').mockResolvedValue(result as any);

      expect(await service.createWishlist(1, createWishlistDto)).toBe(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      const createWishlistDto: CreateWishlistDto = {
        name: 'New Wishlist',
        itemsId: [],
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.createWishlist(1, createWishlistDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateWishlist', () => {
    it('should update and return the wishlist', async () => {
      const updateWishlistDto: UpdateWishlistDto = {
        name: 'Updated Wishlist',
        itemsId: [],
      };
      const existingWishlist = { id: 1, name: 'Old Wishlist', items: [] };
      const updatedWishlist = { id: 1, ...updateWishlistDto, items: [] };

      jest
        .spyOn(service, 'findById')
        .mockResolvedValue(existingWishlist as any);
      jest.spyOn(wishRepository, 'findByIds').mockResolvedValue([] as any);
      jest
        .spyOn(wishlistRepository, 'save')
        .mockResolvedValue(updatedWishlist as any);

      expect(await service.updateWishlist(1, updateWishlistDto)).toBe(
        updatedWishlist,
      );
    });
  });

  describe('deleteWishlist', () => {
    it('should delete the wishlist', async () => {
      jest
        .spyOn(wishlistRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(service.deleteWishlist(1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException if deletion fails', async () => {
      jest
        .spyOn(wishlistRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteWishlist(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

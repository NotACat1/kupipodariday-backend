import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { Offer } from '@entities/offer.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { WishesService } from '@modules/wishes/wishes.service';

import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create.dto';

const mockOfferRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
});

const mockWishRepository = () => ({
  findOne: jest.fn(),
});

const mockWishesService = {
  updateWish: jest.fn(),
};

describe('OffersService', () => {
  let service: OffersService;
  let offerRepository: Partial<jest.Mocked<Repository<Offer>>>;
  let userRepository: Partial<jest.Mocked<Repository<User>>>;
  let wishRepository: Partial<jest.Mocked<Repository<Wish>>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        { provide: getRepositoryToken(Offer), useFactory: mockOfferRepository },
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: getRepositoryToken(Wish), useFactory: mockWishRepository },
        { provide: WishesService, useValue: mockWishesService },
      ],
    }).compile();

    service = module.get<OffersService>(OffersService);
    offerRepository = module.get(getRepositoryToken(Offer));
    userRepository = module.get(getRepositoryToken(User));
    wishRepository = module.get(getRepositoryToken(Wish));
  });

  describe('createOffer', () => {
    it('should create a new offer if all validations pass', async () => {
      const mockUser = { id: 1 } as User;
      const mockWish = {
        id: 1,
        owner: { id: 2 },
        raised: 0,
        price: 100,
      } as Wish;
      const createOfferDto: CreateOfferDto = { amount: 50, itemId: 1 };
      const mockOffer = {
        id: 1,
        amount: 50,
        user: mockUser,
        item: mockWish,
        createdAt: new Date(),
        updatedAt: new Date(),
        hidden: false,
      };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      wishRepository.findOne.mockResolvedValue(mockWish);
      offerRepository.create.mockReturnValue(mockOffer);
      offerRepository.save.mockResolvedValue(mockOffer);

      const result = await service.createOffer(mockUser.id, createOfferDto);
      expect(result).toEqual(mockOffer);
    });

    it('should throw NotFoundException if user or wish is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);
      await expect(
        service.createOffer(1, { amount: 50, itemId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user tries to contribute to their own wish', async () => {
      const mockUser = { id: 1 } as User;
      const mockWish = {
        id: 1,
        owner: { id: 1 },
        raised: 0,
        price: 100,
      } as Wish;

      userRepository.findOneBy.mockResolvedValue(mockUser);
      wishRepository.findOne.mockResolvedValue(mockWish);

      await expect(
        service.createOffer(mockUser.id, { amount: 50, itemId: 1 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if total amount exceeds wish price', async () => {
      const mockUser = { id: 1 } as User;
      const mockWish = {
        id: 1,
        owner: { id: 2 },
        raised: 80,
        price: 100,
      } as Wish;

      userRepository.findOneBy.mockResolvedValue(mockUser);
      wishRepository.findOne.mockResolvedValue(mockWish);

      await expect(
        service.createOffer(mockUser.id, { amount: 30, itemId: 1 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllOffers', () => {
    it('should return all offers with relations', async () => {
      const mockOffers = [
        { id: 1, amount: 50, user: { id: 1 }, item: { id: 1 } } as Offer,
      ];
      offerRepository.find.mockResolvedValue(mockOffers);

      expect(await service.getAllOffers()).toEqual(mockOffers);
    });
  });

  describe('getOfferById', () => {
    it('should return an offer if found', async () => {
      const mockOffer = {
        id: 1,
        amount: 50,
        user: { id: 1 },
        item: { id: 1 },
      } as Offer;
      offerRepository.findOne.mockResolvedValue(mockOffer);

      expect(await service.getOfferById(1)).toEqual(mockOffer);
    });

    it('should throw NotFoundException if offer is not found', async () => {
      offerRepository.findOne.mockResolvedValue(null);
      await expect(service.getOfferById(1)).rejects.toThrow(NotFoundException);
    });
  });
});

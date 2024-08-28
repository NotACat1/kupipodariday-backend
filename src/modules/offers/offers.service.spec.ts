import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OffersService } from './offers.service';
import { Offer } from '@entities/offer.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { CreateOfferDto } from './dto/create.dto';
import { IOffer } from '@type/offer.interface';
import { WishesService } from '@modules/wishes/wishes.service';

describe('OffersService', () => {
  let service: OffersService;
  let offerRepository: Repository<Offer>;
  let userRepository: Repository<User>;
  let wishRepository: Repository<Wish>;
  let wishesService: WishesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        WishesService,
        {
          provide: getRepositoryToken(Offer),
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

    service = module.get<OffersService>(OffersService);
    offerRepository = module.get<Repository<Offer>>(getRepositoryToken(Offer));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    wishRepository = module.get<Repository<Wish>>(getRepositoryToken(Wish));
    wishesService = module.get<WishesService>(WishesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOffer', () => {
    it('should create and return an offer', async () => {
      const createOfferDto: CreateOfferDto = {
        itemId: 1,
        amount: 100.0,
        hidden: false,
      };

      const user = { id: 1 } as User;
      const wish = {
        id: 1,
        owner: { id: 2 },
        raised: 50.0,
        price: 200.0,
      } as Wish;

      const result: IOffer = {
        id: 1,
        item: wish,
        user,
        amount: 100.0,
        hidden: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(wishRepository, 'findOne').mockResolvedValue(wish);
      jest.spyOn(offerRepository, 'create').mockReturnValue(result);
      jest.spyOn(offerRepository, 'save').mockResolvedValue(result);
      jest.spyOn(wishesService, 'updateWish').mockResolvedValue({} as any);

      expect(await service.createOffer(1, createOfferDto)).toBe(result);
      expect(wishesService.updateWish).toHaveBeenCalledWith(1, 1, {
        raised: 150.0,
      });
    });

    it('should throw NotFoundException if user or wish is not found', async () => {
      const createOfferDto: CreateOfferDto = {
        itemId: 1,
        amount: 100.0,
        hidden: false,
      };

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(wishRepository, 'findOne')
        .mockResolvedValue({ id: 1 } as Wish);

      await expect(service.createOffer(1, createOfferDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user tries to contribute to their own wish', async () => {
      const createOfferDto: CreateOfferDto = {
        itemId: 1,
        amount: 100.0,
        hidden: false,
      };

      const user = { id: 1 } as User;
      const wish = {
        id: 1,
        owner: { id: 1 },
        raised: 50.0,
        price: 200.0,
      } as Wish;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(wishRepository, 'findOne').mockResolvedValue(wish);

      await expect(service.createOffer(1, createOfferDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw BadRequestException if total amount exceeds wish price', async () => {
      const createOfferDto: CreateOfferDto = {
        itemId: 1,
        amount: 200.0,
        hidden: false,
      };

      const user = { id: 1 } as User;
      const wish = {
        id: 1,
        owner: { id: 2 },
        raised: 50.0,
        price: 200.0,
      } as Wish;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(wishRepository, 'findOne').mockResolvedValue(wish);

      await expect(service.createOffer(1, createOfferDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAllOffers', () => {
    it('should return an array of offers', async () => {
      const result: IOffer[] = [
        {
          id: 1,
          item: { id: 1 } as Wish,
          user: { id: 1 } as User,
          amount: 100.0,
          hidden: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as IOffer,
      ];
      jest.spyOn(offerRepository, 'find').mockResolvedValue(result);

      expect(await service.getAllOffers()).toBe(result);
    });
  });

  describe('getOfferById', () => {
    it('should return an offer by id', async () => {
      const result: IOffer = {
        id: 1,
        item: { id: 1 } as Wish,
        user: { id: 1 } as User,
        amount: 100.0,
        hidden: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(result);

      expect(await service.getOfferById(1)).toBe(result);
    });

    it('should throw NotFoundException if offer not found', async () => {
      jest.spyOn(offerRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getOfferById(1)).rejects.toThrow(NotFoundException);
    });
  });
});

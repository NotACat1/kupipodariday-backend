import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Offer } from '@entities/offer.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { CreateOfferDto } from './dto/create.dto';
import { UpdateWishDto } from '@modules/wishes/dto/update.dto';
import { WishesService } from '@modules/wishes/wishes.service';
import { IOffer } from '@type/offer.interface';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly wishesService: WishesService,
  ) {}

  async createOffer(
    userId: number,
    createOfferDto: CreateOfferDto,
  ): Promise<IOffer> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner'],
    });

    if (!user || !wish) {
      throw new NotFoundException('User or Wish not found');
    }

    if (wish.owner.id === userId) {
      throw new ForbiddenException('You cannot contribute to your own gifts');
    }

    const totalAmount = parseFloat(
      (Number(wish.raised) + Number(createOfferDto.amount)).toFixed(2),
    );
    if (totalAmount > wish.price) {
      throw new BadRequestException(
        'The total amount cannot exceed the price of the gift',
      );
    }

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    const savedOffer = await this.offerRepository.save(offer);

    await this.wishesService.updateWish(userId, createOfferDto.itemId, {
      raised: Number(wish.raised) + createOfferDto.amount,
    } as UpdateWishDto);

    return savedOffer;
  }

  async getAllOffers(): Promise<IOffer[]> {
    return this.offerRepository.find({ relations: ['user', 'item'] });
  }

  async getOfferById(id: number): Promise<IOffer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }
}

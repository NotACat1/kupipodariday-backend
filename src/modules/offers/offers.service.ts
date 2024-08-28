import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Offer } from '@entities/offer.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { CreateOfferDto } from './dto/create.dto';
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
  ) {}

  async createOffer(
    userId: number,
    createOfferDto: CreateOfferDto,
  ): Promise<IOffer> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const wish = await this.wishRepository.findOneBy({
      id: createOfferDto.itemId,
    });

    if (!user || !wish) {
      throw new NotFoundException('User or Wish not found');
    }

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    return this.offerRepository.save(offer);
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

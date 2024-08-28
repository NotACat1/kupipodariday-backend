import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wish } from '@entities/wish.entity';
import { User } from '@entities/user.entity';
import { CreateWishDto } from './dto/create.dto';
import { UpdateWishDto } from './dto/update.dto';
import { IWish } from '@type/wish.interface';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createWish(
    userId: number,
    createWishDto: CreateWishDto,
  ): Promise<IWish> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const wish = this.wishRepository.create({ ...createWishDto, owner: user });
    return this.wishRepository.save(wish);
  }

  async getLastWishes(): Promise<IWish[]> {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getTopWishes(): Promise<IWish[]> {
    return this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 10,
    });
  }

  async getWishById(id: number): Promise<IWish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) throw new NotFoundException('Wish not found');
    return wish;
  }

  async updateWish(
    userId: number,
    id: number,
    updateWishDto: UpdateWishDto,
  ): Promise<IWish> {
    const wish = await this.getWishById(id);
    if (wish.owner.id !== userId)
      throw new ForbiddenException('You do not own this wish');

    await this.wishRepository.update(id, updateWishDto);
    return this.getWishById(id);
  }

  async deleteWish(userId: number, id: number): Promise<void> {
    const wish = await this.getWishById(id);
    if (wish.owner.id !== userId)
      throw new ForbiddenException('You do not own this wish');

    await this.wishRepository.delete(id);
  }

  async copyWish(userId: number, id: number): Promise<IWish> {
    const originalWish = await this.getWishById(id);

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const existingCopy = await this.wishRepository.findOne({
      where: {
        owner: { id: userId },
        originalWish: { id: originalWish.id },
      },
    });

    if (existingCopy) {
      throw new BadRequestException('You have already copied this wish');
    }

    const copiedWish = this.wishRepository.create({
      ...originalWish,
      owner: user,
      copied: 0,
    });

    originalWish.copied += 1;
    await this.wishRepository.save(originalWish);
    return this.wishRepository.save(copiedWish);
  }
}

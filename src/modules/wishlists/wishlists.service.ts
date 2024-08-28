import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from '@entities/wishlist.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { IWishlist } from '@type/wishlist.interface';
import { CreateWishlistDto } from './dto/create.dto';
import { UpdateWishlistDto } from './dto/update.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async findAll(userId: number): Promise<IWishlist[]> {
    return this.wishlistRepository.find({
      where: { owner: { id: userId } },
      relations: ['items'],
    });
  }

  async findById(id: number): Promise<IWishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async createWishlist(
    userId: number,
    createWishlistDto: CreateWishlistDto,
  ): Promise<IWishlist> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const items = await this.wishRepository.findByIds(
      createWishlistDto.itemsId,
    );
    const wishlist = this.wishlistRepository.create({
      ...createWishlistDto,
      owner: user,
      items,
    });
    return this.wishlistRepository.save(wishlist);
  }

  async updateWishlist(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<IWishlist> {
    const wishlist = await this.findById(id);

    if (updateWishlistDto.itemsId) {
      const items = await this.wishRepository.findByIds(
        updateWishlistDto.itemsId,
      );
      wishlist.items = items;
    }

    Object.assign(wishlist, updateWishlistDto);
    return this.wishlistRepository.save(wishlist);
  }

  async deleteWishlist(id: number): Promise<void> {
    const result = await this.wishlistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Wishlist not found');
    }
  }
}

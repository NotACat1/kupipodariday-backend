import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from '@entities/offer.entity';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { WishesModule } from '@modules/wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, User, Wish]), WishesModule],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import ormConfig from '@config/typeorm.config';
import { AuthModule } from '@modules/auth/auth.module';
import { HashingModule } from '@modules/hashing/hashing.module';
import { OffersModule } from '@modules/offers/offers.module';
import { UsersModule } from '@modules/users/users.module';
import { WishesModule } from '@modules/wishes/wishes.module';
import { WishlistsModule } from '@modules/wishlists/wishlists.module';
import { AppController } from '@/app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    OffersModule,
    UsersModule,
    WishesModule,
    WishlistsModule,
    HashingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

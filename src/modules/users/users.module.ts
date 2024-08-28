import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HashingModule } from '@modules/hashing/hashing.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), HashingModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { Wishlist } from '@entities/wishlist.entity';
import { Offer } from '@entities/offer.entity';

dotenv.config();

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Wish, Wishlist, Offer],
  synchronize: true,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  logging: true,
};

export default ormConfig;

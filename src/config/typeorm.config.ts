import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { CustomTypeOrmLogger } from './CustomTypeOrmLogger';

import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { Wishlist } from '@entities/wishlist.entity';
import { Offer } from '@entities/offer.entity';

dotenv.config();

const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Wish, Wishlist, Offer],
  synchronize: true,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  logging: true,
  logger: new CustomTypeOrmLogger(),
};

export default ormConfig;

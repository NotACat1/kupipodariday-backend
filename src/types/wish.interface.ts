import { User } from '@entities/user.entity';
import { Offer } from '@entities/offer.entity';

export interface IWish {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  link: string;
  image: string;
  price: number;
  raised: number;
  owner: User;
  description: string;
  offers: Offer[];
  copied: number;
}

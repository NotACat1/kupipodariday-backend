import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';

export interface IWishlist {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  image: string;
  owner: User;
  items: Wish[];
}

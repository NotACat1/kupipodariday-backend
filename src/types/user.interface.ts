import { Wish } from '@entities/wish.entity';
import { Offer } from '@entities/offer.entity';
import { Wishlist } from '@entities/wishlist.entity';

export interface IUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
  wishes: Wish[];
  offers: Offer[];
  wishlists: Wishlist[];
}

import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';

export interface IOffer {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  item: Wish;
  amount: number;
  hidden: boolean;
}

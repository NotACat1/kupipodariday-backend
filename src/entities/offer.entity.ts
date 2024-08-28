import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNumber, Min, IsBoolean } from 'class-validator';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.offers)
  user: User;

  @ManyToOne(() => Wish, wish => wish.offers)
  item: Wish;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}

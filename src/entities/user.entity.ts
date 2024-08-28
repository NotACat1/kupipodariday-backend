import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsString, Length, IsUrl } from 'class-validator';
import { Wish } from '@entities/wish.entity';
import { Offer } from '@entities/offer.entity';
import { Wishlist } from '@entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, wish => wish.owner, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  wishes: Wish[];

  @OneToMany(() => Offer, offer => offer.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  offers: Offer[];

  @OneToMany(() => Wishlist, wishlist => wishlist.owner, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];
}

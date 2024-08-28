import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, Length, IsUrl } from 'class-validator';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 1500)
  description: string;

  @Column({ nullable: true })
  @IsUrl()
  image: string;

  @ManyToOne(() => User, user => user.wishlists, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}

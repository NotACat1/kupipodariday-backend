import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsString, Length, IsUrl, IsNumber, Min } from 'class-validator';
import { User } from '@entities/user.entity';
import { Offer } from '@entities/offer.entity';

@Entity()
export class Wish {
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
  @IsUrl()
  link: string;

  @Column({ nullable: true })
  @IsUrl()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  raised: number;

  @ManyToOne(() => User, user => user.wishes, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ManyToMany(() => Offer, offer => offer.item, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  offers: Offer[];

  @Column('int', { default: 0 })
  @IsNumber()
  copied: number;

  @ManyToOne(() => Wish, { nullable: true })
  originalWish: Wish;
}

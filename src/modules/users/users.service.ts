import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashingService } from '@modules/hashing/hashing.service';
import { User } from '@entities/user.entity';
import { Wish } from '@entities/wish.entity';
import { IUser } from '@type/user.interface';
import { UpdateUserDto } from './dto/update.dto';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly hashingService: HashingService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    const { username, email, password, avatar, about } = createUserDto;

    // Проверка уникальности username и email
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Хеширование пароля
    const hashedPassword = await this.hashingService.hashPassword(password);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || 'https://i.pravatar.cc/300',
      about: about || 'Пока ничего не рассказал о себе',
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async findById(id: number): Promise<IUser> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async getUserWishes(userId: number): Promise<Wish[]> {
    return this.wishRepository.find({ where: { owner: { id: userId } } });
  }

  async findByUsername(username: string): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserWishesByUsername(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);
    return this.getUserWishes(user.id);
  }

  async findUsers(query: string): Promise<IUser[]> {
    return this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }
}

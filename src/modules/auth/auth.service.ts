import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashingService } from '@modules/hashing/hashing.service';
import { UsersService } from '@modules/users/users.service';
import { CreateUserDto } from '@modules/users/dto/create.dto';
import { IUser } from '@type/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<IUser> {
    const user = await this.userService.findByUsername(username);
    if (
      user &&
      (await this.hashingService.comparePasswords(password, user.password))
    ) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signIn(user: IUser) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<IUser> {
    const user = await this.userService.createUser({
      ...createUserDto,
      password: createUserDto.password,
    });
    return user;
  }
}

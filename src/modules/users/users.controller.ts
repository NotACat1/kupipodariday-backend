import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { UsersService } from './users.service';
import { IUser } from '@type/user.interface';
import { UpdateUserDto } from './dto/update.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // GET /users/me
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request): Promise<IUser> {
    return this.userService.findById(req.user['id']);
  }

  // PATCH /users/me
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  updateMe(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.updateUser(req.user['id'], updateUserDto);
  }

  // GET /users/me/wishes
  @UseGuards(AuthGuard('jwt'))
  @Get('me/wishes')
  getMyWishes(@Req() req: Request) {
    return this.userService.getUserWishes(req.user['id']);
  }

  // GET /users/:username
  @Get(':username')
  getUserByUsername(@Param('username') username: string): Promise<IUser> {
    return this.userService.findByUsername(username);
  }

  // GET /users/:username/wishes
  @Get(':username/wishes')
  getUserWishesByUsername(@Param('username') username: string) {
    return this.userService.getUserWishesByUsername(username);
  }

  // POST /users/find
  @Post('find')
  findUsers(@Body('query') query: string): Promise<IUser[]> {
    return this.userService.findUsers(query);
  }
}

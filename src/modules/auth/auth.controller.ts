import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '@modules/users/dto/create.dto';
import { LocalAuthGuard } from './guards/local.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    // Регистрация пользователя
    const { password, ...user } = await this.authService.signUp(createUserDto);
    return { message: 'User successfully registered', user };
  }

  @UseGuards(LocalAuthGuard) // Guard для защиты маршрута с использованием локальной стратегии
  @Post('signin')
  async signIn(@Request() req) {
    // Авторизация пользователя и генерация JWT токена
    return this.authService.signIn(req.user);
  }
}

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create.dto';
import { UpdateWishDto } from './dto/update.dto';
import { IWish } from '@type/wish.interface';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishService: WishesService) {}

  // POST /wishes
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createWish(
    @Req() req: Request,
    @Body() createWishDto: CreateWishDto,
  ): Promise<IWish> {
    return this.wishService.createWish(req.user['id'], createWishDto);
  }

  // GET /wishes/last
  @Get('last')
  getLastWishes(): Promise<IWish[]> {
    return this.wishService.getLastWishes();
  }

  // GET /wishes/top
  @Get('top')
  getTopWishes(): Promise<IWish[]> {
    return this.wishService.getTopWishes();
  }

  // GET /wishes/:id
  @Get(':id')
  getWishById(@Param('id') id: number): Promise<IWish> {
    return this.wishService.getWishById(id);
  }

  // PATCH /wishes/:id
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateWish(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<IWish> {
    return this.wishService.updateWish(req.user['id'], id, updateWishDto);
  }

  // DELETE /wishes/:id
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteWish(@Req() req: Request, @Param('id') id: number): Promise<void> {
    return this.wishService.deleteWish(req.user['id'], id);
  }

  // POST /wishes/:id/copy
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/copy')
  copyWish(@Req() req: Request, @Param('id') id: number): Promise<IWish> {
    return this.wishService.copyWish(req.user['id'], id);
  }
}

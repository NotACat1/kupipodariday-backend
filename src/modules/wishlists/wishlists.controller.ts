import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { WishlistsService } from './wishlists.service';
import { IWishlist } from '@type/wishlist.interface';
import { CreateWishlistDto } from './dto/create.dto';
import { UpdateWishlistDto } from './dto/update.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistService: WishlistsService) {}

  // GET /wishlists
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllWishlists(@Req() req: Request): Promise<IWishlist[]> {
    return this.wishlistService.findAll(req.user['id']);
  }

  // POST /wishlists
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createWishlist(
    @Req() req: Request,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<IWishlist> {
    return this.wishlistService.createWishlist(
      req.user['id'],
      createWishlistDto,
    );
  }

  // GET /wishlists/:id
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getWishlistById(@Param('id') id: number): Promise<IWishlist> {
    const wishlist = await this.wishlistService.findById(id);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  // PATCH /wishlists/:id
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<IWishlist> {
    return this.wishlistService.updateWishlist(id, updateWishlistDto);
  }

  // DELETE /wishlists/:id
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteWishlist(@Param('id') id: number): Promise<void> {
    return this.wishlistService.deleteWishlist(id);
  }
}

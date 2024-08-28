import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { OffersService } from './offers.service';
import { IOffer } from '@type/offer.interface';
import { CreateOfferDto } from './dto/create.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offerService: OffersService) {}

  // POST /offers
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createOffer(
    @Req() req: Request,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<IOffer> {
    const userId = req.user['id'];
    return this.offerService.createOffer(userId, createOfferDto);
  }

  // GET /offers
  @Get()
  getAllOffers(): Promise<IOffer[]> {
    return this.offerService.getAllOffers();
  }

  // GET /offers/:id
  @Get(':id')
  getOfferById(@Param('id') id: number): Promise<IOffer> {
    return this.offerService.getOfferById(id);
  }
}

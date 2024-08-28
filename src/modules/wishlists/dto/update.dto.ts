import { PartialType } from '@nestjs/mapped-types';

import { CreateWishlistDto } from './create.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {}

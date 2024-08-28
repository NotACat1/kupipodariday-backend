import {
  IsString,
  Length,
  IsOptional,
  IsUrl,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 1500)
  description?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsArray()
  @IsInt({ each: true })
  itemsId: number[];
}

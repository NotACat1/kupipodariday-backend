import { IsString, Length, IsUrl, IsNumber, Min } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @Length(1, 250)
  name?: string;

  @IsUrl()
  link?: string;

  @IsUrl()
  image?: string;

  @IsNumber()
  @Min(0)
  price?: number;

  @IsString()
  @Length(1, 1024)
  description?: string;

  @IsNumber()
  @Min(0)
  raised?: number;
}

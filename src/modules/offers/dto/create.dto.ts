import { IsNumber, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden?: boolean = false;

  @IsNumber()
  itemId: number;
}

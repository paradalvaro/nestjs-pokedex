import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  //@IsNumberString()
  @IsNumber()
  @Min(1)
  limit?: number;
  @IsOptional()
  @IsPositive()
  //@IsNumberString()
  @IsNumber()
  offset?: number;
}

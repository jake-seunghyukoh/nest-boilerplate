import { QueryParamsInterface } from '@interfaces/queryParams.interface';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryParamsDto implements QueryParamsInterface {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  @IsOptional()
  pageLimit: number;

  @Transform(({ value }) => value.trim().split(','))
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  orders: string[];
}

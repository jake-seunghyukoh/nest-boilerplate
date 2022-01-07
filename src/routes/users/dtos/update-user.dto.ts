import { IsBoolean, IsOptional } from 'class-validator';

export default class UpdateUserDto {
  @IsOptional()
  @IsBoolean()
  readonly verified: boolean = false;
}

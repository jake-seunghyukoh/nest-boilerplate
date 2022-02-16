import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { NameEntity } from 'src/schemas/common.entity';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(4)
  @MaxLength(32)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NameEntity)
  name: NameEntity;
}

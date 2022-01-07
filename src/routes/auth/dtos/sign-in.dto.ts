import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class SignInDto {
  constructor(body: SignInDto | null = null) {
    if (body) {
      this.email = body.email;
      this.password = body.password;
    }
  }

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
}

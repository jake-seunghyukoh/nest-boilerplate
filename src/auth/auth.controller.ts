import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto): Promise<string> {
    const result = await this.authService.signUp(signupDto);
    if (result) return 'success';
    else throw new HttpException('Duplicate username', HttpStatus.CONFLICT);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() { user }: { user: User }): Promise<any> {
    return { access_token: await this.authService.signIn(user) };
  }

  @Delete()
  async deleteAccount() {
    return 'Delete Account';
  }
}

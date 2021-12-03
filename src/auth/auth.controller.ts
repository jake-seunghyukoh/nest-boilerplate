import {
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async signUp() {
    return 'SignUp';
  }

  @UseGuards(LocalAuthGuard)
  @Get()
  async signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Delete()
  async deleteAccount() {
    return 'Delete Account';
  }
}

import { LocalAuthGuard } from '@guards/local-auth.guard';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@routes/auth/auth.service';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { UsersService } from '@routes/users/users.service';
import { Request as ExpressRequest } from 'express';
import { authConstants } from './auth-constants';
import ResponseUtils from '@utils/response.utils';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersSerivce: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<SuccessResponseInterface | never> {
    const { userId, email } = await this.usersSerivce.createUser(signUpDto);

    const token = this.authService.createVerifyToken(userId);

    await this.mailerService.sendMail({
      to: email,
      from: process.env.MAILER_FROM_EMAIL,
      subject: authConstants.mailer.verifyEmail.subject,
      template: `./src/templates/verify-password`,
      context: {
        token,
        email,
        host: process.env.SERVER_HOST,
      },
    });

    return ResponseUtils.success('auth', {
      message: 'Success! please verify your email',
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req: ExpressRequest): Promise<any> {
    return;
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto): Promise<any> {
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('verify/:token')
  async verifyUser(
    @Param('token') token: string,
  ): Promise<SuccessResponseInterface | never> {
    const { id } = await this.authService.verifyTokenWithSecret(
      token,
      authConstants.jwt.secrets.accessToken,
    );

    const user = await this.usersSerivce.getUnverifiedUserById(id);

    if (!user) {
      throw new NotFoundException('User does not exists');
    }
    return ResponseUtils.success(
      'users',
      await this.usersSerivce.update(user.userId, { verified: true }),
    );
  }

  @Delete()
  async deleteAccount() {
    return 'Delete Account';
  }
}

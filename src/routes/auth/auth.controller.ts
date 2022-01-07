import { LocalAuthGuard } from '@guards/local-auth.guard';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
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
import { AuthService } from '@routes/auth/auth.service';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { UserEntity } from '@routes/users/schemas/user.entity';
import { UsersService } from '@routes/users/users.service';
import ResponseUtils from '@utils/response.utils';
import { Request as ExpressRequest } from 'express';
import { authConstants } from './auth-constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
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
  async signIn(
    @Request() req: ExpressRequest,
  ): Promise<SuccessResponseInterface | never> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = req.user as UserEntity;

    return ResponseUtils.success('tokens', await this.authService.login(user));
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

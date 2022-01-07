import { LocalAuthGuard } from '@guards/local-auth.guard';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authConstants } from '@routes/auth/auth-constants';
import { AuthService } from '@routes/auth/auth.service';
import RefreshTokenDto from '@routes/auth/dtos/refresh-token.dto';
import { SignUpDto } from '@routes/auth/dtos/sign-up.dto';
import { DecodedUser } from '@routes/auth/interfaces/decoded-user.interface';
import { UserEntity } from '@routes/users/schemas/user.entity';
import { UsersService } from '@routes/users/users.service';
import ResponseUtils from '@utils/response.utils';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersSerivce: UsersService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
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

  @HttpCode(HttpStatus.CREATED)
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<any> {
    const decodedUser = this.jwtService.decode(
      refreshTokenDto.refreshToken,
    ) as DecodedUser;

    if (!decodedUser) {
      throw new ForbiddenException('Incorrect token');
    }

    const oldRefreshToken: string | null =
      await this.authService.getRefreshTokenByEmail(decodedUser.email);

    if (!oldRefreshToken || oldRefreshToken !== refreshTokenDto.refreshToken) {
      throw new UnauthorizedException(
        'Authentication credentials were missing or incorrect',
      );
    }

    const payload = {
      userId: decodedUser.userId,
      email: decodedUser.email,
    };

    return ResponseUtils.success(
      'tokens',
      await this.authService.login(payload),
    );
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

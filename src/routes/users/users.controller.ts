import Serialize from '@decorators/serialization.decorator';
import { JwtAccessGuard } from '@guards/jwt-access.guard';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@routes/users/users.service';
import ResponseUtils from '@utils/response.utils';
import { AllUsersResponseEntity } from './entities/user-response.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':userId')
  @UseGuards(JwtAccessGuard)
  @Serialize(AllUsersResponseEntity)
  async getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    const foundUser = await this.usersService.getVerifiedUserById(userId);

    if (!foundUser) {
      throw new NotFoundException('The user does not exist');
    }

    return ResponseUtils.success('users', foundUser);
  }
}

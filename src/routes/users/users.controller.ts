import Serialize from '@decorators/serialization.decorator';
import { JwtAccessGuard } from '@guards/jwtAccess.guard';
import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';
import { PaginationParamsInterface } from '@interfaces/paginationParams.interface';
import { SuccessResponseInterface } from '@interfaces/successResponse.interface';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '@routes/users/users.service';
import PaginationUtils from '@utils/pagination.utils';
import ResponseUtils from '@utils/response.utils';
import { AllUsersResponseEntity } from './entities/userResponse.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  @Serialize(AllUsersResponseEntity)
  async getAllVerifiedUsers(
    @Query() query: any,
  ): Promise<SuccessResponseInterface | never> {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);

    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedUsers: PaginatedUsersInterface =
      await this.usersService.getAllVerifiedWithPagination(paginationParams);

    return ResponseUtils.success('users', paginatedUsers.paginatedResult, {
      location: 'users',
      paginationParams,
      totalCount: paginatedUsers.totalCount,
    });
  }

  @Get(':userId')
  @UseGuards(JwtAccessGuard)
  @Serialize(AllUsersResponseEntity)
  async getUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<SuccessResponseInterface | never> {
    const foundUser = await this.usersService.getVerifiedUserById(userId);

    if (!foundUser) {
      throw new NotFoundException('The user does not exist');
    }

    return ResponseUtils.success('users', foundUser);
  }
}

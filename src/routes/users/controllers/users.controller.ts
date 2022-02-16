import Serialize from '@decorators/serialization.decorator';
import { JwtAccessGuard } from '@guards/jwtAccess.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
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
  UseInterceptors,
} from '@nestjs/common';
import { AllUsersResponseEntity } from '@routes/users/entities/userResponse.entity';
import { UsersService } from '@routes/users/users.service';
import PaginationUtils from '@utils/pagination.utils';
import ResponseUtils from '@utils/response.utils';

@UseInterceptors(WrapResponseInterceptor)
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
      PaginationUtils.normalizeParams(query);

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

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  @Serialize(AllUsersResponseEntity)
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseInterface | never> {
    const foundUser = await this.usersService.getVerifiedUserById(id);

    if (!foundUser) {
      throw new NotFoundException('The user does not exist');
    }

    return ResponseUtils.success('users', foundUser);
  }
}

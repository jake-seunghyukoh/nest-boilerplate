import Serialize from '@decorators/serialization.decorator';
import { JwtAccessGuard } from '@guards/jwtAccess.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginatedUsersInterface } from '@interfaces/paginatedEntity.interface';
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
import paginationUtils from '@utils/pagination.utils';
import queryParamsUtils from '@utils/queryParams.utils';
import ResponseUtils from '@utils/response.utils';
import { QueryParamsDto } from 'src/dtos/queryParams.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAccessGuard)
  @Serialize(AllUsersResponseEntity)
  async getAllVerifiedUsers(
    @Query() query: QueryParamsDto,
  ): Promise<SuccessResponseInterface | never> {
    const params = queryParamsUtils.parseQueryParams(query);
    const paginationParams = paginationUtils.normalizeParams(query);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedUsers: PaginatedUsersInterface =
      await this.usersService.getAllVerifiedWithPagination(params);

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

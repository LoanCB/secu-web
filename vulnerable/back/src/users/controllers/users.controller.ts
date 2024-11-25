import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CommonSwaggerResponse } from 'src/common/helpers/common-swagger-config.helper';
import { CustomHttpException } from 'src/common/helpers/custom.exception';
import { ErrorCodesService } from 'src/common/services/error-codes.service';
import { PaginatedList } from 'src/common/types/pagination-params.types';
import { Roles } from '../decorators/roles.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { PatchUserDto } from '../dto/patch-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersListDto } from '../dto/users-list.dto';
import { User } from '../entities/users.entity';
import { RolesGuard } from '../guards/roles.guard';
import {
  SwaggerUserCreate,
  SwaggerUserFindAll,
  SwaggerUserFindOne,
  SwaggerUserPatch,
  SwaggerUserUpdate,
} from '../helpers/user-set-decorators.helper';
import { RoleType } from '../types/role-type';
import { UsersService } from './../services/users.service';

@Controller({
  path: 'users',
  version: ['1'],
})
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Users')
@CommonSwaggerResponse()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly errorCodesService: ErrorCodesService,
  ) {}

  @Post()
  @Roles(RoleType.ADMINISTRATOR)
  @SwaggerUserCreate()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = createdUser;
    return rest;
  }

  @Get()
  @Roles(RoleType.ADMINISTRATOR)
  @SwaggerUserFindAll()
  async findAll(@Query() query: UsersListDto): Promise<PaginatedList<User>> {
    const [users, currentResults, totalResults] = await this.usersService.findAll(query);
    return { ...query, totalResults, currentResults, results: users };
  }

  @Get(':id')
  @Roles(RoleType.ADMINISTRATOR)
  @SwaggerUserFindOne()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usersService.findOneById(id);
    } catch (error) {
      throw new CustomHttpException(
        'USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
        this.errorCodesService.get('USER_NOT_FOUND', id),
      );
    }
  }

  @Patch(':id')
  @Roles(RoleType.ADMINISTRATOR)
  @SwaggerUserUpdate()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: ExpressRequest,
  ) {
    const user = await this.usersService.findOneById(id);
    const loggedUser = req.user as User;

    if (!user) {
      throw new CustomHttpException(
        'USER_NOT_FOUND',
        HttpStatus.NOT_FOUND,
        this.errorCodesService.get('USER_NOT_FOUND', id),
      );
    }

    if (loggedUser.role.name !== RoleType.ADMINISTRATOR) {
      if (user.id !== loggedUser.id) {
        throw new CustomHttpException('FORBIDDEN_EDIT_USER', HttpStatus.FORBIDDEN);
      } else {
        delete updateUserDto.role;
      }
    }

    return await this.usersService.update(user, updateUserDto);
  }

  @Patch(':id/archive')
  @Roles(RoleType.ADMINISTRATOR)
  @HttpCode(204)
  @SwaggerUserPatch()
  async updateUserState(
    @Param('id', ParseIntPipe) id: number,
    @Body() patchUserDto: PatchUserDto,
    @Request() req: ExpressRequest,
  ) {
    const loggedUser = req.user as User;
    if (loggedUser.id === id) {
      throw new CustomHttpException('ARCHIVE_HIMSELF', HttpStatus.BAD_REQUEST);
    }

    await this.usersService.softDelete(id, patchUserDto);
  }
}

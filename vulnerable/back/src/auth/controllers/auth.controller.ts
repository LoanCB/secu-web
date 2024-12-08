import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from 'src/users/entities/users.entity';
import { LoginDto } from 'src/users/dto/login.dto';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommonSwaggerResponse } from 'src/common/helpers/common-swagger-config.helper';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { CustomHttpException } from 'src/common/helpers/custom.exception';

@Controller({
  path: 'auth',
  version: ['1'],
})
@UseGuards(RolesGuard)
@ApiBearerAuth()
@ApiTags('Auth')
@CommonSwaggerResponse()
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: ExpressRequest): User {
    const user = req.user;

    if (!user) {
      throw new CustomHttpException('REQUEST_USER_NOT_FOUND', 404);
    }

    return user as User;
  }
}

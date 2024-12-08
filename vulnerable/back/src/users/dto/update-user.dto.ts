import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { RoleType } from '../types/role-type';
import { Match } from 'src/common/decorators/match-fields.decorator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(3, { message: 'First name contains a minimum of 3 characters' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(3, { message: 'Last name contains a minimum of 3 characters' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({ example: 'john-doe@example.com' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Azerty123#' })
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: 'Azerty123#' })
  @IsStrongPassword()
  @Match<UpdateUserDto>('password')
  @IsOptional()
  confirmPassword?: string;

  @ApiPropertyOptional({ enum: RoleType, example: RoleType.READ_ONLY })
  @IsEnum(RoleType, { message: `Unknown type. Allowed values : ${Object.values(RoleType).join(' | ')}` })
  @IsOptional()
  role?: RoleType;
}

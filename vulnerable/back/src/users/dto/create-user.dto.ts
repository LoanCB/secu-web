import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { RoleType } from '../types/role-type';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Role } from '../entities/roles.entity';
import { Match } from 'src/common/decorators/match-fields.decorator';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({ example: 'john-doe@example.com' })
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'azerty123' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiProperty({ example: 'azerty123' })
  @IsStrongPassword()
  @IsNotEmpty({ message: 'confirmPassword is required' })
  @Match<CreateUserDto>('password')
  confirmPassword: string;

  @ApiProperty({ enum: RoleType, example: RoleType.READ_ONLY })
  @IsEnum(RoleType, { message: `Unknown type. Allowed values : ${Object.values(RoleType).join(' | ')}` })
  @IsNotEmpty({ message: 'Role is required' })
  role: RoleType;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'Please provide Boolean value for isActive property' })
  @IsNotEmpty({ message: 'isActive property is required' })
  isActive: boolean;
}

export class FormattedCreatedUserDto extends OmitType(CreateUserDto, ['role']) {
  role: Role | null;
}
